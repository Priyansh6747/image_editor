import io
from typing import Optional

import cv2
import numpy as np
from fastapi import FastAPI, UploadFile, File, HTTPException, Form
from fastapi.responses import StreamingResponse, JSONResponse
from fastapi.routing import APIRouter

TextRouter = APIRouter()


class SteganographyException(Exception):
    pass


class LSBSteg:
    def __init__(self, im):
        self.image = im
        self.height, self.width, self.nbchannels = im.shape
        self.size = self.width * self.height

        self.maskONEValues = [1, 2, 4, 8, 16, 32, 64, 128]
        self.maskONE = self.maskONEValues.pop(0)

        self.maskZEROValues = [254, 253, 251, 247, 239, 223, 191, 127]
        self.maskZERO = self.maskZEROValues.pop(0)

        self.curwidth = 0
        self.curheight = 0
        self.curchan = 0

    def put_binary_value(self, bits):
        for c in bits:
            val = list(self.image[self.curheight, self.curwidth])
            if int(c) == 1:
                val[self.curchan] = int(val[self.curchan]) | self.maskONE
            else:
                val[self.curchan] = int(val[self.curchan]) & self.maskZERO

            self.image[self.curheight, self.curwidth] = tuple(val)
            self.next_slot()

    def next_slot(self):
        if self.curchan == self.nbchannels - 1:
            self.curchan = 0
            if self.curwidth == self.width - 1:
                self.curwidth = 0
                if self.curheight == self.height - 1:
                    self.curheight = 0
                    if self.maskONE == 128:
                        raise SteganographyException("No available slot remaining (image filled)")
                    else:
                        self.maskONE = self.maskONEValues.pop(0)
                        self.maskZERO = self.maskZEROValues.pop(0)
                else:
                    self.curheight += 1
            else:
                self.curwidth += 1
        else:
            self.curchan += 1

    def read_bit(self):
        val = self.image[self.curheight, self.curwidth][self.curchan]
        val = int(val) & self.maskONE
        self.next_slot()
        if val > 0:
            return "1"
        else:
            return "0"

    def read_byte(self):
        return self.read_bits(8)

    def read_bits(self, nb):
        bits = ""
        for i in range(nb):
            bits += self.read_bit()
        return bits

    def byteValue(self, val):
        return self.binary_value(val, 8)

    def binary_value(self, val, bitsize):
        binval = bin(val)[2:]
        if len(binval) > bitsize:
            raise SteganographyException("binary value larger than the expected size")
        while len(binval) < bitsize:
            binval = "0" + binval
        return binval

    def encode_binary(self, data):
        l = len(data)
        if self.width * self.height * self.nbchannels < l + 64:
            raise SteganographyException("Carrier image not big enough to hold all the data")
        self.put_binary_value(self.binary_value(l, 64))
        for byte in data:
            byte = byte if isinstance(byte, int) else ord(byte)
            self.put_binary_value(self.byteValue(byte))
        return self.image

    def decode_binary(self):
        l = int(self.read_bits(64), 2)
        output = b""
        for i in range(l):
            output += bytearray([int(self.read_byte(), 2)])
        return output


@TextRouter.get("/")
async def root():
    return {
        "message": "Steganography API",
        "endpoints": {
            "/encode": "POST - Hide data in an image",
            "/decode": "POST - Extract hidden data from an image",
            "/check": "POST - Check if image has hidden data"
        }
    }


@TextRouter.post("/encode")
async def encode(
        carrier_image: UploadFile = File(..., description="The carrier image to hide data in"),
        secret_file: UploadFile = File(..., description="The file to hide (text, image, zip, etc.)")
):
    """
    Encode/hide a file inside a carrier image.
    Returns the modified PNG image with hidden data.
    """
    try:
        # Read carrier image
        carrier_bytes = await carrier_image.read()
        carrier_array = np.frombuffer(carrier_bytes, np.uint8)
        carrier_img = cv2.imdecode(carrier_array, cv2.IMREAD_COLOR)

        if carrier_img is None:
            raise HTTPException(status_code=400, detail="Invalid carrier image format")

        # Read secret file
        secret_data = await secret_file.read()

        # Calculate capacity
        height, width, channels = carrier_img.shape
        max_bytes = (width * height * channels) - 64  # 64 bits for length

        if len(secret_data) > max_bytes:
            raise HTTPException(
                status_code=400,
                detail=f"File too large. Carrier can hold max {max_bytes} bytes, but file is {len(secret_data)} bytes"
            )

        # Encode
        steg = LSBSteg(carrier_img)
        result_img = steg.encode_binary(secret_data)

        # Encode to PNG (lossless format required)
        success, encoded_img = cv2.imencode('.png', result_img)
        if not success:
            raise HTTPException(status_code=500, detail="Failed to encode image")

        # Return as streaming response
        return StreamingResponse(
            io.BytesIO(encoded_img.tobytes()),
            media_type="image/png",
            headers={
                "Content-Disposition": f"attachment; filename=encoded_{carrier_image.filename.rsplit('.', 1)[0]}.png",
                "X-Original-Filename": secret_file.filename,
                "X-Hidden-Size": str(len(secret_data))
            }
        )

    except SteganographyException as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error: {str(e)}")


@TextRouter.post("/decode")
async def decode(
        steg_image: UploadFile = File(..., description="The image with hidden data"),
        output_filename: Optional[str] = Form(None, description="Name for the extracted file")
):
    """
    Decode/extract hidden data from a steganography image.
    Returns the hidden file.
    """
    try:
        # Read steganography image
        img_bytes = await steg_image.read()
        img_array = np.frombuffer(img_bytes, np.uint8)
        img = cv2.imdecode(img_array, cv2.IMREAD_COLOR)

        if img is None:
            raise HTTPException(status_code=400, detail="Invalid image format")

        # Decode
        steg = LSBSteg(img)
        hidden_data = steg.decode_binary()

        if len(hidden_data) == 0:
            raise HTTPException(status_code=404, detail="No hidden data found in image")

        # Determine filename
        if not output_filename:
            output_filename = "extracted_file.bin"

        # Try to detect file type
        content_type = "application/octet-stream"
        if hidden_data.startswith(b'\x89PNG'):
            content_type = "image/png"
            if not output_filename.endswith('.png'):
                output_filename += '.png'
        elif hidden_data.startswith(b'\xff\xd8\xff'):
            content_type = "image/jpeg"
            if not output_filename.endswith(('.jpg', '.jpeg')):
                output_filename += '.jpg'
        elif hidden_data.startswith(b'PK'):
            content_type = "application/zip"
            if not output_filename.endswith('.zip'):
                output_filename += '.zip'
        elif all(32 <= byte < 127 or byte in (9, 10, 13) for byte in hidden_data[:100]):
            content_type = "text/plain"
            if not output_filename.endswith('.txt'):
                output_filename += '.txt'

        return StreamingResponse(
            io.BytesIO(hidden_data),
            media_type=content_type,
            headers={
                "Content-Disposition": f"attachment; filename={output_filename}",
                "X-Extracted-Size": str(len(hidden_data))
            }
        )

    except SteganographyException as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error: {str(e)}")


@TextRouter.post("/check")
async def check_image(
        image: UploadFile = File(..., description="Image to check for hidden data")
):
    """
    Check if an image contains hidden data and return metadata.
    """
    try:
        # Read image
        img_bytes = await image.read()
        img_array = np.frombuffer(img_bytes, np.uint8)
        img = cv2.imdecode(img_array, cv2.IMREAD_COLOR)

        if img is None:
            raise HTTPException(status_code=400, detail="Invalid image format")

        height, width, channels = img.shape
        max_capacity = (width * height * channels) - 64

        try:
            # Try to read hidden data length
            steg = LSBSteg(img)
            length = int(steg.read_bits(64), 2)

            has_data = 0 < length <= max_capacity

            return JSONResponse({
                "has_hidden_data": has_data,
                "hidden_data_size": length if has_data else 0,
                "image_dimensions": {
                    "width": width,
                    "height": height,
                    "channels": channels
                },
                "max_capacity_bytes": max_capacity
            })

        except Exception:
            return JSONResponse({
                "has_hidden_data": False,
                "hidden_data_size": 0,
                "image_dimensions": {
                    "width": width,
                    "height": height,
                    "channels": channels
                },
                "max_capacity_bytes": max_capacity
            })

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error: {str(e)}")



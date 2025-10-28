import io
from typing import Optional

import cv2
import numpy as np
from fastapi import FastAPI, UploadFile, File, HTTPException, Form
from fastapi.responses import StreamingResponse, JSONResponse
from fastapi.routing import APIRouter

ImageRouter = APIRouter()


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


@ImageRouter.get("/")
async def root():
    return {
        "message": "Image Steganography API",
        "endpoints": {
            "/encode-image": "POST - Hide an image inside another image",
            "/decode-image": "POST - Extract hidden image from a carrier image",
            "/check-capacity": "POST - Check if carrier can hold secret image"
        }
    }


@ImageRouter.post("/check-capacity")
async def check_capacity(
        carrier_image: UploadFile = File(..., description="The carrier image"),
        secret_image: UploadFile = File(..., description="The image to hide")
):
    try:
        # Read carrier image
        carrier_bytes = await carrier_image.read()
        carrier_array = np.frombuffer(carrier_bytes, np.uint8)
        carrier_img = cv2.imdecode(carrier_array, cv2.IMREAD_COLOR)

        if carrier_img is None:
            raise HTTPException(status_code=400, detail="Invalid carrier image format")

        # Read secret image
        secret_bytes = await secret_image.read()
        secret_array = np.frombuffer(secret_bytes, np.uint8)
        secret_img = cv2.imdecode(secret_array, cv2.IMREAD_COLOR)

        if secret_img is None:
            raise HTTPException(status_code=400, detail="Invalid secret image format")

        # Calculate dimensions
        carrier_h, carrier_w, carrier_c = carrier_img.shape
        secret_h, secret_w, secret_c = secret_img.shape

        # Encode secret image to PNG to get actual byte size
        success, encoded_secret = cv2.imencode('.png', secret_img)
        if not success:
            raise HTTPException(status_code=500, detail="Failed to encode secret image")

        secret_size = len(encoded_secret.tobytes())

        # Calculate carrier capacity (in bytes)
        # 64 bits (8 bytes) reserved for storing data length
        carrier_capacity = (carrier_w * carrier_h * carrier_c) - 8

        # Check if encoding is possible
        can_encode = secret_size <= carrier_capacity
        usage_percent = (secret_size / carrier_capacity * 100) if carrier_capacity > 0 else 0

        return JSONResponse({
            "can_encode": can_encode,
            "carrier_info": {
                "dimensions": f"{carrier_w}x{carrier_h}",
                "channels": carrier_c,
                "capacity_bytes": carrier_capacity,
                "capacity_mb": round(carrier_capacity / (1024 * 1024), 2)
            },
            "secret_info": {
                "dimensions": f"{secret_w}x{secret_h}",
                "channels": secret_c,
                "size_bytes": secret_size,
                "size_kb": round(secret_size / 1024, 2)
            },
            "analysis": {
                "bytes_available": carrier_capacity - secret_size if can_encode else 0,
                "usage_percent": round(usage_percent, 2),
                "recommendation": "Encoding possible" if can_encode else
                f"Carrier too small. Need {secret_size - carrier_capacity} more bytes of capacity"
            }
        })

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error: {str(e)}")


@ImageRouter.post("/encode-image")
async def encode_image(
        carrier_image: UploadFile = File(..., description="The carrier image to hide data in"),
        secret_image: UploadFile = File(..., description="The image to hide inside carrier")
):
    try:
        # Read carrier image
        carrier_bytes = await carrier_image.read()
        carrier_array = np.frombuffer(carrier_bytes, np.uint8)
        carrier_img = cv2.imdecode(carrier_array, cv2.IMREAD_COLOR)

        if carrier_img is None:
            raise HTTPException(status_code=400, detail="Invalid carrier image format")

        # Read secret image
        secret_bytes = await secret_image.read()
        secret_array = np.frombuffer(secret_bytes, np.uint8)
        secret_img = cv2.imdecode(secret_array, cv2.IMREAD_COLOR)

        if secret_img is None:
            raise HTTPException(status_code=400, detail="Invalid secret image format")

        # Encode secret image to PNG (lossless) to get bytes
        success, encoded_secret = cv2.imencode('.png', secret_img)
        if not success:
            raise HTTPException(status_code=500, detail="Failed to encode secret image")

        secret_data = encoded_secret.tobytes()

        # Calculate capacity
        height, width, channels = carrier_img.shape
        max_bytes = (width * height * channels) - 8  # 64 bits for length

        if len(secret_data) > max_bytes:
            raise HTTPException(
                status_code=400,
                detail=f"Secret image too large. Carrier can hold max {max_bytes} bytes ({round(max_bytes / 1024, 2)} KB), "
                       f"but secret image is {len(secret_data)} bytes ({round(len(secret_data) / 1024, 2)} KB). "
                       f"Try using a larger carrier image or compress the secret image."
            )

        # Encode
        steg = LSBSteg(carrier_img)
        result_img = steg.encode_binary(secret_data)

        # Encode to PNG (lossless format required for steganography)
        success, encoded_img = cv2.imencode('.png', result_img)
        if not success:
            raise HTTPException(status_code=500, detail="Failed to encode result image")

        # Get dimensions for metadata
        secret_h, secret_w, _ = secret_img.shape

        # Return as streaming response
        return StreamingResponse(
            io.BytesIO(encoded_img.tobytes()),
            media_type="image/png",
            headers={
                "Content-Disposition": f"attachment; filename=steg_{carrier_image.filename.rsplit('.', 1)[0]}.png",
                "X-Secret-Dimensions": f"{secret_w}x{secret_h}",
                "X-Secret-Size": str(len(secret_data)),
                "X-Original-Secret": secret_image.filename
            }
        )

    except SteganographyException as e:
        raise HTTPException(status_code=400, detail=str(e))
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error: {str(e)}")


@ImageRouter.post("/decode-image")
async def decode_image(
        steg_image: UploadFile = File(..., description="The image with hidden image data"),
        output_format: Optional[str] = Form("png", description="Output format (png, jpg, bmp)")
):
    try:
        # Validate output format
        valid_formats = ["png", "jpg", "jpeg", "bmp"]
        output_format = output_format.lower()
        if output_format not in valid_formats:
            output_format = "png"

        # Read steganography image
        img_bytes = await steg_image.read()
        img_array = np.frombuffer(img_bytes, np.uint8)
        img = cv2.imdecode(img_array, cv2.IMREAD_COLOR)

        if img is None:
            raise HTTPException(status_code=400, detail="Invalid image format")

        # Decode hidden data
        steg = LSBSteg(img)
        hidden_data = steg.decode_binary()

        if len(hidden_data) == 0:
            raise HTTPException(status_code=404, detail="No hidden data found in image")

        # Try to decode as image
        hidden_array = np.frombuffer(hidden_data, np.uint8)
        hidden_img = cv2.imdecode(hidden_array, cv2.IMREAD_COLOR)

        if hidden_img is None:
            raise HTTPException(
                status_code=400,
                detail="Hidden data found but could not be decoded as an image. "
                       "The hidden data might not be an image or may be corrupted."
            )

        # Re-encode in requested format
        ext_map = {"png": ".png", "jpg": ".jpg", "jpeg": ".jpg", "bmp": ".bmp"}
        mime_map = {"png": "image/png", "jpg": "image/jpeg", "jpeg": "image/jpeg", "bmp": "image/bmp"}

        extension = ext_map.get(output_format, ".png")
        mime_type = mime_map.get(output_format, "image/png")

        success, output_img = cv2.imencode(extension, hidden_img)
        if not success:
            raise HTTPException(status_code=500, detail="Failed to encode extracted image")

        height, width, channels = hidden_img.shape

        return StreamingResponse(
            io.BytesIO(output_img.tobytes()),
            media_type=mime_type,
            headers={
                "Content-Disposition": f"attachment; filename=extracted_image{extension}",
                "X-Image-Dimensions": f"{width}x{height}",
                "X-Image-Channels": str(channels),
                "X-Extracted-Size": str(len(output_img.tobytes()))
            }
        )

    except SteganographyException as e:
        raise HTTPException(status_code=400, detail=str(e))
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error: {str(e)}")
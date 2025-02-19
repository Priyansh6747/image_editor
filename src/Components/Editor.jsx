﻿import PropTypes from "prop-types";
import {useEffect, useRef, useState} from "react";
import RangeMenu from "./RangeMenu.jsx";
import Toolbar from "./tools/Toolbar.jsx";
import init ,{
    update_img , rotate_right , greyscale , sepia , invert , blur_image ,
    apply_color_pop , apply_vignette , apply_vintage ,apply_crop
} from "./../../wasm_pkg/RUST.js"
import Download from "./Buttons/Download.jsx";
import Crop from "./tools/CropUI.jsx"

window.addEventListener('beforeunload', function (e) {
    const message = "Are you sure you want to leave? Any unsaved changes will be lost.";
    e.returnValue = message;
    return message;
});



function Editor(props) {
    const imageRef = useRef(new Image());
    const CanvasRef = useRef(null);
    const [OrignalImgData, setOrignalImgData] = useState(null);
    const [Cheight, setHeight] = useState(props.IMG.height);
    const [Cwidth, setWidth] = useState(props.IMG.width);
    const [renderCrop, setRenderCrop] = useState(null);
    const [Blur , setBlur ] = useState(false);



    useEffect(() => {
        imageRef.current.src = URL.createObjectURL(new Blob([props.IMG]));
        imageRef.current.onload = () => {
            const canvas = CanvasRef.current;
            const context = canvas.getContext("2d");
            const imgWidth = imageRef.current.width;
            const imgHeight = imageRef.current.height;
            const maxCanvasWidth = window.innerWidth * 0.8;
            const maxCanvasHeight = window.innerHeight;
            const scaleFactor = Math.min(maxCanvasWidth / imgWidth, maxCanvasHeight / imgHeight);
            canvas.width = imgWidth * scaleFactor;
            canvas.height = imgHeight * scaleFactor;
            context.drawImage(imageRef.current, 0, 0, canvas.width, canvas.height);
            if(!OrignalImgData) setOrignalImgData(context.getImageData(0, 0, canvas.width, canvas.height));
            setHeight(canvas.height);
            setWidth(canvas.width);
        }
    },[props.IMG])


    const [Brightness, setBrightness] = useState(0);
    function handleBrightnessChange(e) {
        setBrightness(e.target.value);
        updateImage();
    }


    const [contrast, setContrast] = useState(0);
    function handleContrastChange(e) {
        setContrast(e.target.value);
        updateImage();
    }

    const [RGB, setRGB] = useState({red: 0, green: 0, blue: 0});
    function handleRGBChange(e) {
        const {name , value } = e.target;
        setRGB(prev => ({...prev, [name]: parseInt(value)}));
        updateImage();
    }

    const [resetCount , setResetCount] = useState(0);
    function increaseResetCount() {
        setResetCount(resetCount + 1);
    }

    function handleDownload(){
        const canvas = CanvasRef.current;
        canvas.toBlob((blob)=>{
            const link = document.createElement("a");
            link.href = URL.createObjectURL(blob);
            link.download = props.Name.split('.')[0] + " edited.png";
            link.click();
            setTimeout(() => URL.revokeObjectURL(link.href), 500);
        },"image/png");
    }
    function updateImage(){
        let context = CanvasRef.current.getContext("2d");
        let data = new Uint8Array(OrignalImgData.data);
        init().then(()=>{
            update_img(data,Brightness,contrast,RGB.red,RGB.green,RGB.blue);
            data = new Uint8ClampedArray(data.buffer);
            let newImageData = new ImageData(data, OrignalImgData.width, OrignalImgData.height);
            context.putImageData(newImageData, 0, 0);
        })
    }

    function rotateRight() {
        setRenderCrop(null);
        setBlur(false)
        let context = CanvasRef.current.getContext("2d");
        init().then(() => {
            rotate_right(OrignalImgData.data, OrignalImgData.width);
            let newW = OrignalImgData.height;
            let newH = OrignalImgData.width;
            setWidth(newW);
            setHeight(newH);
            let newImageData = new ImageData(
                new Uint8ClampedArray(OrignalImgData.data),
                newW,
                newH
            );
            setOrignalImgData({
                data: newImageData.data,
                width: newW,
                height: newH,
            });
            CanvasRef.current.width = newW;
            CanvasRef.current.height = newH;
            let data = new Uint8Array(newImageData.data);
            update_img(data,Brightness,contrast,RGB.red,RGB.green,RGB.blue);
            data = new Uint8ClampedArray(data.buffer);
            let newImage = new ImageData(data, newImageData.width, newImageData.height);
            context.putImageData(newImage, 0, 0);
        });
    }

    function greyScale(){
        init().then(() => {
            greyscale(OrignalImgData.data);
            PutImage();
        });
    }
    function Sepia(){
        init().then(() => {
            sepia(OrignalImgData.data);
            PutImage();
        });
    }function Invert(){
        init().then(() => {
            invert(OrignalImgData.data);
            PutImage();
        });
    }
    function ApplyBlur(strength){
        init().then(() => {
            blur_image(OrignalImgData.data , OrignalImgData.width , strength);
            PutImage();
        });
    }
    function initiateBlur(){
        setBlur(!Blur);
        setRenderCrop(null);
    }
    function PopColors(){
        init().then(() => {
            apply_color_pop(OrignalImgData.data);
            PutImage();
        });
    }

    function Vintage(){
        init().then(() => {
            apply_vintage(OrignalImgData.data);
            PutImage();
        })
    }

    function Vignette() {
        init().then(() => {
            apply_vignette(OrignalImgData.data , OrignalImgData.width , OrignalImgData.height);
            PutImage();
        })
    }

    function InitiateCrop(){
        if (renderCrop == null) {
            setRenderCrop(<Crop height={parseInt(Cheight)} width={parseInt(Cwidth)} ApplyCrop={ApplyCrop}/>);
            setBlur(false)
        }
        else setRenderCrop(null);
    }
    function ApplyCrop(cropArea){
        const adjustedCropArea = { ...cropArea, y: cropArea.y + 48 };
        init().then(() => {
            apply_crop(OrignalImgData.data, adjustedCropArea.width,
                adjustedCropArea.height, adjustedCropArea.x, adjustedCropArea.y,
                OrignalImgData.width, OrignalImgData.height);
            setWidth(adjustedCropArea.width);
            setHeight(adjustedCropArea.height);
            CanvasRef.current.width = adjustedCropArea.width;
            CanvasRef.current.height = adjustedCropArea.height;
            let newImageData = new ImageData(
                new Uint8ClampedArray(OrignalImgData.data),
                adjustedCropArea.width,
                adjustedCropArea.height
            );
            setOrignalImgData({
                data: newImageData.data,
                width: adjustedCropArea.width,
                height: adjustedCropArea.height,
            });
            PutImage();
        });
    }


    function PutImage(){
        let context = CanvasRef.current.getContext("2d");
        let newW = OrignalImgData.width;
        let newH = OrignalImgData.height;
        let newImageData = new ImageData(
            new Uint8ClampedArray(OrignalImgData.data),
            newW,
            newH
        );
        setOrignalImgData({
            data: newImageData.data,
            width: newW,
            height: newH,
        });
        CanvasRef.current.width = newW;
        CanvasRef.current.height = newH;
        let data = new Uint8Array(newImageData.data);
        update_img(data,Brightness,contrast,RGB.red,RGB.green,RGB.blue);
        data = new Uint8ClampedArray(data.buffer);
        let newImage = new ImageData(data, newImageData.width, newImageData.height);
        context.putImageData(newImage, 0, 0);
    }

    function reset() {
        setBlur(false);
        setRenderCrop(null);
        imageRef.current.src = URL.createObjectURL(new Blob([props.IMG]));
        imageRef.current.onload = () => {
            const canvas = CanvasRef.current;
            const context = canvas.getContext("2d");
            const imgWidth = imageRef.current.width;
            const imgHeight = imageRef.current.height;
            const maxCanvasWidth = window.innerWidth * 0.8;
            const maxCanvasHeight = window.innerHeight;
            const scaleFactor = Math.min(maxCanvasWidth / imgWidth, maxCanvasHeight / imgHeight);
            canvas.width = imgWidth * scaleFactor;
            canvas.height = imgHeight * scaleFactor;
            context.drawImage(imageRef.current, 0, 0, canvas.width, canvas.height);
            const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
            setOrignalImgData({
                data: imageData.data,
                width: canvas.width,
                height: canvas.height,
            });
            setBrightness(0);
            setContrast(0);
            setRGB({ red: 0, green: 0, blue: 0 });
            increaseResetCount();
        };
    }

    const styles = {
        container: {
            width: '100%',
            height: 'window.height',
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
        },
        CanvasContainer: {
            width: `${Cwidth}px`,
            maxWidth: '100%',
            height: `${Cheight}px`,
            maxHeight: `100%`,
            overflow: 'hidden',
            position: 'relative',
            zIndex: 1,
            paddingBottom: '1px',
        },
        Download:{
            position: 'absolute',
            top: 0,
            right: 10,
            padding: '2px',
            overflow: 'hidden',
        }
    }


    return (
        <div style={styles.container}>
            <Toolbar rotateRight={rotateRight} greyScale={greyScale} Sepia={Sepia} invert={Invert}
                     initiateCrop={InitiateCrop} Blur={initiateBlur} PopColor = {PopColors} Vignette={Vignette} Vintage={Vintage}
                     Reset={reset}
            />
            <div style={styles.CanvasContainer}>
                {renderCrop}
               <canvas ref={CanvasRef}/>
            </div>

            <RangeMenu handleBrightnessChange={handleBrightnessChange}
                       handleContrastChange={handleContrastChange}
                       handleRGBChange={handleRGBChange}
                       Brightness={parseInt(Brightness)} contrast={parseInt(contrast)} RGB={RGB}
                       Blur={Blur} setBlur = {setBlur} ApplyBlur={ApplyBlur} Reset={resetCount}/>
            <div style={styles.Download}>
                <Download HandleClick={handleDownload}/>
            </div>

        </div>
    )



}

export default Editor;
Editor.propTypes = {
    IMG: PropTypes.instanceOf(File).isRequired,
    Name: PropTypes.string,
}


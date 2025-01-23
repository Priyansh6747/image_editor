import PropTypes from "prop-types";
import {useEffect, useRef, useState} from "react";
import RangeMenu from "./RangeMenu.jsx";
import Toolbar from "./tools/Toolbar.jsx";
import init ,{update_img , rotate_right} from "./../../wasm_pkg/RUST.js"
import Download from "./Buttons/Download.jsx";

window.addEventListener('beforeunload', function (e) {
    const message = "Are you sure you want to leave? Any unsaved changes will be lost.";
    e.returnValue = message;
    return message;
});



function Editor(props) {
    const imageRef = useRef(new Image());
    const CanvasRef = useRef(null);
    const [OrignalImgData, setOrignalImgData] = useState(null);
    const [CurrentImage, setCurrentImage] = useState(null);



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
            if(!CurrentImage) setCurrentImage(context.getImageData(0, 0, canvas.width, canvas.height));
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
            let newImageData = new ImageData(data, OrignalImgData.height, OrignalImgData.width);
            context.putImageData(newImageData, 0, 0);
            setCurrentImage(newImageData);
        })
    }

    function rotateRight() {
        let context = CanvasRef.current.getContext("2d");
        let data = new Uint8Array(CurrentImage.data);
        init().then(()=>{
            rotate_right(data , CurrentImage.width);
            let newW = CurrentImage.height;
            let newH = CurrentImage.width;
            CanvasRef.current.width = newW;
            CanvasRef.current.height = newH;
            data = new Uint8ClampedArray(data.buffer);
            let newImageData = new ImageData(data, CurrentImage.height, CurrentImage.width);
            context.putImageData(newImageData, 0, 0);
            setCurrentImage(newImageData);
        })

    }

    return (
        <div style={styles.container}>
            <Toolbar/>
            <canvas ref={CanvasRef}/>
            <RangeMenu handleBrightnessChange={handleBrightnessChange}
                       handleContrastChange={handleContrastChange}
                       handleRGBChange={handleRGBChange}
                       Brightness={parseInt(Brightness)} contrast={parseInt(contrast)} RGB={RGB}/>
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

// Note the styling of DownloadBtn is in index.css
const styles = {
    container: {
        width: '100%',
        height: 'window.height',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    Download:{
        position: 'absolute',
        top: 0,
        right: 10,
        padding: '2px',
        overflow: 'hidden',
    }
}
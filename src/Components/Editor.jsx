import PropTypes from "prop-types";
import {useEffect, useRef, useState} from "react";
import RangeMenu from "./RangeMenu.jsx";
import Toolbar from "./tools/Toolbar.jsx";
import init ,{increase_brightness} from "./../../wasm_pkg/RUST.js"

window.addEventListener('beforeunload', function (e) {
    const message = "Are you sure you want to leave? Any unsaved changes will be lost.";
    e.returnValue = message;
    return message;
});



function Editor(props) {
    const imageRef = useRef(new Image());
    const CanvasRef = useRef(null);
    const [OrignalImgData, setOrignalImgData] = useState(null);

    useEffect(() => {
        imageRef.current.src = URL.createObjectURL(new Blob([props.IMG]));
        imageRef.current.onload = () => {
            const canvas = CanvasRef.current;
            const context = canvas.getContext("2d");
            canvas.height = imageRef.current.height > window.height ? window.height : imageRef.current.height;
            let newWidth = canvas.height  * (imageRef.current.width/imageRef.current.height);
            canvas.width = newWidth > window.width*0.8 ? window.width*0.8 : imageRef.current.width;
            context.drawImage(imageRef.current , 0, 0, canvas.width, canvas.height);
            if(!OrignalImgData) setOrignalImgData(context.getImageData(0, 0, canvas.width, canvas.height));
        }
    },[props.IMG])

    const [Brightness, setBrightness] = useState(0);
    function handleBrightnessChange(e) {
        setBrightness(e.target.value);
        let context = CanvasRef.current.getContext("2d");
        let data = new Uint8Array(OrignalImgData.data);
        let brightnessValue = parseInt(e.target.value, 10);
        init().then(()=>{
            increase_brightness(data , brightnessValue);
            data = new Uint8ClampedArray(data.buffer);
            let newImageData = new ImageData(data, OrignalImgData.width, OrignalImgData.height);
            context.putImageData(newImageData, 0, 0);
        });

    }


    const [contrast, setContrast] = useState(0);
    function handleContrastChange(e) {
        setContrast(e.target.value);
    }

    const [RGB, setRGB] = useState({red: 0, green: 0, blue: 0});
    function handleRGBChange(e) {
        const {name , value } = e.target;
        setRGB(prev => ({...prev, [name]: parseInt(value)}));
    }
    return (
        <div style={styles.container}>
            <Toolbar/>
            <canvas ref={CanvasRef}/>
            <RangeMenu handleBrightnessChange={handleBrightnessChange}
                       handleContrastChange={handleContrastChange}
                       handleRGBChange={handleRGBChange}
                       Brightness={parseInt(Brightness)} contrast={parseInt(contrast)} RGB={RGB}/>
        </div>
    )

}

export default Editor;
Editor.propTypes = {
    IMG: PropTypes.instanceOf(File).isRequired,
}
const styles = {
    container: {
        width: '100%',
        height: 'window.height',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    }
}
import PropTypes from "prop-types";
import {useEffect, useRef, useState} from "react";

function Editor(props) {
    const [IMG, setIMG] = useState(props.IMG);
    const imageRef = useRef(new Image());
    const CanvasRef = useRef(null);

    useEffect(() => {
        if(IMG) imageRef.current.src = URL.createObjectURL(new Blob([IMG]));
        imageRef.current.onload = () => {
            const canvas = CanvasRef.current;
            const context = canvas.getContext("2d");
            canvas.height = imageRef.current.height > window.height ? window.height : imageRef.current.height;
            let newWidth = canvas.height  * (imageRef.current.width/imageRef.current.height);
            canvas.width = newWidth > window.width*0.8 ? window.width*0.8 : imageRef.current.width;
            context.drawImage(imageRef.current , 0, 0, canvas.width, canvas.height);
        }
    },[IMG])
    return (
            <div style={styles.container}>
                <canvas ref={CanvasRef} />
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
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
    }
}
import PropTypes from "prop-types";
import {useEffect, useState} from "react";
import InputFile from "./InputFile.jsx"
import Button from "./Button.jsx"
import ImageCard from "./ImageCard.jsx";
function ImageForm(props){
    const [ImgData, setImgData] = useState(null);
    const [msg, setMsg] = useState("Click To Upload Image");
    const [ButtonText , setButtonText] = useState("Upload");
    const [ToRender, setToRender] = useState(<InputFile onValueChange={handleChange}/>);
    
    useEffect(() => {
        setMsg(ImgData? ImgData.name :"");
        setButtonText(ImgData? "Confirm" : "Upload");
        setToRender(ImgData? <ImageCard URL={URL.createObjectURL(ImgData)}/> : <InputFile onValueChange={handleChange}/>)
    },[ImgData])
    
    function handleChange(e){
        setImgData(e.target.files[0]);
    }
    function handleSubmit(e){
        e.preventDefault();
        if(!ImgData){return;}
        props.setIsImage(true);
        props.setImg(ImgData);
    }
    
    
    return (
        <form onSubmit={handleSubmit}>
            <div style={Style.container}>
                {ToRender}
                <p>{msg}</p>
                <Button type={"submit"} text={ButtonText} />
            </div>
        </form>
    )
}

export default ImageForm;
ImageForm.propTypes = {
    setIsImage: PropTypes.func.isRequired,
    setImg: PropTypes.func.isRequired,
}

const Style = {
    container: {
        width: '100vw',
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        gap : '20px',
    }
}
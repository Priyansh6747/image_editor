import PropTypes from "prop-types";
import {useState} from "react";
function ImageForm(props){
    const [ImgData, setImgData] = useState(null);
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
            <input type={"file"}  onChange = {handleChange}  accept="image/*"/>
            <button type="submit">Submit</button>
        </form>
    )
}
export default ImageForm;
ImageForm.propTypes = {
    setIsImage: PropTypes.func.isRequired,
    setImg: PropTypes.func.isRequired,
}
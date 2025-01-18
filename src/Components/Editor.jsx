import PropTypes from "prop-types";
import  { useEffect , useState} from "react";
import init ,{do_square} from "./../../wasm_pkg/RUST.js"
import Sliders from "./Sliders.jsx"


function Editor(props) {

    const [value, setValue] = useState(parseInt("0"));
    const [res , setRes] = useState(value);
    const [OrignalImg, setOrignalImg] = useState(props.IMG);


    function handleChange(e) {
        setValue(e.target.value);
    }

    useEffect(() => {
        init().then(()=>{
            setRes(do_square(value));
        })
    },[value])


    return (
            <div style={styles.container}>
                <img src={URL.createObjectURL(OrignalImg)} alt={props.IMG}/>
                <h1>{res}</h1>
                <Sliders value={parseInt(value)} onValueChange={handleChange} />
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
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
    }
}
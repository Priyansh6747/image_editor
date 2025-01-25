import PropTypes from "prop-types";
import {useEffect, useState} from "react";

function Slider(props) {
    const [value, setValue] = useState(props.value);
    function onValueChange (e) {
        setValue(e.target.value);
        props.onValueChange(e);
    }
    useEffect(() => {
        setValue(0);
    },[props.Reset])
    return (
        <div style={Style.container}>
            <h3>{props.name} <span>{value}</span></h3>
            <input type = "range" min={-100} max={100} step={1} value={value} onChange={onValueChange} name={props.name} />
        </div>
    )
}
export default  Slider;
Slider.propTypes = {
    value: PropTypes.number.isRequired,
    onValueChange: PropTypes.func.isRequired,
    name: PropTypes.string.isRequired,
    Reset: PropTypes.number
}

const Style = {
    container : {
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',

    }
}
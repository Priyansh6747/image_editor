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
            <input type = "range" min={-100} max={100} step={1} value={value}
                   onChange={onValueChange} name={props.name} style={Style.slider} className="slider" />
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
    container: {
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        margin: '8px 0',
        fontFamily: 'Arial, sans-serif',
    },
    slider: {
        width: '80%',
        height: '8px',
        borderRadius: '5px',
        background: 'linear-gradient(45deg, rgba(222,156,153,0.8155637254901961) 0%, rgba(162,230,228,1) 51%, rgba(0,255,106,0.5830707282913166) 100%)',
        appearance: 'none',
        outline: 'none',
        transition: 'background 0.3s ease',
    },
    sliderThumb: {
        appearance: 'none',
        width: '20px',
        height: '20px',
        borderRadius: '50%',
        backgroundColor: '#f39c12',
        cursor: 'pointer',
        transition: 'background-color 0.2s ease, transform 0.2s ease',
    },
    sliderHover: {
        background: '#ddd',
        '&:hover': {
            background: '#bbb',
        },
    },
    sliderThumbActive: {
        backgroundColor: '#e74c3c',
        transform: 'scale(1.2)',
    },
}


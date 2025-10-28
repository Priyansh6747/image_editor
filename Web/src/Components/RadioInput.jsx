import styled from 'styled-components';
import {useState} from "react";
import PropTypes from "prop-types";
import Apply from "./Buttons/ApplyBtn.jsx"
import Cancel from "./Buttons/CancelBtn.jsx"

const Radio = (props) => {
    return (
        <StyledWrapper>
            <div className="radio-group">
                <input className="radio-input" name="radio-group" id="radio1" type="radio" value={1} onChange={props.onChange} />
                <label className="radio-label" htmlFor="radio1">
                    <span className="radio-inner-circle" />
                    1
                </label>
                <input className="radio-input" name="radio-group" id="radio2" type="radio" value={2} onChange={props.onChange} />
                <label className="radio-label" htmlFor="radio2">
                    <span className="radio-inner-circle" />
                    2
                </label>
                <input className="radio-input" name="radio-group" id="radio3" type="radio" value={3} onChange={props.onChange} />
                <label className="radio-label" htmlFor="radio3">
                    <span className="radio-inner-circle" />
                    3
                </label><input className="radio-input" name="radio-group" id="radio4" type="radio" value={5} onChange={props.onChange} />
                <label className="radio-label" htmlFor="radio4">
                    <span className="radio-inner-circle" />
                    5
                </label><input className="radio-input" name="radio-group" id="radio5" type="radio" value={10} onChange={props.onChange} />
                <label className="radio-label" htmlFor="radio5">
                    <span className="radio-inner-circle" />
                    10
                </label>
            </div>
        </StyledWrapper>
    );
}
Radio.propTypes = {
    onChange: PropTypes.func.isRequired,
}
function RadioInput(props) {
    const [value, setValue] = useState(0);
    function handleValue(e) {
        setValue(e.target.value);
    }
    function HandleSubmit(e) {
        e.preventDefault();
        props.ApplyBlur(value);
        props.setBlur(false);
    }
    function handleCancel(e) {
        e.preventDefault();
        props.setBlur(false);
    }
    return (
        <form onSubmit={HandleSubmit} style={Style.wrapper}>
            <h3>Adjust Blur Strength</h3>
            <Radio onChange={handleValue}></Radio>
            <div style={Style.Btn}>
                <Apply text="Apply"/>
                <div style={Style.CancelBtn}><Cancel handleClick={handleCancel} /></div>
            </div>
        </form>
    )
}

RadioInput.propTypes = {
    ApplyBlur: PropTypes.func.isRequired,
    setBlur: PropTypes.func.isRequired,
}
export default RadioInput;
const Style = {
    wrapper: {
        display: "flex",
        border: "1px solid black",
        padding: "1rem",
        flexDirection: "column",
        justifyContent: "space-around",
        alignItems: "flex-start",
        marginTop: "1rem",
        borderRadius: "10px",
        overflowX: "hidden",
    },
    Btn: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-around",
        gap: "1rem",
    },
    CancelBtn : {
        transform : "translate(-5% ,-10%)",
        paddingRight: "20%",
        overflow: "hidden",
    }
}

const StyledWrapper = styled.div`
  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  body {
    font-family: Arial, sans-serif;
    background-color: #f1f1f1;
    padding: 20px;
  }

  .radio-group {
    display: flex;
    flex-direction: column;
  }

  .radio-label {
    display: flex;
    align-items: center;
    padding: 0.5em;
    margin-bottom: 0.5em;
    background-color: transparent;
    border: none;
    border-radius: 4px;
    transition: background-color 0.2s, border-color 0.2s;
  }

  .radio-label:hover {
    background-color: transparent;
  }

  .radio-input {
    position: absolute;
    opacity: 0;
  }

  .radio-input:checked + .radio-label {
    background-color: transparent;
    border-color: #ff1111;
  }


  .radio-inner-circle {
    display: inline-block;
    width: 1em;
    height: 1em;
    border: 2px solid #888;
    border-radius: 50%;
    margin-right: 0.5em;
    transition: border-color 0.2s;
    position: relative;
  }

  .radio-label:hover .radio-inner-circle {
    border-color: #555;
  }

  

  .radio-input:checked + .radio-label .radio-inner-circle::after {
    content: '';
    display: block;
    width: 0.5em;
    height: 0.5em;
    background-color: #ff1111;
    border-radius: 50%;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }`;



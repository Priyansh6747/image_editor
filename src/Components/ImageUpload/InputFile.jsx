import styled from 'styled-components';
import PropTypes from "prop-types";
const InputFile = (props) => {
    function handleChange(e) {
        props.onValueChange(e);
    }
    return (
        <StyledWrapper>
            <div className="input-div">
                <input className="input" name="file" type="file" onChange={handleChange} accept="image/*"/>
                <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" strokeLinejoin="round" strokeLinecap="round" viewBox="0 0 24 24" strokeWidth={2} fill="none" stroke="currentColor" className="icon"><polyline points="16 16 12 12 8 16" /><line y2={21} x2={12} y1={12} x1={12} /><path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3" /><polyline points="16 16 12 12 8 16" /></svg>
            </div>
        </StyledWrapper>
    );
}
InputFile.propTypes = {
    onValueChange: PropTypes.func.isRequired,
}

const StyledWrapper = styled.div`
    .input-div {
        position: relative;
        width: 100px;
        height: 100px;
        border-radius: 50%;
        border: 2px solid rgb(1, 235, 252);
        display: flex;
        justify-content: center;
        align-items: center;
        overflow: hidden;
        box-shadow: 0 0 100px rgb(1, 235, 252) , inset 0 0 10px rgb(1, 235, 252),0 0 5px rgb(255, 255, 255);
        animation: flicker 2s linear infinite;
    }

    .icon {
        color: rgb(1, 235, 252);
        font-size: 2rem;
        cursor: pointer;
        animation: iconflicker 2s linear infinite;
    }

    .input {
        position: absolute;
        opacity: 0;
        width: 100%;
        height: 100%;
        cursor: pointer !important;
    }

    @keyframes flicker {
        0% {
            border: 2px solid rgb(1, 235, 252);
            box-shadow: 0 0 100px rgb(1, 235, 252) , inset 0 0 10px rgb(1, 235, 252),0 0 5px rgb(255, 255, 255);
        }

        5% {
            border: none;
            box-shadow: none;
        }

        10% {
            border: 2px solid rgb(1, 235, 252);
            box-shadow: 0 0 100px rgb(1, 235, 252) , inset 0 0 10px rgb(1, 235, 252),0 0 5px rgb(255, 255, 255);
        }

        25% {
            border: none;
            box-shadow: none;
        }

        30% {
            border: 2px solid rgb(1, 235, 252);
            box-shadow: 0 0 100px rgb(1, 235, 252) , inset 0 0 10px rgb(1, 235, 252),0 0 5px rgb(255, 255, 255);
        }

        100% {
            border: 2px solid rgb(1, 235, 252);
            box-shadow: 0 0 100px rgb(1, 235, 252) , inset 0 0 10px rgb(1, 235, 252),0 0 5px rgb(255, 255, 255);
        }
    }

    @keyframes iconflicker {
        0% {
            opacity: 1;
        }

        5% {
            opacity: 0.2;
        }

        10% {
            opacity: 1;
        }

        25% {
            opacity: 0.2;
        }

        30% {
            opacity: 1;
        }

        100% {
            opacity: 1;
        }
    }`;

export default InputFile;

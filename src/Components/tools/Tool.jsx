import PropTypes, {elementType} from "prop-types";
import { GrRotateRight } from "react-icons/gr";
import { RxReset } from "react-icons/rx";
import { VscColorMode } from "react-icons/vsc";
import { MdOutlineWhatshot } from "react-icons/md";
import { IoInvertMode } from "react-icons/io5";
import styled from "styled-components";
function ToolButton(props) {
    return (
        <StyledWrapper>
            <button onClick={props.HandleClick} className="container">
                <props.Icon className="icon" />
            </button>
        </StyledWrapper>
    );
}
ToolButton.propTypes = {
    HandleClick: PropTypes.func,
    Icon: elementType.isRequired,
}
export default ToolButton;
function RotateTool(props) {
    return (
        <StyledWrapper>
            <button onClick={props.HandleClick} className="container">
                <GrRotateRight className="icon"/>
            </button>
        </StyledWrapper>
    )
}
function ResetTool(props) {
    return (
        <StyledWrapper>
            <button onClick={props.HandleClick} className="container">
                <RxReset className="icon"/>
            </button>
        </StyledWrapper>
    )
}
function GeyScale(props) {
    return (
        <StyledWrapper>
            <button onClick={props.HandleClick} className="container">
                <VscColorMode className="icon"/>
            </button>
        </StyledWrapper>
    )
}

function SepiaTool(props) {
    return (
        <StyledWrapper>
            <button onClick={props.HandleClick} className="container">
                <MdOutlineWhatshot  className="icon"/>
            </button>
        </StyledWrapper>
    )
}
function InvertTool(props) {
    return (
        <StyledWrapper>
            <button onClick={props.HandleClick} className="container">
                <IoInvertMode   className="icon"/>
            </button>
        </StyledWrapper>
    )
}
export {RotateTool , ResetTool ,GeyScale , SepiaTool, InvertTool};

RotateTool.propTypes = {
    HandleClick: PropTypes.func,
}
ResetTool.propTypes = {
    HandleClick: PropTypes.func,
}
GeyScale.propTypes = {
    HandleClick: PropTypes.func,
}
SepiaTool.propTypes = {
    HandleClick: PropTypes.func,
}
InvertTool.propTypes = {
    HandleClick: PropTypes.func,
}


const StyledWrapper = styled.div`
    height: 6%;
    width: 60%;
    .container {
        background-color: red;
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        border-radius: 60px;
    }
    .icon {
        transform: scale(2);
        font-weight: bolder;
    }
    .icon:hover {
        color: white;
        transform: scale(1.2);
        transition: transform 10s ease;
    }
`

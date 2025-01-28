import PropTypes from "prop-types";
import { GrRotateRight } from "react-icons/gr";
import { RxReset } from "react-icons/rx";
import { VscColorMode } from "react-icons/vsc";
import { MdOutlineWhatshot } from "react-icons/md";
import { IoInvertMode } from "react-icons/io5";
import { FaCropSimple } from "react-icons/fa6";
import styled from "styled-components";

// eslint-disable-next-line react/jsx-key
const IconArray = [<GrRotateRight className="icon"/> , <VscColorMode className="icon"/> , <MdOutlineWhatshot className="icon"/>,
// eslint-disable-next-line react/jsx-key
    <IoInvertMode className="icon"/>,<FaCropSimple className="icon"/>, <RxReset className="icon"/>
];
// IconOrder -> Rotate GreyScale SepiaTool InvertTool Crop Reset

function ToolButton(props) {
    return (
        <>
            <StyledWrapper>
                <button onClick={props.HandleClick} className="container">
                    {IconArray[props.Icon]}
                </button>
                <div className="Description">
                    <h3>{props.name}</h3>
                    <p>{props.detail}</p>
                </div>
            </StyledWrapper>
        </>
    );
}

ToolButton.propTypes = {
    HandleClick: PropTypes.func,
    Icon: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    detail: PropTypes.string,
}
export default ToolButton;

const StyledWrapper = styled.div`
    height: 6%;
    width: 60%;
    position: relative;

    .container {
        background-color: #deda8e;
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        border-radius: 60px;
    }

    .container:hover {
        background-color: rgba(222, 218, 142, 0.26);
        transform: scale(1.05);
        transition: 0.2s ease;
    }

    .icon {
        transform: scale(2);
        font-weight: bolder;
    }

    .icon:hover {
        transform: scale(1.2);
        transition: transform 10s ease;
    }

    .Description {
        display: none;
        position: absolute;
        top: 10%; 
        left: 110%;
        transform: translateX(-100%);
        background-color: rgba(0, 0, 0, 0.7);
        color: white;
        padding: 0.5em 1em;
        border-radius: 0.5em;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    }

    .container:hover + .Description {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        transform: scale(1);
    }
    .Description h3{
        font-size: 0.9em;
        font-family: "Architects Daughter", cursive;
        margin: 0; 
    }
    .Description p {
        font-size: 0.8em;
        font-family: "Architects Daughter", cursive;
        margin: 0;
    }
`;


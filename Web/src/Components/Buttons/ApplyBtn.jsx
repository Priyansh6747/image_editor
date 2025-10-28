import styled from 'styled-components';
import PropTypes from "prop-types";

const ApplyBtn = (props) => {
    return (
        <StyledWrapper>
            <button className="contactButton" onClick={props.onClick}>
                {props.text}
                <div className="iconButton">
                    <svg height={24} width={24} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path d="M0 0h24v24H0z" fill="none" />
                        <path d="M16.172 11l-5.364-5.364 1.414-1.414L20 12l-7.778 7.778-1.414-1.414L16.172 13H4v-2z" fill="currentColor" />
                    </svg>
                </div>
            </button>
        </StyledWrapper>
    );
}

ApplyBtn.propTypes = {
    text: PropTypes.string.isRequired,
    onClick: PropTypes.func
}

const StyledWrapper = styled.div`
    .contactButton {
        background: #7079f0;
        color: white;
        font-family: inherit;
        font-size: 17px;
        font-weight: 500;
        border-radius: 0.9em;
        border: none;
        cursor: pointer;
        letter-spacing: 0.05em;
        display: flex;
        align-items: center;
        box-shadow: inset 0 0 1.6em -0.6em #714da6;
        overflow: hidden;
        position: relative;
        height: 2.8em;
        padding: 0.45em 3em 0.45em 1em;
        flex-direction: column;
        justify-content: center;
    }

    .iconButton {
        margin-left: 1em;
        position: absolute;
        display: flex;
        align-items: center;
        justify-content: center;
        height: 2.2em;
        width: 2.2em;
        border-radius: 0.7em;
        box-shadow: 0.1em 0.1em 0.6em 0.2em #7a8cf3;
        right: 0.3em;
        transition: all 0.3s;
    }

    .contactButton:hover {
        transform: translate(-0.05em, -0.05em);
        box-shadow: 0.15em 0.15em #5566c2;
    }

    .contactButton:active {
        transform: translate(0.05em, 0.05em);
        box-shadow: 0.05em 0.05em #5566c2;
    }`;

export default ApplyBtn;

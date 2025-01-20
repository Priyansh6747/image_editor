﻿import styled from 'styled-components';
import PropTypes from "prop-types";
const Heading = (props) => {
    return (
        <StyledWrapper>
            <div className="card">
                <p className="card-title">{props.title}</p>
                <p className="small-desc">{props.desc}</p>
                <div className="go-corner">
                    <div className="go-arrow">👇</div>
                </div>
            </div>
        </StyledWrapper>
    );
}

Heading.propTypes = {
    title: PropTypes.string,
    desc: PropTypes.string,
}

const StyledWrapper = styled.div`
    .card-title {
        color: #262626;
        font-size: 1.5em;
        line-height: normal;
        font-weight: 700;
        margin-bottom: 0.5em;
    }

    .small-desc {
        font-size: 1em;
        font-weight: 400;
        line-height: 1.5em;
        color: #452c2c;
    }

    .small-desc {
        font-size: 1em;
        font-family: Architects Daughter,cursive;
    }

    .go-corner {
        display: flex;
        align-items: center;
        justify-content: center;
        position: absolute;
        width: 2em;
        height: 2em;
        overflow: hidden;
        top: 0;
        right: 0;
        background: linear-gradient(135deg, #6293c8, #384c6c);
        border-radius: 0 4px 0 32px;
    }

    .go-arrow {
        margin-top: -4px;
        margin-right: -4px;
        color: white;
        font-family: courier, sans, serif;
    }

    .card {
        display: block;
        position: relative;
        max-width: 300px;
        max-height: 320px;
        border-radius: 10px;
        padding: 2em 1.2em;
        margin: 12px;
        text-decoration: none;
        z-index: 0;
        overflow: hidden;
        background: #f2f8f9 linear-gradient(to bottom, #c3e6ec, #a7d1d9);
        font-family: Arial, Helvetica, sans-serif;
    }

    .card:before {
        content: '';
        position: absolute;
        z-index: -1;
        top: -16px;
        right: -16px;
        background: linear-gradient(135deg, #364a60, #384c6c);
        height: 32px;
        width: 32px;
        border-radius: 32px;
        transform: scale(1);
        transform-origin: 50% 50%;
        transition: transform 0.35s ease-out;
    }

    .card:hover:before {
        transform: scale(28);
    }

    .card:hover .small-desc {
        transition: all 0.5s ease-out;
        color: rgba(255, 255, 255, 0.8);
    }

    .card:hover .card-title {
        transition: all 0.5s ease-out;
        color: #ffffff;
    }`;

export default Heading;

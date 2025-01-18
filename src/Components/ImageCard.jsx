import styled from 'styled-components';
import PropTypes from "prop-types";
const Card = (props) => {
    return (
        <StyledWrapper>
            <div className="card">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                    <path d="M20 5H4V19L13.2923 9.70649C13.6828 9.31595 14.3159 9.31591 14.7065 9.70641L20 15.0104V5ZM2 3.9934C2 3.44476 2.45531 3 2.9918 3H21.0082C21.556 3 22 3.44495 22 3.9934V20.0066C22 20.5552 21.5447 21 21.0082 21H2.9918C2.44405 21 2 20.5551 2 20.0066V3.9934ZM8 11C6.89543 11 6 10.1046 6 9C6 7.89543 6.89543 7 8 7C9.10457 7 10 7.89543 10 9C10 10.1046 9.10457 11 8 11Z" />
                </svg>
                <div className="card__content">
                    <img src={props.URL} />
                </div>
            </div>
        </StyledWrapper>
    );
}
Card.propTypes = {
    URL: PropTypes.string,
}
const StyledWrapper = styled.div`
  .card {
    position: relative;
    min-width: 400px;
    min-height: 400px;
    width: auto;
    height: auto;
    background: linear-gradient(-45deg, #f89b29 0%, #ff0f7b 100%);
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    transition: all 0.6s cubic-bezier(0.23, 1, 0.32, 1);
  }

  .card svg {
    width: 48px;
    fill: #333;
    transition: all 0.6s cubic-bezier(0.23, 1, 0.32, 1);
  }

  .card:hover {
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
  }

  .card__content {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 100%;
    height: 100%;
    padding: 20px;
    box-sizing: border-box;
    background-color: #fff;
    opacity: 0;
    transition: all 0.6s cubic-bezier(0.23, 1, 0.32, 1);
  }

  .card:hover .card__content {
    transform: translate(-50%, -50%) rotate(0deg);
    opacity: 1;
    width: auto;
    height: 100%;  
    overflow: hidden;
  } 
  
  .card__content img {
      height: 100%;
      width: auto;
      object-fit: contain;
  }

  .card:hover svg {
    scale: 0;
  }`;

export default Card;

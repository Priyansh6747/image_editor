import { useState } from "react";
import Draggable from "react-draggable";
import { ResizableBox } from "react-resizable";
import styled from "styled-components";
import "react-resizable/css/styles.css";
import Btn from "./../Buttons/ApplyBtn.jsx"
import PropTypes from "prop-types";

function CropUI(props) {
    const [cropArea, setCropArea] = useState({
        x: 50,
        y: 50,
        width: 200,
        height: 200,
    });

    const handleResize = (event, { size }) => {
        setCropArea((prev) => ({
            ...prev,
            width: size.width,
            height: size.height,
        }));
    };

    const handleDrag = (e, data) => {
        setCropArea((prev) => ({
            ...prev,
            x: data.x,
            y: data.y,
        }));
    };
    function HandleApplyCrop() {
        props.ApplyCrop(cropArea);
    }
    return (
        <CropContainer>
            <div className="ApplyCrop">
                <Btn text="Apply" onClick={HandleApplyCrop}/>
            </div>
            <Draggable
                bounds="parent"
                position={{x: cropArea.x, y: cropArea.y}}
                onDrag={handleDrag}>
                <ResizableBox
                    width={cropArea.width}
                    height={cropArea.height}
                    minConstraints={[50, 50]}
                    maxConstraints={[props.width, props.height]}
                    onResize={handleResize}
                    resizeHandles={["se", "sw", "ne", "nw"]}
                >
                    <CropBox>
                        <div className="overlay">Crop Area</div>
                    </CropBox>
                </ResizableBox>
            </Draggable>
        </CropContainer>
    );
}

CropUI.propTypes = {
    onCrop: PropTypes.func,
    width: PropTypes.number.isRequired,
    height: PropTypes.number.isRequired,
    ApplyCrop: PropTypes.func,
}
export default CropUI;

const CropContainer = styled.div`
  position: absolute;
  height: 100%;
  width: 100%;
  overflow: visible;
  .ApplyCrop {
     position: relative;
      z-index: 5;
 }
`;


const CropBox = styled.div`
  position: relative;
  border: 2px dashed #00f;
  background-color: rgba(0, 0, 255, 0.2);
  height: 100%;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;

  .overlay {
    color: white;
    font-weight: bold;
    text-align: center;
  }
`;

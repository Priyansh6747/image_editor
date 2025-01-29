import Sliders from "./Sliders.jsx";
import Headings from "./Heading.jsx";
import RadioInput from "./RadioInput.jsx";
import styled from 'styled-components';
import PropTypes from "prop-types";
import {useEffect , useState} from "react";

function RangeMenu(props) {
    const Menu = <StyledWrapper>
        <div>
            <div className="card">
                <div className="card2">
                    <div style={Style.container}>
                        <Sliders value={parseInt(props.Brightness)} onValueChange={handleBrightnessChange}
                                 name="Brightness" Reset={props.Reset}/>
                        <Sliders value={parseInt(props.contrast)} onValueChange={handleContrastChange}
                                 name="Contrast" Reset={props.Reset}/>
                        <Sliders value={parseInt(props.RGB.red)} onValueChange={handleRGBChange} name='red' Reset={props.Reset}/>
                        <Sliders value={parseInt(props.RGB.green)} onValueChange={handleRGBChange} name='green' Reset={props.Reset}/>
                        <Sliders value={parseInt(props.RGB.blue)} onValueChange={handleRGBChange} name='blue' Reset={props.Reset}/>
                    </div>
                </div>
            </div>
        </div>
    </StyledWrapper>

    const [RenderBlurMenu, setRenderBlurMenu] = useState(Menu);
    function handleBrightnessChange(e) {
        props.handleBrightnessChange(e);
    }
    function handleContrastChange(e) {
        props.handleContrastChange(e);
    }
    function handleRGBChange(e) {
        props.handleRGBChange(e);
    }



    useEffect(() => {
        if (props.Blur) {
            setRenderBlurMenu(<RadioInput ApplyBlur={props.ApplyBlur} setBlur={props.setBlur} />);
        }else setRenderBlurMenu(Menu);
    }, [props.Blur]);

    return(
        <div style={Style.wrapper}>
            <Headings title='Menu' desc='Utilize this menu to fine-tune settings for optimal adjustments in your image.' />

            {RenderBlurMenu}
        </div>
    )
}

RangeMenu.propTypes = {
    handleBrightnessChange: PropTypes.func.isRequired,
    handleContrastChange: PropTypes.func.isRequired,
    handleRGBChange: PropTypes.func.isRequired,
    ApplyBlur: PropTypes.func.isRequired,
    Blur: PropTypes.bool.isRequired,
    setBlur: PropTypes.func.isRequired,

    Brightness: PropTypes.number.isRequired,
    contrast: PropTypes.number.isRequired,
    RGB: PropTypes.object.isRequired,
    Reset: PropTypes.number
}

export default RangeMenu
const Style = {
    wrapper: {
        width: '15%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
    },
    box:{
      width: '100%',
      height: '100%',
    },
    container: {
        width: '100%',
        height: 'window.height',
        backgroundColor: 'transparent',
        backdropFilter: 'blur(30px)',

        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-around',
        gap: '20px',

    }
}

const StyledWrapper = styled.div`
    .card {
        width: 100%;
        height: auto;
        background-image: linear-gradient(163deg, #00ff75 0%, #3700ff 100%);
        border-radius: 10px;
        transition: all .3s;
    }

    .card2 {
        width: 100%;
        height: 100%;
        background-color: rgb(255, 255, 204);
        backdrop-filter: drop-shadow(10px 10px #000000);
        border-radius: 40px;
        transition: all .2s;
    }

    .card2:hover {
        transform: scale(0.98);
        border-radius: 20px;
    }

    .card:hover {
        box-shadow: 0 0 30px 1px rgba(0, 255, 117, 0.30);
    }`;


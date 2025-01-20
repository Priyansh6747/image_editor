import Sliders from "./Sliders.jsx";
import Headings from "./Heading.jsx";
import styled from 'styled-components';
import PropTypes from "prop-types";

function RangeMenu(props) {

    function handleBrightnessChange(e) {
        props.handleBrightnessChange(e);
    }
    function handleContrastChange(e) {
        props.handleContrastChange(e);
    }
    function handleRGBChange(e) {
        props.handleRGBChange(e);
    }

    return(
        <div style={Style.wrapper}>
            <Headings title='Menu' desc='Utilize this menu to fine-tune settings for optimal adjustments in your image.' />
            <StyledWrapper>
                <div>
                    <div className="card">
                        <div className="card2">
                            <div style={Style.container}>
                                <Sliders value={parseInt(props.Brightness)} onValueChange={handleBrightnessChange}
                                         name="Brightness"/>
                                <Sliders value={parseInt(props.contrast)} onValueChange={handleContrastChange}
                                         name="Contrast"/>
                                <Sliders value={parseInt(props.RGB.red)} onValueChange={handleRGBChange} name='red'/>
                                <Sliders value={parseInt(props.RGB.green)} onValueChange={handleRGBChange} name='green'/>
                                <Sliders value={parseInt(props.RGB.blue)} onValueChange={handleRGBChange} name='blue'/>
                            </div>
                        </div>
                    </div>
                </div>
            </StyledWrapper>

        </div>
    )
}

RangeMenu.propTypes = {
    handleBrightnessChange: PropTypes.func.isRequired,
    handleContrastChange: PropTypes.func.isRequired,
    handleRGBChange: PropTypes.func.isRequired,

    Brightness: PropTypes.number.isRequired,
    contrast: PropTypes.number.isRequired,
    RGB: PropTypes.object.isRequired,
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

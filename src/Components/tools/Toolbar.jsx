import ToolButton  from "./Tool.jsx"
import PropTypes from "prop-types";

function Toolbar(props){

    return (
        <div style={Style.container}>
            <ToolButton HandleClick = {props.rotateRight} Icon={0}
                        name="Rotate" detail="Rotate the image right by 90degs"/>
            <ToolButton HandleClick = {props.initiateCrop} Icon={4}
                        name="Crop" detail="Press again to cancel"/>
            <ToolButton HandleClick = {props.Blur} Icon={5}
            name="Blur" detail="Blurs the entire image"/>
            <ToolButton HandleClick = {props.PopColor} Icon={6}
            name="Pop Color" detail="Improve the color of the image"/>
            <ToolButton HandleClick = {props.greyScale}   Icon={1}
            name="Grey Scale" detail="Greyout the orignal colors"/>
            <ToolButton HandleClick = {props.Vintage}       Icon={7}
                        name="Vintage" detail="Provides a old look to image"/>
            <ToolButton HandleClick = {props.Vignette}       Icon={8}
                        name="Vignette" detail="Provides a dull look to image"/>
            <ToolButton HandleClick = {props.Sepia}       Icon={2}
            name="Sepia" detail="Provides a warm color to image"/>
            <ToolButton HandleClick = {props.invert}      Icon={3}
            name="Invert" detail="Invert the colors of the image"/>
            <ToolButton HandleClick = {props.Reset}       Icon={9}
            name="Reset"/>
        </div>
    )
}

export default Toolbar;
Toolbar.propTypes = {
    rotateRight: PropTypes.func.isRequired,
    greyScale: PropTypes.func.isRequired,
    Sepia: PropTypes.func.isRequired,
    invert: PropTypes.func.isRequired,
    initiateCrop: PropTypes.func.isRequired,
    Blur: PropTypes.func.isRequired,
    PopColor: PropTypes.func.isRequired,
    Vintage: PropTypes.func.isRequired,
    Vignette: PropTypes.func.isRequired,
    Reset: PropTypes.func.isRequired,
}

const Style = {
    container: {
        backgroundColor: 'transparent',
        height: '100vh',
        width: '5%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-around',
        alignItems: 'center',
        backdropFilter: 'blur(3px)',
        border: '1px solid #000',
        zIndex : '10',
    }
}
import {ResetTool,RotateTool,GeyScale,SepiaTool,InvertTool} from "./Tool.jsx"
import PropTypes from "prop-types";

function Toolbar(props){

    return (
        <div style={Style.container}>
            <RotateTool HandleClick={props.rotateRight} />
            <SepiaTool HandleClick={props.Sepia} />
            <GeyScale HandleClick = {props.greyScale}/>
            <InvertTool HandleClick = {props.invert}/>
            <ResetTool HandleClick = {props.Reset} />
        </div>
    )
}

export default Toolbar;
Toolbar.propTypes = {
    rotateRight: PropTypes.func.isRequired,
    greyScale: PropTypes.func.isRequired,
    Sepia: PropTypes.func.isRequired,
    invert: PropTypes.func.isRequired,
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
    }
}
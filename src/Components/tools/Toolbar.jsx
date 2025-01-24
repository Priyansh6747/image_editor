import TempBtn from "../Buttons/Download.jsx"
import PropTypes from "prop-types";
function Toolbar(props){

    return (
        <div style={Style.container}>
            <TempBtn HandleClick = {props.rotateRight} />
            <TempBtn HandleClick = {props.greyScale}/>
            <TempBtn HandleClick = {props.Reset} />
        </div>
    )
}

export default Toolbar;
Toolbar.propTypes = {
    rotateRight: PropTypes.func.isRequired,
    greyScale: PropTypes.func.isRequired,
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
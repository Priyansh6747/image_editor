import PropTypes from "prop-types";

function Tool(props) {
    return (
        <button onClick={props.HandleClick}>
            <img src = {props.icon}></img>
        </button>
    )
}
export default Tool;

Tool.propTypes = {
    HandleClick: PropTypes.func,
    icon: PropTypes.string.isRequired,
}
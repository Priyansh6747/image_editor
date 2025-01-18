import PropTypes from "prop-types";
function Slider(props) {
    function onValueChange (e) {
        props.onValueChange(e);
    }
    return (
        <div>
            <input type = "range" min={-100} max={100} step={0.1} value={props.value} onChange={onValueChange} />
        </div>
    )
}
export default  Slider;
Slider.propTypes = {
    value: PropTypes.number.isRequired,
    onValueChange: PropTypes.func.isRequired,
}

function Toolbar(){

    return (
        <div style={Style.container}>
            <h1>T</h1>
            <h1>T</h1>
            <h1>T</h1>
            <h1>T</h1>
            <h1>T</h1>
        </div>
    )
}

export default Toolbar;

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
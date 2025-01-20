import {useState, useEffect} from 'react'
import ImageForm from './Components/ImageUpload/Imageform.jsx'
import Editor from "./Components/Editor.jsx";
import Toolbar from "./Components/tools/Toolbar.jsx"
import RangeMenu from "./Components/RangeMenu.jsx";

function App() {
    const [isImage, setIsImage] = useState(false);
    const [Img, setImg] = useState(null);
    const [ToRender, setToRender] = useState(null);

    useEffect(() => {
        setToRender(isImage? <Editor IMG={Img}/> :<ImageForm setIsImage={setIsImage} setImg={setImg} />);
    },[isImage,Img])

    return (
        <div style={styles.container}>
            <Toolbar />
            {ToRender}
            <RangeMenu />
        </div>
)
}


export default App;

const styles = {
    container: {
        display: 'flex',
        height: '100%',
        width: '100%',
        backgroundColor: 'rgb(255, 255, 204)',
        justifyContent: 'space-between',
    }
}
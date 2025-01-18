import {useState, useEffect} from 'react'
import ImageForm from './components/ImageForm'
import Editor from "./Components/Editor.jsx";


function App() {
    const [isImage, setIsImage] = useState(false);
    const [Img, setImg] = useState(null);
    const [ToRender, setToRender] = useState(null);

    useEffect(() => {
        setToRender(isImage? <Editor IMG={Img}/> :<ImageForm setIsImage={setIsImage} setImg={setImg} />);
    },[isImage,Img])

    return ToRender;
}


export default App;
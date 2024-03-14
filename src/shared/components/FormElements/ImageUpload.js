import React, { useEffect, useRef, useState } from 'react';
import './ImageUpload.css'
import Button from './Button';

const ImageUpload = props => {
    const filePickerRef = useRef()
    const [file, setFile] = useState()
    const [previewUrl, setPreviewUrl] = useState()
    const [isValid, setIsValid] = useState(false)

    const pickedHandler = event => {
        const files = event.target.files
        let fileIsValid = isValid
        if (files || files.length === 1){
            setFile(files[0])
            fileIsValid = true
        }
        else{
            fileIsValid = false
        }
        setIsValid(fileIsValid)
        props.onInput(props.id, files[0], fileIsValid)
    }

    useEffect(()=> {
        if (!file){
            return
        }
        const fileReader = new FileReader()
        fileReader.onload = () => {
            setPreviewUrl(fileReader.result)
        }
        fileReader.readAsDataURL(file)

    }, [file])

    const pickImageHandler = () => {
        filePickerRef.current.click()
    }

    return (
        <div className="form-control">
            <input 
                id={props.id} 
                ref={filePickerRef}
                style={{display: 'none'}} 
                type="file" 
                accept=".jpg,.png,.jpeg"
                onChange={pickedHandler}
            />
            <div className={`image-upload ${props.center && 'center'}`}>
                <div className="image-upload__preview">
                    {previewUrl && <img src={previewUrl} alt="preview" />}
                    {!previewUrl && <p>Please pick an image!!</p>}
                </div>
                <Button type="button" onClick={pickImageHandler}> 
                    PICK IMAGE 
                </Button>
            </div>
            {!isValid && <p>{props.errorText}</p>}
        </div>
    )     
}

export default ImageUpload
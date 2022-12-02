import React, {useRef} from "react";
import {useNavigate} from "react-router-dom";
import {useState, useEffect} from "react";
import { Fragment } from "react";
import { Camera } from "./camera";
import url from "./camera"
import { Root, Preview, Footer, GlobalStyle } from "./Styles";
import axios from "axios";
import 'react-toastify/dist/ReactToastify.css'
import {toast} from "react-toastify";

export const MarkAttendancePage = (props) => {

    const [name, setName] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const [isCameraOpen, setIsCameraOpen] = useState(false);
    const [cardImage, setCardImage] = useState();

    const UploadButtonClick = async(e) => {
        e.preventDefault()
        setIsLoading(true)
        const formData = new FormData();
        formData.append("file", cardImage);
        console.log(formData)
        try {
            const response = await axios({
                method: "post",
                url: process.env.REACT_APP_API_URI + process.env.REACT_APP_API_VERSION + "/detect-stored-faces",
                data: formData,
                headers: { "Content-Type": "multipart/form-data" },
            });
            console.log(formData)
            console.log(response)
            setName(response.data)
            setIsLoading(false)
        } catch(error) {
            console.log(error)
        }
    }



    return (<>
            {!isLoading?
            <div className="container  d-flex justify-content-center">
                <button className="btn my-3 btn-lg btn-success" type="button" onClick={UploadButtonClick}>
                    Check Face
                </button>
            </div>:
            <div className="container  d-flex justify-content-center">
                <button className="btn my-3 btn-lg btn-success" type="button" disabled>
                    <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"/>
                    Processing...
                </button>
            </div>}

            <p>DETECTED FACE: {name}</p>
            <Fragment>
                <Root>
                    {isCameraOpen && (
                        <Camera
                            onCapture={blob => setCardImage(blob)}
                            onClear={() => setCardImage(undefined)}
                        />
                    )}

                    {cardImage && (
                        <div>
                            <h2>Preview</h2>
                            <Preview src={cardImage && URL.createObjectURL(cardImage)} />
                        </div>
                    )}


                    <Footer>
                        <button onClick={() => setIsCameraOpen(true)}>Open Camera</button>
                        <button
                            onClick={() => {
                                setIsCameraOpen(false);
                                setCardImage(undefined);
                            }}
                        >
                            Close Camera
                        </button>
                    </Footer>
                </Root>
            </Fragment>
        </>
    )
}

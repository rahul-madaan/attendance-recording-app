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
    const [rollNumber, setRollNumber] = useState("")
    const [collectUserDetailsLoading, setCollectUserDetailsLoading] = useState(false)
    const [collectUserDetailsDisabled, setCollectUserDetailsDisabled] = useState(true)
    const [markAttendanceDisabled, setMarkAttendanceDisabled] = useState(true)
    const [isCameraOpen, setIsCameraOpen] = useState(false);
    const [cardImage, setCardImage] = useState();

    const UploadButtonClick = async(e) => {
        e.preventDefault()
        const formData = new FormData();
        formData.append("file", cardImage);
        console.log(formData)
        try {
            const response = await axios({
                method: "post",
                url: process.env.REACT_APP_API_URI + process.env.REACT_APP_API_VERSION + "/file",
                data: formData,
                headers: { "Content-Type": "multipart/form-data" },
            });
            console.log(formData)
            console.log(response)
        } catch(error) {
            console.log(error)
        }
    }



    return (<>

            <button type="button" className="btn btn-success btn-lg my-3 mx-3" onClick={UploadButtonClick}>UPLOAD</button>

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
            <p>{console.log(cardImage)}</p>
        </>
    )
}

import React from "react";
import axios from "axios";
import {useNavigate} from "react-router-dom";
import {
    MDBContainer,
    MDBTabsContent,
}
    from 'mdb-react-ui-kit';
import {toast} from "react-toastify";
import {useState} from "react";


export const LoginPage = (props) => {
    let navigate = useNavigate();
    const routeChange = (path) => {
        navigate(path);
    }
    const [loginButtonDisabled, setLoginButtonDisabled] = useState(false)


    const loginSubmit = (e) => {
        e.preventDefault()
        setLoginButtonDisabled(true)
        axios.post(process.env.REACT_APP_API_URI + process.env.REACT_APP_API_VERSION + "/login", {
            'net_id': props.userSNUID,
            'password': props.loginPassword,
            'auth_token': process.env.REACT_APP_API_AUTH_TOKEN
        }).then((result) => {
            setLoginButtonDisabled(false)
            if (result.data.status === "LOGIN_SUCCESSFUL") {
                localStorage.clear()
                localStorage.setItem("user_net_id", result.data.encrypted_net_id)
                localStorage.setItem("user_net_id_len", result.data.net_id_len)
                if(props.userSNUID==="sonia.khetarpaul@snu.edu.in")
                    routeChange('/check-attendance')
                else
                    routeChange('/mark-attendance')
                success_notification("Login Successful!")
            } else if (result.data.status === 'PASSWORD_DOES_NOT_MATCH') {
                console.log("PASSWORD_DOES_NOT_MATCH")
                warn_notification("Password does not match!")
            } else if (result.data.status === 'USER_NOT_REGISTERED') {
                console.log("USER NOT REGISTERED")
                warn_notification("User is not registered")
            }
        })
    }

    const warn_notification = (content) => toast.warn(content, {
        position: "bottom-right",
        autoClose: 4000,
        hideProgressBar: false,
        closeOnClick: true,
        draggable: true,
        progress: undefined,
        newestOnTop: true
    });

    const success_notification = (content) => toast.success(content, {
        position: "bottom-right",
        autoClose: 4000,
        hideProgressBar: false,
        closeOnClick: true,
        draggable: true,
        progress: undefined,
        newestOnTop: true
    });


    return (
        <>
            <MDBContainer className="p-3 my-3 d-flex flex-column w-75">

                <MDBTabsContent>

                        <div className="text-center mb-3">
                            <h2>Attendance Marking App</h2>
                            <hr/>
                            <h3>Sign In</h3>
                        </div>

                        <div className="mb-3">
                            <label className="form-label">SNU ID</label>
                            <input type="text" value={props.userSNUID} onChange={(e) => {
                                props.setUserSNUID(e.target.value.toLowerCase())
                            }} className="form-control" id="exampleInputEmail1"
                                   placeholder={"Enter Your NET ID"}/>
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Password</label>
                            <input type="password" value={props.loginPassword} onChange={(e) => {
                                props.setLoginPassword(e.target.value)
                            }} className="form-control" placeholder={"Enter Your Roll Number"}/>
                        </div>
                        <div className="text-center mb-3 ">
                            {loginButtonDisabled?<button className="btn btn-primary my-3 w-75" type="button" disabled>
                                <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"/>
                                Logging in
                            </button>:
                            <button type="submit" className="btn btn-primary my-3 w-75" onClick={loginSubmit}
                                    onKeyPress={(e) => {
                                console.log(e.key)
                            }}>Log in
                            </button>}
                        </div>


                </MDBTabsContent>

            </MDBContainer>
        </>

    )
}

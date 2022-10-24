import React, {useState} from "react";
import axios from "axios";
import {useNavigate} from "react-router-dom";
import {useEffect} from "react";
import {
    MDBContainer,
    MDBTabs,
    MDBTabsItem,
    MDBTabsLink,
    MDBTabsContent,
    MDBTabsPane,
}
    from 'mdb-react-ui-kit';
import {toast} from "react-toastify";


export const LoginPage = (props) => {
    let navigate = useNavigate();
    const routeChange = (path) => {
        navigate(path);
    }

    const loginSubmit = (e) => {
        e.preventDefault()
        axios.post(process.env.REACT_APP_API_URI + process.env.REACT_APP_API_VERSION + "/login", {
            'email_ID': props.userSNUID,
            'password': props.loginPassword
        }).then((result) => {
            if (result.data.statusCode === 0) {
                props.setUserSNUID(props.userSNUID)
                localStorage.clear()
                localStorage.setItem("user_emailID", result.data.encrypted_emailID)
                localStorage.setItem("user_emailID_len", result.data.email_len)
                routeChange('/select-days')
                success_notification("Login Successful!")
            } else if (result.data.statusCode === 1) {
                console.log("Passwords do not match")
                warn_notification("Password does not match!")
            } else if (result.data.statusCode === 2) {
                console.log("USER NOT REGISTERED")
                warn_notification("User is not registered")
            }
        })
    }

    const [justifyActive, setJustifyActive] = useState('LoginPage');

    const handleJustifyClick = (value) => {
        if (value === justifyActive) {
            return;
        }
        setJustifyActive(value);
    }

    const [disableLoginButton, setDisableLoginButton] = React.useState(false)


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

                <MDBTabs pills justify className='mb-3 d-flex flex-row justify-content-between'>
                    <MDBTabsItem>
                        <MDBTabsLink onClick={() => handleJustifyClick('LoginPage')}
                                     active={justifyActive === 'LoginPage'}>
                            Login
                        </MDBTabsLink>
                    </MDBTabsItem>
                    <MDBTabsItem>
                        <MDBTabsLink onClick={() => handleJustifyClick('RegisterPage')}
                                     active={justifyActive === 'RegisterPage'}>
                            Register
                        </MDBTabsLink>
                    </MDBTabsItem>
                </MDBTabs>
                <hr/>

                <MDBTabsContent>

                    <MDBTabsPane show={justifyActive === 'LoginPage'}>

                        <div className="text-center mb-3">
                            <h3>Sign In</h3>
                        </div>

                        <div className="mb-3">
                            <label className="form-label">SNU Email ID</label>
                            <input type="text" value={props.userSNUID} onChange={(e) => {
                                props.setUserSNUID(e.target.value.toLowerCase())
                            }} className="form-control" id="exampleInputEmail1" aria-describedby="emailHelp"
                                   placeholder={"Enter SNU ID"}/>
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Password</label>
                            <input type="password" value={props.loginPassword} onChange={(e) => {
                                props.setLoginPassword(e.target.value)
                            }} className="form-control" placeholder={"Enter Password"}/>
                        </div>
                        <div className="d-flex justify-content-between">
                            <a href="!#">Forgot password?</a>
                        </div>
                        <div className="text-center mb-3 ">
                            <button type="submit" className="btn btn-primary my-3 w-75" onClick={loginSubmit}
                                    disabled={disableLoginButton} onKeyPress={(e) => {
                                console.log(e.key)
                                if (e.key === "Enter") {
                                    this.setState({message: e.target.value},
                                        () => {
                                            alert(this.state.message);
                                        });
                                }
                            }}>Log in
                            </button>
                        </div>

                    </MDBTabsPane>


                </MDBTabsContent>

            </MDBContainer>
        </>

    )
}

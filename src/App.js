import './App.css';
import {BrowserRouter as Router, Routes, Route, Navigate} from "react-router-dom";
import {LoginPage} from "./MyComponents/LoginPage";
import {useState} from "react";
import 'react-toastify/dist/ReactToastify.css'
import {ToastContainer} from "react-toastify";
import {MarkAttendancePage} from "./MyComponents/MarkAttendancePage";


function App() {
    const [userSNUID, setUserSNUID] = useState("")
    const [loginPassword, setLoginPassword] = useState("")



    return (
        <>
            <Router>
                <Routes>
                    <Route exact path="/login"
                           element={<>
                               <LoginPage userSNUID={userSNUID}
                                          setUserSNUID={setUserSNUID}
                                          loginPassword={loginPassword}
                                          setLoginPassword={setLoginPassword}/></>}/>
                    <Route exact path="/mark-attendance"
                           element={<>
                               <MarkAttendancePage userSNUID={userSNUID}
                                          setUserSNUID={setUserSNUID}
                                          loginPassword={loginPassword}
                                          setLoginPassword={setLoginPassword}/></>}/>


                    <Route exact path="/" element={<Navigate to="/login"/>}/>
                </Routes>
            </Router>
            <ToastContainer/>
        </>
    );
}

export default App;

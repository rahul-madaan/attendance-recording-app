import React from "react";
import {useNavigate} from "react-router-dom";
import {useState, useEffect} from "react";


import axios from "axios";
import 'react-toastify/dist/ReactToastify.css'
import {toast} from "react-toastify";
import {getCurrentBrowserFingerPrint} from "@rajesh896/broprint.js";

export const MarkAttendancePage = (props) => {

    const [name, setName] = useState("")
    const [rollNumber, setRollNumber] = useState("")
    const [userLatitude, setUserLatitude] = useState(0)
    const [userLongitude, setUserLongitude] = useState(0)
    const [userIPv4, setUserIPv4] = useState(0)
    const [collectUserDetailsLoading, setCollectUserDetailsLoading] = useState(false)
    const [collectUserDetailsDisabled, setCollectUserDetailsDisabled] = useState(true)
    const [markAttendanceDisabled, setMarkAttendanceDisabled] = useState(true)
    const [browserFingerprint, setBrowserFingerprint] = useState("")

    const getBrowserFingerprint = () => {
        getCurrentBrowserFingerPrint().then((fingerprint) => {
            // fingerprint is your unique browser id.
            console.log("Browser Fingerprint: " + fingerprint)
            setBrowserFingerprint(fingerprint)
            // the result you receive here is the combination of Canvas fingerprint and audio fingerprint.
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


    const verifyLogin = () => {
        console.log("login verify started")
        axios.post(process.env.REACT_APP_API_URI + process.env.REACT_APP_API_VERSION + "/verify-login", {
            'encrypted_net_id': localStorage.getItem("user_net_id"),
            'encrypted_net_id_len': localStorage.getItem("user_net_id_len"),
            'auth_token': process.env.REACT_APP_API_AUTH_TOKEN
        }).then((result) => {
            if(result.data.user_net_id==="sonia.khetarpaul@snu.edu.in"){
                warn_notification("Not Authorized!")
                routeChange("/check-attendance")
            }
            console.log(result.data.loginSuccess)
            if (result.data.loginSuccess === 0) {
                console.log("cant verify email, login again")
                warn_notification("Can't verify your login, please login again!")
                routeChange('/login')
                localStorage.removeItem("user_net_id")
                localStorage.removeItem("user_net_id_len")
            } else if (result.data.loginSuccess === 1) {
                console.log("fetched email= " + result.data.user_net_id)
                props.setUserSNUID(result.data.user_net_id)
                console.log("Login verified successfully")
                setCollectUserDetailsDisabled(false)
                setName(result.data.name)
                setRollNumber(result.data.roll_number)
            }
        }).catch(error => {
            console.log(error.response)
            routeChange('/login')
        })
    }

    useEffect(() => {
        verifyLogin()
    }, []);

    let navigate = useNavigate();
    const routeChange = (path) => {
        navigate(path);
    }

    const getIPv4 = async () => {
        const res = await axios.get('https://geolocation-db.com/json/')
        console.log(res.data);
        setUserIPv4(res.data.IPv4)
    }


    const getLocation = () => {
        return new Promise(function (resolve, reject) {
            navigator.geolocation.getCurrentPosition(function (position) {
                console.log("Latitude is :", position.coords.latitude);
                console.log("Longitude is :", position.coords.longitude);
                setUserLatitude(position.coords.latitude)
                setUserLongitude(position.coords.longitude)
                resolve()
            }, function (error) {
                warn_notification(error)
                console.log(error)
                reject()
                warn_notification(error.message.toString())
            }, {
                enableHighAccuracy: true, timeout: 20000, showLocationDialog: true,
                forceRequestLocation: true
            });
        })
    }

    const callMarkAttendance = async () => {
        // return new Promise(async function (resolve, reject) {
        const res = await axios.post(process.env.REACT_APP_API_URI + process.env.REACT_APP_API_VERSION + '/mark-attendance',
            {
                "net_id": props.userSNUID,
                "IP_address": userIPv4,
                'browser_fingerprint': browserFingerprint,
                'latitude': userLatitude,
                'longitude': userLongitude,
                'auth_token': process.env.REACT_APP_API_AUTH_TOKEN
            }).catch(error => {
            console.log(error)
            warn_notification("Error occurred, try again!")
        })
        if(res.data['status'] === "ATTENDANCE_MARKED_SUCCESSFULLY")
            success_notification("Attendance Marked!")
        else
            warn_notification(res.data['status'])
        // resolve()
        // })
    }


    const markAttendanceButtonClick = async (e) => {
        e.preventDefault()
        await callMarkAttendance()
        setMarkAttendanceDisabled(true)
        setCollectUserDetailsDisabled(false)

    }


    const collectUserDetailsButtonClick = async (e) => {
        e.preventDefault()
        getBrowserFingerprint()
        setCollectUserDetailsLoading(true)
        await getIPv4()
        await getLocation()
        setCollectUserDetailsLoading(false)
        setCollectUserDetailsDisabled(true)
        setMarkAttendanceDisabled(false)
        success_notification("Collected IP, Location, Unique DeviceID Successfully!")
    }

    return (<>
            <br/>
            <div className="container h-100 d-flex justify-content-center">
                <h3>Mark your attendance</h3>
            </div>
            <hr/>

            <div className="container h-100 d-flex justify-content-center">
                <p className="fs-4">Your Class details</p>
            </div>

            <div className="container h-100 d-flex justify-content-center">
                <table className="table">
                    <thead>
                    <tr>
                        <th scope="col" className="fs-4">Detail</th>
                        <th scope="col" className="fs-4">Your Details</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr>
                        <th scope="row">Name</th>
                        <td>{name}</td>
                    </tr>
                    <tr>
                        <th scope="row">Roll Number</th>
                        <td>{rollNumber}</td>
                    </tr>
                    <tr>
                        <th scope="row">Course</th>
                        <td>DBMS</td>
                    </tr>
                    <tr>
                        <th scope="row">Course Code</th>
                        <td>CSD 317</td>
                    </tr>
                    <tr>
                        <th scope="row">Instructor</th>
                        <td colSpan="2">Dr. Sonia Khetarpaul</td>
                    </tr>
                    <tr>
                        <th scope="row">Days</th>
                        <td colSpan="2">Mon, Wed, Fri</td>
                    </tr>
                    <tr>
                        <th scope="row">Timings</th>
                        <td colSpan="2">9:00 - 10:00 AM</td>
                    </tr>
                    </tbody>
                </table>
            </div>

            <div className="container h-100 d-flex justify-content-center">
                {!collectUserDetailsLoading ? <button type="button" className="btn btn-warning btn-lg my-3 mx-3"
                                                      onClick={collectUserDetailsButtonClick}
                                                      disabled={collectUserDetailsDisabled}
                    >Collect User Details
                    </button> :
                    <button className="btn btn-warning btn-lg my-3 mx-3" type="button" disabled>
                        <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"/>
                        Collecting User details
                    </button>}
            </div>

            <div className="container h-100 d-flex justify-content-center">
                <button type="button" className="btn btn-success btn-lg my-3 mx-3"
                        onClick={markAttendanceButtonClick}
                        disabled={markAttendanceDisabled}
                >Mark Attendance
                </button>
            </div>
            <br/>
            <br/>
            <br/>
            <br/>
            <br/>
            <br/>
            <br/>

        </>
    )
}

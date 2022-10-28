import React from "react";
import {useNavigate} from "react-router-dom";
import {useState, useEffect} from "react";


import axios from "axios";
import 'react-toastify/dist/ReactToastify.css'
import {CheckAttendanceTableContent} from "./CheckAttendanceTableContent";
import {toast} from "react-toastify";
import fileDownload from 'js-file-download'

export const CheckAttendance = (props) => {

    const [attendanceList, setAttendanceList] = useState([])
    const [initiateAttendanceDisabled, setInitiateAttendanceDisabled] = useState(true)
    const [finishAttendanceDisabled, setFinishAttendanceDisabled] = useState(true)
    const [searchNetID, setSearchNetID] = useState("")
    const [searchStudentDetails, setSearchStudentDetails] = useState([])
    const [markPresentDisabled, setMarkPresentDisabled] = useState(true)
    const [downloadAttendanceDisabled, setDownloadAttendanceDisabled] = useState(false)

    let navigate = useNavigate();
    const routeChange = (path) => {
        navigate(path);
    }

    const clickRefreshListButton = (e) => {
        e.preventDefault()
        axios.get(process.env.REACT_APP_API_URI + process.env.REACT_APP_API_VERSION + "/check-attendance")
            .then((result) => {
                setAttendanceList(result.data.present)
                console.log(result.data.present.map((item, index) => console.log(item.name)))
                success_notification("Attendance List Refreshed!")
            })
    }

    const checkAttendanceStatus = () => {
        axios.get(process.env.REACT_APP_API_URI + process.env.REACT_APP_API_VERSION + "/check-attendance-status")
            .then((result) => {
                if (result.data.status === 1) {
                    setFinishAttendanceDisabled(false)
                    setInitiateAttendanceDisabled(true)
                } else {
                    setFinishAttendanceDisabled(true)
                    setInitiateAttendanceDisabled(false)
                }
            })
    }

    useEffect(() => {
        checkAttendanceStatus()
        verifyLogin()
    }, []);


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
            'encrypted_net_id_len': localStorage.getItem("user_net_id_len")
        }).then((result) => {
            console.log(result.data.loginSuccess)
            if (result.data.loginSuccess === 0) {
                console.log("cant verify email, login again")
                warn_notification("Can't verify your login, please login again!")
                routeChange('/login')
                localStorage.removeItem("user_net_id")
                localStorage.removeItem("user_net_id_len")
            } else if (result.data.loginSuccess === 1) {
                console.log("fetched email= " + result.data.user_net_id)
                if (result.data.user_net_id === "sonia.khetarpaul@snu.edu.in") {
                    props.setUserSNUID(result.data.user_net_id)
                    console.log("Login verified successfully")
                } else {
                    console.log("Not Authorized")
                    warn_notification("Not Authorized!")
                    routeChange('/login')
                }
            }
        }).catch(error => {
            console.log(error.response)
            routeChange('/login')
        })
    }


    const clickFinishAttendanceButton = (e) => {
        e.preventDefault()
        axios.post(process.env.REACT_APP_API_URI + process.env.REACT_APP_API_VERSION + "/set-attendance-status", {"value": "false"})
            .then((result) => {
                setInitiateAttendanceDisabled(false)
                setFinishAttendanceDisabled(true)
                success_notification("Attendance Finished!")
            })
    }

    const clickInitiateAttendanceButton = (e) => {
        e.preventDefault()
        axios.post(process.env.REACT_APP_API_URI + process.env.REACT_APP_API_VERSION + "/set-attendance-status", {"value": "true"})
            .then((result) => {
                setInitiateAttendanceDisabled(true)
                setFinishAttendanceDisabled(false)
                success_notification("Attendance Initiated!")
            })
    }

    const clickSearchButton = (e) => {
        e.preventDefault()
        axios.post(process.env.REACT_APP_API_URI + process.env.REACT_APP_API_VERSION + "/search-student", {"net_id": searchNetID})
            .then((result) => {
                if (result.data.status === "NET_ID_NOT_FOUND") {
                    setSearchStudentDetails([])
                    warn_notification("Net ID Not Found!")
                } else {
                    setSearchStudentDetails(result.data)
                    setMarkPresentDisabled(false)
                }
            })
    }

    const clickMarkPresentButton = (e) => {
        e.preventDefault()
        axios.post(process.env.REACT_APP_API_URI + process.env.REACT_APP_API_VERSION + "/mark-attendance-override", {"net_id": searchNetID})
            .then((result) => {
                success_notification("Marked Attendance of " + searchStudentDetails.first_name + " " + searchStudentDetails.last_name)
                setMarkPresentDisabled(true)
            })
    }

    const clickDownloadAttendanceButton = (e) => {
        setDownloadAttendanceDisabled(true)
        e.preventDefault()
        axios.get("https://1nve0omuw1.execute-api.ap-south-1.amazonaws.com/dev/api/v1/attendance/download-attendance")
            // axios.get(process.env.REACT_APP_API_URI + process.env.REACT_APP_API_VERSION + "/download-attendance")
            .then((result) => {
                console.log("url fetched")
                axios.get(result.data.url).then((res) => {
                    setDownloadAttendanceDisabled(false)
                    fileDownload(res.data, "attendance.txt")
                    success_notification("Attendance File downloaded!")
                })
            })
    }

    return (<>
            <br/>
            <div className="container h-100 d-flex justify-content-center">
                <h3>Check attendance</h3>
            </div>
            <hr/>

            <div className="container h-100 d-flex justify-content-center">
                <p className="fs-4">Class details</p>
            </div>

            <div className="container h-100 d-flex justify-content-center">
                <table className="table">
                    <thead>
                    <tr>
                        <th scope="col" className="fs-4">Field</th>
                        <th scope="col" className="fs-4">Details</th>
                    </tr>
                    </thead>
                    <tbody>
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
                <div className="btn-group" role="group" aria-label="Basic example">
                    <button type="button" className="btn btn-success" disabled={initiateAttendanceDisabled}
                            onClick={clickInitiateAttendanceButton}>Initiate Attendance
                    </button>
                    <button type="button" className="btn btn-danger" disabled={finishAttendanceDisabled}
                            onClick={clickFinishAttendanceButton}>Finish Attendance
                    </button>
                </div>
            </div>
            <div className="container  d-flex justify-content-center">
                <p className="fs-3">Students Present</p>
            </div>

            <div className="container  d-flex justify-content-center">
                <button type="button" className="btn btn-warning btn my-3 mx-3" onClick={clickRefreshListButton}>REFRESH
                    LIST
                </button>
            </div>

            <div className="container h-100 d-flex justify-content-center">
                <table className="table">
                    <thead>
                    <tr>
                        <th scope="col" className="fs-5">Name</th>
                        <th scope="col" className="fs-5">Roll Number</th>
                        <th scope="col" className="fs-5">Net ID</th>
                        <th scope="col" className="fs-5">Attendance</th>
                    </tr>
                    </thead>
                    <tbody>
                    {attendanceList.length === 0 ? "List Empty" :
                        attendanceList.map((item, index) => {
                            return <CheckAttendanceTableContent name={item.name} roll_number={item.roll_number}
                                                                net_id={item.net_id}/>
                        })}
                    </tbody>
                </table>
            </div>
            <br/>
            <br/>
            <div className="container h-100 d-flex justify-content-center">
                <h3>Mark Attendance</h3>
            </div>

            <div className="container  d-flex justify-content-center">
                <div className="input-group">
                    <input type="search" className="form-control rounded" placeholder="Search Net ID" onChange={(e) => {
                        setSearchNetID(e.target.value.toLowerCase())
                    }}/>
                    <button type="button" className="btn btn-outline-primary" onClick={clickSearchButton}>Search Net ID
                    </button>
                </div>
            </div>
            {searchStudentDetails.length === 0 ? null :
                <div className="container h-100 d-flex justify-content-center">
                    <table className="table">
                        <thead>
                        <tr>
                            <th scope="col" className="fs-5">Name</th>
                            <th scope="col" className="fs-5">Net ID</th>
                            <th scope="col" className="fs-5">Roll Number</th>
                            <th scope="col" className="fs-5">Attendance</th>
                        </tr>
                        </thead>
                        <tbody>
                        <tr>
                            <td>{searchStudentDetails.first_name + " " + searchStudentDetails.last_name}</td>
                            <td>{searchStudentDetails.net_id}</td>
                            <td>{searchStudentDetails.roll_number}</td>
                            <td>{searchStudentDetails.attendance}</td>
                        </tr>
                        </tbody>
                    </table>
                </div>
            }
            {searchStudentDetails.attendance === "ABSENT"
                ? <div className="container  d-flex justify-content-center">
                    <button type="button" className="btn btn-success" onClick={clickMarkPresentButton}
                            disabled={markPresentDisabled}>Mark Present
                    </button>
                </div> : null}
            <br/>
            <br/>
            <br/>
            {!downloadAttendanceDisabled ? <div className="container  d-flex justify-content-center">
                    <button type="button" className="btn my-3 btn-lg btn-warning"
                            onClick={clickDownloadAttendanceButton}>Download Attendance List
                    </button>
                </div> :
                <div className="container  d-flex justify-content-center">
                    <button className="btn my-3 btn-lg btn-warning" type="button" disabled>
                        <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"/>
                        Downloading Attendance List
                    </button>
                </div>}


            <br/>
            <br/>
            <br/>
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

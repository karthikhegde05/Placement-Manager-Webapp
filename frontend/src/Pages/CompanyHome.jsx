import React from "react";
import { useState, useEffect } from "react";
import { useNavigate, useLocation} from "react-router-dom";
import { AuthContext } from "../Context/AuthContext";
import Axios from 'axios';
import axios from '../Api/axios';

import '../stylesheets/CompanyCardLayout.css';



  const CompanyHome = () => {

        const { state } = useLocation();
        const navigate = useNavigate();
        const [details, setDetails] = useState({});
        const [nullDetails, setNullDetails] = useState(true);
        const [rejected, setRejected] = useState(false);

        const [sidebarActive, setSidebarActive] = useState(false);

        const role = localStorage.getItem("role");

        const companyIdNumber = state;


        useEffect(() => {
            let source = Axios.CancelToken.source();

            const getCompanyDetails = async() =>{
                let result = await axios.get("/company-home/" + state, {
                    cancelToken: source.token,
                }).then((response)=>{  
                    if(response.data.nullObj==false){
                        setDetails(response.data.companyDetails);
                        setNullDetails(false);
                        console.log(response.data.companyDetails);
                        console.log("fetched");
                    }
                })
                .catch((err)=>{
                    if(Axios.isCancel(err))
                        console.log("successfully aborted");
                     console.log(err);
                })
            };

            getCompanyDetails();

            return()=>{
                console.log("unmounting");
                source.cancel();
            };

        }, [rejected]);

        const studentReject = async(companyId, studentId) => {
            const result = await axios.post("/company-reject-student/", {
                "companyId": companyId,
                "studentId": studentId
            }).then((response)=>{
                if(response.data.ack==true){
                    console.log("student rejected");
                    setRejected(!rejected);
                }
                else console.log("server side error in deleting student from company list")
            }).catch(err=>{console.log(err);})
        };

        const downloadResume = (studentName, studentResume) => {
            function base64ToArrayBuffer(base64) {
                var binaryString = window.atob(base64);
                var binaryLen = binaryString.length;
                var bytes = new Uint8Array(binaryLen);
                for (var i = 0; i < binaryLen; i++) {
                    var ascii = binaryString.charCodeAt(i);
                    bytes[i] = ascii;
                }
                return bytes;
                }

                let data = studentResume;
                
                if(data!=null){
                data = base64ToArrayBuffer(data);
                }
                else {
                console.log("no resume downloaded from the server");
                }

            const url = window.URL.createObjectURL(new Blob([data], {type: "application/pdf"}));
            const link = document.createElement('a');
            console.log(link);
            link.href = url;
            console.log(url);
            link.setAttribute('target', `${studentName}-software-resume.pdf`);
            document.body.appendChild(link);
            link.click();
        };

        return (
            <div className="com-sidebar-layout">
                {(role=="recruiter" || role=="admin") && 
                    <div className={(sidebarActive)?"com-sidebarcomp-body":"com-sidebarcomp-inactive-body"}>
                        <ul className="com-sidebarcomp-ul">
                            <li className="com-sidebarcomp-li" onClick={(e)=>navigate("/company/update-details", {state:companyIdNumber})}>
                                update details 
                            </li>
                        </ul>
                    </div>
                }




                { !nullDetails &&
                    <div className={(sidebarActive)?"com-cardcomp-body":"com-cardcomp-full-body"}>
                        <div className="com-navbarcomp-body">
                           {   (role=="recruiter" || role=="admin") && 
                                <button className="com-navbarcomp-menu" onClick={(e)=>{
                                    setSidebarActive(!sidebarActive);
                                }}>menu</button>
                            }
                            <button className="com-navbarcomp-menu" onClick={(e)=>{
                                (role=="admin")?navigate("/admin/home"):(role=="recruiter")?navigate("/recruiter/home"):navigate("/student/home");
                            }}>home</button>
                            <p className="com-navbarcomp-title">{details.name} - {details.stream}</p>
                        </div>

                        <div className="com-detailsbar">
                            <div className="com-detailsbar-p">
                                <h3>General Guidelines</h3>
                                <p>{details.info}</p>
                            </div>
                            <div className="com-detailsbar-p">
                                <h3>Test Link</h3>
                                <p>{details.testLink}</p>
                            </div>
                            <div className="com-detailsbar-p">
                                <h3>Meeting Link</h3>
                                <p>{details.meetingLink}</p>
                            </div>
                            <div className="com-detailsbar-p">
                                <h3>Job Description</h3>
                                <p>{details.jobDescription}</p>
                            </div>
                        </div>

                        <div className="com-cardcomp-albums">
                            {
                                (role=="admin" || role=="recruiter") && details.selectedStudents.map((student, index)=>{
                                    return (
                                        <div key={index} className="com-cardcomp-album">
                                            <img className="com-cardcomp-album__artwork" src="/profile-boy.png" alt="comp-image"/>
                                            <div className="com-cardcomp-album__details">
                                                <p className="com-cardcomp-h2">{student.firstName} {student.lastName}</p>
                                                <p className="com-cardcomp-h3">{student.email}</p>
                                                <button className="com-cardcomp-btn com-cardcomp-draw-border" onClick={(e) => {return studentReject(details.companyId, student.studentId);}}>reject</button>
                                                <button className="com-cardcomp-btn com-cardcomp-draw-view-border" onClick={(e) => {
                                                    (details.stream=="software")?downloadResume(student.firstName, student.softwareResume):(details.stream=="datascience")?
                                                        downloadResume(student.firstName, student.datascienceResume):downloadResume(student.firstName, student.eceResume);
                                                }}>view Resume</button>
                                            </div>
                                        </div>
                                    );
                                })
                            }
                        </div>
                    </div>

                }
            </div>
        );
  };

  export default CompanyHome;
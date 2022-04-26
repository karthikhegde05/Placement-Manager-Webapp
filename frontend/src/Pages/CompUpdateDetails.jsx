import React, {useState} from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from '../Api/axios';
import '../stylesheets/CompUpdateForm.css';

  const CompUpdateDetails = () => {

    const {state} = useLocation();
    const navigate = useNavigate();
    const companyIdNumber = state;

    const [meetingLink, setMeetingLink] = useState(" ");
    const [testLink, setTestLink] = useState(" ");
    const [info, setInfo] = useState(" ");
    const [jobDescription, setJobDescription] = useState(" ");
    const [jobPay, setJobPay] = useState(" ");
    
    const updDetails = async(e) =>{
        e.preventDefault();

        const result = await axios.post("/company-details-update/", {
            "companyId": state,
            "meetingLink": meetingLink,
            "testLink": testLink,
            "info":info,
            "jobDescription": jobDescription,
            "jobPay": jobPay
        }).then((response)=>{return rcvUpdProcess(response);})
        .catch((error)=>{console.log("error while updating");});
    };

    const rcvUpdProcess = (response) => {
        if(response.data.ack==true){
            console.log("updated");
            navigate("/company/home", {state:companyIdNumber});
        }
        else {
            console.log("update unsuccessful server side error");
        }
    };

    return (
        <div className="compupd-body">
            <form onSubmit={updDetails}>
                <div className="compupd-form">
                    <div className="compupd-subtitle">update details</div>
                    <div className="compupd-input-container compupd-ic1">
                        <input id="Meeting link" className="compupd-input" type="text" placeholder="" onChange={(e)=>setMeetingLink(e.target.value)}/>
                        <div className="compupd-cut"></div>
                        <label htmlFor="Meeting link" className="compupd-placeholder">Meeting Link</label>
                    </div>
                    <div className="compupd-input-container compupd-ic2">
                        <input id="TestLink" className="compupd-input" type="text" placeholder="" onChange={(e)=>setTestLink(e.target.value)}/>
                        <div className="compupd-cut"></div>
                        <label htmlFor="TestLink" className="compupd-placeholder">Test Link</label>
                    </div>
                    <div className="compupd-input-container compupd-ic2">
                        <input id="info" className="compupd-input" type="text" placeholder="" onChange={(e)=>setInfo(e.target.value)}/>
                        <div className="compupd-cut"></div>
                        <label htmlFor="info" className="compupd-placeholder">General Guidelines</label>
                    </div>
                    <div className="compupd-input-container compupd-ic2">
                        <input id="Job Description" className="compupd-input" type="text" placeholder="" onChange={(e)=>setJobDescription(e.target.value)}/>
                        <div className="compupd-cut"></div>
                        <label htmlFor="Job Description" className="compupd-placeholder">Job Description</label>
                    </div>
                    <div className="compupd-input-container compupd-ic2">
                        <input id="Job Pay" className="compupd-input" type="text" placeholder="" onChange={(e)=>setJobPay(e.target.value)}/>
                        <div className="compupd-cut"></div>
                        <label htmlFor="Job Pay" className="compupd-placeholder">Job Pay</label>
                    </div>
                    <button type="text" className="compupd-submit">Update</button>
                </div>
            </form> 
        </div>
    );
  };

  export default CompUpdateDetails;
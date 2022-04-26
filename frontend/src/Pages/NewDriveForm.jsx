import React, { useState } from "react";
import { useEffect } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import axios from "../Api/axios";
import '../stylesheets/NewDrive.css';

  const NewDriveForm = () => {

    const [companyName, setCompanyName] = useState("");
    const [companyStream, setCompanyStream] = useState("software");
    const [deadlineDate, setDeadlineDate] = useState("");
    const [rec1, setRec1] = useState("0");
    const [rec2, setRec2] = useState("0");

    const navigate = useNavigate();

    const sndCreation = async (e) => {
        e.preventDefault();

        let recId =  [];
        if (rec1 != "0")  recId.push(rec1);
        if (rec2!="0")  recId.push(rec2);
        const result = await axios.post("create-new-drive/", {
            "companyName": companyName,
            "companyStream": companyStream,
            "deadlineDate": deadlineDate,
            "recId": recId
        }).then((response)=>{return sndCreationProcess(response);})
        .catch((error)=>{console.log("error in sending post request");})
    };

    const sndCreationProcess = (response) => {
        if(response.data.createDriveComplete==true){
            console.log("drive created");

            navigate("/admin/home");
        }
        else {
            if(response.data.alreadTaken==true){
                console.log("company name and stream name is already created");
            }
            else console.log("server error while creation");
        }
    };


    return (
        <div class="newDrive-body">
            <form onSubmit={sndCreation} >
                <div class="newDrive-form">
                    <div class="newDrive-subtitle">Create new recruitment drive</div>

                    <div  class="newDrive-input-container newDrive-ic1">
                        <input id="companyName" type="text" class="newDrive-input" placeholder="" onChange={(e)=>setCompanyName(e.target.value)}/>
                        <div class="newDrive-cut"></div>
                        <label htmlFor="companyName" class="newDrive-placeholder">Company Name</label>
                    </div>
                    <div class="newDrive-input-container newDrive-ic2">
                        <select id="stream" className="newDrive-input" placeholder="" onChange={(e)=>setCompanyStream(e.target.value)}>
                                <option value="software">software</option>
                                <option value="datascience">datascience</option>
                                <option value="ece">ece</option>
                        </select>
                        <div class="newDrive-cut"></div>
                        <label htmlFor="stream" class="newDrive-placeholder">Stream</label>
                    </div>
                    <div  class="newDrive-input-container newDrive-ic2">
                        <input id="deadlineDate" type="date" class="newDrive-input" placeholder="" onChange={(e)=>setDeadlineDate(e.target.value)}/>
                        <div class="newDrive-cut"></div>
                        <label htmlFor="deadline" class="newDrive-placeholder">Deadline to apply</label>
                    </div>
                    <div  class="newDrive-input-container newDrive-ic2">
                        <input id="recruiter1" type="text" class="newDrive-input" placeholder="" onChange={(e)=>setRec1(e.target.value)}/>
                        <div class="newDrive-cut"></div>
                        <label htmlFor="recruiter1" class="newDrive-placeholder">Recruiter-I ID</label>
                    </div>
                    <div  class="newDrive-input-container newDrive-ic2">
                        <input id="recruiter2" type="text" class="newDrive-input" placeholder="" onChange={(e)=>setRec2(e.target.value)}/>
                        <div class="newDrive-cut"></div>
                        <label htmlFor="recruiter2" class="newDrive-placeholder">Recruiter-II ID</label>
                    </div>
                    <button type="text" className="newDrive-submit">Create</button>
                </div>
            </form>
        </div>

    );
  };

  export default NewDriveForm;
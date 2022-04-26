import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import Axios from 'axios';
import axios from '../Api/axios';
import '../stylesheets/StudentProfile.css';


  const StudentProfile = () => {

    const [details, setDetails] = useState([]);
    const [reload, setReload] = useState(true);
    const [userId, setUserId] = useState("");
    const [password, setPassword] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [softwareResume, setSoftwareResume] = useState(null);
    const [softwareResumeFile, setSoftwareResumeFile] = useState(null);
    const [datascienceResume, setDatascienceResume] = useState(null);
    const [datascienceResumeFile, setDatascienceResumeFile] = useState(null);
    const [eceResume, setEceResume] = useState(null);
    const [eceResumeFile, setEceResumeFile] = useState(null);
    

    useEffect(()=>{
      let source = Axios.CancelToken.source();

        const getStudentDetails = async() =>{
            let result = await axios.get("/student-profile-details/" + localStorage.getItem("objId"), {
                cancelToken: source.token,
                responseType: 'byte'
            }).then((response)=>{  
                if(response.data.nullObj==false){
                    setDetails(response.data);
                    setUserId(response.data.userId);
                    setPassword(response.data.password);
                    setFirstName(response.data.firstName);
                    setLastName(response.data.lastName);
                    setSoftwareResumeFile(response.data.softwareResume);
                    setDatascienceResumeFile(response.data.datascienceResume);
                    setEceResumeFile(response.data.eceResume);
                    console.log(response.data);
                    console.log("fetched");
                }
            })
            .catch((err)=>{
                if(Axios.isCancel(err))
                    console.log("successfully aborted");
                 console.log(err);
            })
        };

        getStudentDetails();

        return()=>{
            console.log("unmounting");
            source.cancel();
        };
  
    }, [reload]);

    
    const updateProfile = async(e) => {
        e.preventDefault()
        let formData = new FormData();
        
        formData.append("firstName", firstName);
        formData.append("lastName", lastName);
        formData.append("password", password);
        formData.append("softwareResume", softwareResume);
        formData.append("datascienceResume", datascienceResume);
        formData.append("eceResume", eceResume);

        let result = axios.post("/student-profile-update/" + localStorage.getItem("objId"), formData)
            .then((response)=>{
                if(response.data.ack==true){
                    console.log("resume sent");
                    setReload(!reload);
                }
                else console.log("error in storing resume in backend");
            }).catch((err)=>{console.log("error in sending resume");});
        
    };

    const selectResumeFile = (e, str) =>{
        let allowedFiles = ["application/pdf"];
        let selectedFile = e.target.files[0];
      
        if(selectedFile && allowedFiles.includes(selectedFile.type)){
          ;
        }
        else{
            console.log("selected file is not a pdf. Please select a pdf file");
        }

        if(str=="software")
            setSoftwareResume(selectedFile);
        else if(str=="datascience")
            setDatascienceResume(selectedFile);
        else setEceResume(selectedFile);
    }

    const downloadPdf = (str) => {
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

         let data = (str=="software")?softwareResumeFile:(str=="datascience")?datascienceResumeFile:eceResumeFile;
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
        link.setAttribute('download', `${firstName}-${str}-resume.pdf`);
        document.body.appendChild(link);
        link.click();
    };

    return (
        // <div>
        //     <div>
        //         <p>Student details like rollnumber, name</p>
        //         <p>password editable</p>
        //         <p>email editable</p>
        //         <p>software role resume upload</p>
        //         <p>data science role resume upload</p>
        //         <p>ece role resume upload</p>
        //     </div>

        //     <hr></hr>

        //     <div>
        //         <form onSubmit={updateProfile}>
        //           User ID:
        //           <p>{details.userId}</p>
        //           <br/>
        //           Name:
        //           <input type="text" value={firstName} onChange={(e)=>setFirstName(e.target.value)}/>
        //           <input type="text" value={lastName} onChange={(e)=>setLastName(e.target.value)}/>
        //           <br/>
        //           Software resume: 
        //           <input type="file"  onChange={(e)=>{selectSoftwareFile(e);}} /> {(softwareResumeFile!=null)?<button type="button" onClick={downloadPdf}>view resume</button>:<p>No resume uploaded</p>}
        //           <br />
        //           <input type="submit" value="update" />
        //         </form>
        //     </div>
        // </div>

        <div className="stuprof-body">
            <form onSubmit={updateProfile}>
                <div className="stuprof-form">
                    <div className="stuprof-subtitle">Your User ID: {details.userId}</div>
                    <div className="stuprof-input-container stuprof-ic1">
                        <input id="firstName" className="stuprof-input" type="text" value={firstName} placeholder="" onChange={(e)=>setFirstName(e.target.value)}/>
                        <div className="stuprof-cut"></div>
                        <label htmlFor="firstName" className="stuprof-placeholder">First name</label>
                    </div>
                    <div className="stuprof-input-container stuprof-ic2">
                        <input id="lastName" className="stuprof-input" type="text" value={lastName} placeholder="" onChange={(e)=>setLastName(e.target.value)}/>
                        <div className="stuprof-cut"></div>
                        <label htmlFor="lastName" className="stuprof-placeholder">Last name</label>
                    </div>
                    <div className="stuprof-input-container stuprof-ic2">
                        <input id="password" className="stuprof-input" type="password" value={password} placeholder="" onChange={(e)=>setPassword(e.target.value)}/>
                        <div className="stuprof-cut"></div>
                        <label htmlFor="password" className="stuprof-placeholder">Password</label>
                    </div>
                    <div className="stuprof-input-container stuprof-ic2">
                        <input id="softwareResume" className="stuprof-input" type="file" placeholder="" onChange={(e)=>{selectResumeFile(e, "software");}}/>
                        <div className="stuprof-cut"></div>
                        <label htmlFor="softwareResume" className="stuprof-placeholder">Software Resume</label>
                        {(softwareResumeFile!=null)?<button type="button" className="stuprof-viewresume" onClick={(e)=>{downloadPdf("software");}}>view resume</button>:<p>No resume uploaded</p>}
                    </div>
                    <div className="stuprof-input-container stuprof-ic2">
                        <input id="datascienceResume" className="stuprof-input" type="file" placeholder="" onChange={(e)=>{selectResumeFile(e, "datascience");}}/>
                        <div className="stuprof-cut"></div>
                        <label htmlFor="datascienceResume" className="stuprof-placeholder">Datascience Resume</label>
                        {(datascienceResumeFile!=null)?<button type="button" className="stuprof-viewresume" onClick={(e)=>{downloadPdf("datascience");}}>view resume</button>:<p>No resume uploaded</p>}
                    </div>
                    <div className="stuprof-input-container stuprof-ic2">
                        <input id="eceResume" className="stuprof-input" type="file" placeholder="" onChange={(e)=>{selectResumeFile(e, "ece");}}/>
                        <div className="stuprof-cut"></div>
                        <label htmlFor="eceResume" className="stuprof-placeholder">Ece Resume</label>
                        {(eceResumeFile!=null)?<button type="button" className="stuprof-viewResume" onClick={(e)=>{downloadPdf("ece");}}>view resume</button>:<p>No resume uploaded</p>}
                    </div>
                    <button type="text" className="stuprof-submit">update</button>
                </div>
            </form> 
        </div>
    );
  };

  export default StudentProfile;
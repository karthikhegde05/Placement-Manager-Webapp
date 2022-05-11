import React from "react";
import { useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../Context/AuthContext";
import Axios from "axios";
import axios from '../Api/axios';
import '../stylesheets/StudentCardLayout.css';


  const StudentHome = () => {

    const {auth, setAuth} = useContext(AuthContext);
    const navigate = useNavigate();

    const [companyDrives, setCompanyDrives] = useState([]);
    const [nullCompany, setNullCompany] = useState(true);
    const [colorChange, setColorChange] = useState(false);

    const [sidebarActive, setSidebarActive] = useState(false);

    const logOut = () =>{
        localStorage.removeItem("loggedIn");
        localStorage.removeItem("userId");
        localStorage.removeItem("objId");
        localStorage.removeItem("role");
        localStorage.removeItem("companyIds");

        setAuth({loggedIn:false, userId:"", objId:"", role:"", companyIds:""});
        navigate("/login");
    };

    const redirectToStudentProfile = () => {
        console.log("redirect to student profile");
        navigate("/student/profile");
    };

    useEffect(() => {
        let source = Axios.CancelToken.source();

        const getCompanyDrives = async() =>{
            let result = await axios.get("/student-company-drives/" + localStorage.getItem("objId"), {
                cancelToken: source.token,
            }).then((response)=>{  
                if(response.data.nullObj==false){
                    setCompanyDrives(response.data.companies);
                    setNullCompany(false);
                    console.log(response.data.companies);
                    console.log("fetched");
                }
            })
            .catch((err)=>{
                if(Axios.isCancel(err))
                    console.log("successfully aborted");
                 console.log(err);
            })
        };

        getCompanyDrives();

        return()=>{
            console.log("unmounting");
            source.cancel();
        };

    }, [colorChange]);

    const applyCompany = async (company) => {
        const result = await axios.post("/student-apply-drive/", {
                        "companyId": company.companyId,
                        "studentId": localStorage.getItem("objId")
                        })
                        .then((response)=>{
                            if(response.data.ack==true){
                                console.log("successfully applied");
                                setColorChange(!colorChange);
                            }
                            else console.log("server side error in applying for a drive");
                        })
                        .catch((err)=>{console.log(err);});

    };


    return (


        <div classname="stu-sidebarcomp-layout">
                <div className={(sidebarActive)?"stu-sidebarcomp-body":"stu-sidebarcomp-inactive-body"}>
                    <ul className="stu-sidebarcomp-ul">
                        <li className="stu-sidebarcomp-li" onClick={redirectToStudentProfile}>
                            profile page
                        </li>
                        <li className="stu-sidebarcomp-li" onClick={logOut}>
                            log out
                        </li>
                    </ul>
                </div>

                <div className={(sidebarActive)?"stu-cardcomp-body":"stu-cardcomp-full-body"}>
                    <div className="stu-navbarcomp-body">
                        <button className="stu-navbarcomp-menu" onClick={(e)=>{
                            setSidebarActive(!sidebarActive);
                        }}>menu</button>
                    </div>
                    <div className="stu-cardcomp-albums">
                        {
                            companyDrives.map((company, index)=>{
                                if(nullCompany==true){
                                    return <div key={index} className="stu-cardcomp-album"></div>;
                                }
                                return (
                                    <div key={index} className="stu-cardcomp-album" onClick={(e)=>{navigate('/company/home', {state:company.company.companyId});}}>
                                        <img className="stu-cardcomp-album__artwork" src="/logo192.png" alt="comp-image"/>
                                        <div className="stu-cardcomp-album__details">
                                        <p className="stu-cardcomp-h2">{company.company.name}</p>
                                        <p className="stu-cardcomp-h3">{company.company.stream}</p>
                                        {(company.applied==true) && <button className="stu-cardcomp-btn stu-cardcomp-draw-applied-border">Applied</button>}
                                        {(company.applied==false) && <p className="stu-cardcomp-h3">Deadline to apply: {company.company.deadlineDate}</p>}
                                        {(company.applied==false) && <button className="stu-cardcomp-btn stu-cardcomp-draw-border" onClick={(e)=>{e.stopPropagation(); return applyCompany(company.company);}}>apply</button>}
                                        </div>
                                    </div>
                                    );
                                })
                        }
                    </div>

                </div>
            </div>
    );
  };

  export default StudentHome;
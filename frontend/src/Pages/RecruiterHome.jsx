import React from "react";
import { useContext, useEffect, useState } from "react";
import axios from "../Api/axios";
import { AuthContext } from "../Context/AuthContext";
import Axios from 'axios';
import { useNavigate } from "react-router-dom";
import ListDrivesComponent from "../components/ListDrivesComponent";
import '../stylesheets/RecruiterCardLayout.css';

  const RecruiterHome = () => {

        const [companyDrives, setCompanyDrives] = useState([]);
        const [nullCompany, setNullCompany] = useState(true);
        const {auth, setAuth} = useContext(AuthContext);

        const [sidebarActive, setSidebarActive] = useState(false);


        const navigate = useNavigate();

        const logOut = () =>{
            localStorage.removeItem("loggedIn");
            localStorage.removeItem("userId");
            localStorage.removeItem("objId");
            localStorage.removeItem("role");
            localStorage.removeItem("companyIds");

            setAuth({loggedIn:false, userId:"", objId:"", role:"", companyIds:""});
            navigate("/login");
        };
        
        useEffect(() => {
            let source = Axios.CancelToken.source();

            const getCompanyDrives = async() =>{
                let result = await axios.get("/recruiter-drives/" + localStorage.getItem("objId"), {
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

        }, []);


        return (
            <div classname="rec-sidebarcomp-layout">
                <div className={(sidebarActive)?"rec-sidebarcomp-body":"rec-sidebarcomp-inactive-body"}>
                    <ul className="rec-sidebarcomp-ul">
                        <li className="rec-sidebarcomp-li" onClick={(logOut)}>
                            log out
                        </li>
                    </ul>
                </div>

                <div className={(sidebarActive)?"rec-cardcomp-body":"rec-cardcomp-full-body"}>
                    <div className="rec-navbarcomp-body">
                        <button className="rec-navbarcomp-menu" onClick={(e)=>{
                            setSidebarActive(!sidebarActive);
                        }}>menu</button>
                    </div>
                    <div className="rec-cardcomp-albums">
                        {
                            companyDrives.map((company, index)=>{
                                if(nullCompany==true){
                                    return <div key={index} className="rec-cardcomp-album"></div>;
                                }
                                return (
                                    <div key={index} className="rec-cardcomp-album" onClick={(e)=>{navigate('/company/home', {state:company.companyId});}}>
                                        <img className="rec-cardcomp-album__artwork" src="/logo192.png" alt="comp-image"/>
                                        <div className="rec-cardcomp-album__details">
                                        <p className="rec-cardcomp-h2">{company.name}</p>
                                        <p className="rec-cardcomp-h3">{company.stream}</p>
                                        <p className="rec-cardcomp-h3">Deadline to apply: {company.deadlineDate}</p>
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

  export default RecruiterHome;
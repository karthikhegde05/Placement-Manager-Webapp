import React from "react";
import { useContext, useEffect, useState } from "react";
import axios from "../Api/axios";
import { AuthContext } from "../Context/AuthContext";
import Axios from 'axios';
import { useNavigate } from "react-router-dom";
import ListDrivesComponent from "../components/ListDrivesComponent";
import '../stylesheets/AdminCardLayout.css';

  const AdminHome = () => {

        const [companyDrives, setCompanyDrives] = useState([]);
        const [nullCompany, setNullCompany] = useState(true);
        const [delSomeDrives, setDelSomeDrives] = useState(false);
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

        const redirectToRegister = () => {
            console.log("must redirect to registration page");
            navigate("/register");
        };
        
        const redirectToDriveForm = () =>{
            console.log("must redirect to drive form");
            navigate("/admin/new-drive-form");
        };

        const deleteDrive = async (companyName, companyStream) => {
            let result = await axios.post("/delete-drive", {
                "companyName": companyName,
                "companyStream": companyStream
            }).then((response)=>{
                if(response.data.ack==true){
                    console.log("drive deleted");
                    setNullCompany(true);
                    setDelSomeDrives(!delSomeDrives);
                }
                else console.log("server side error in deleting - already deleted in the server dB");
            }).catch(err=>{console.log(err);});
        };

        
        useEffect(() => {
            let source = Axios.CancelToken.source();

            const getCompanyDrives = async() =>{
                let result = await axios.get("/drive-list/" + localStorage.getItem("objId"), {
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

        }, [delSomeDrives]);


        return (
            <div className="sidebar-layout">

                <div className={(sidebarActive)?"sidebarcomp-body":"sidebarcomp-inactive-body"}>
                    <ul className="sidebarcomp-ul">
                        <li className="sidebarcomp-li" onClick={(redirectToRegister)}>
                            create user
                        </li>
                        <li className="sidebarcomp-li" onClick={(redirectToDriveForm)}>
                            new drive
                        </li>
                        <li className="sidebarcomp-li" onClick={(logOut)}>
                            log out
                        </li>
                    </ul>
                </div>

                <div className={(sidebarActive)?"cardcomp-body":"cardcomp-full-body"}>
                    <div className="navbarcomp-body">
                        <button className="navbarcomp-menu" onClick={(e)=>{
                            setSidebarActive(!sidebarActive);
                        }}>menu</button>
                    </div>
                    <div className="cardcomp-albums">
                        {
                            companyDrives.map((company, index)=>{
                                if(nullCompany==true){
                                    return <div key={index} className="cardcomp-album"></div>;
                                }
                                return (
                                    <div key={index} className="cardcomp-album" onClick={(e)=>{navigate('/company/home', {state:company.companyId});}}>
                                        <img className="cardcomp-album__artwork" src="/logo192.png" alt="comp-image"/>
                                        <div className="cardcomp-album__details">
                                        <p className="cardcomp-h2">{company.name}</p>
                                        <p className="cardcomp-h3">{company.stream}</p>
                                        <p className="cardcomp-h3">Deadline to apply: {company.deadlineDate}</p>
                                        {/* <button className="cardcomp-btn cardcomp-draw-border" onClick={(e)=>{navigate('/company/home', {state:company.companyId});}}>more details</button> */}
                                        <button className="cardcomp-btn cardcomp-draw-border" onClick={(e)=>{e.stopPropagation(); return deleteDrive(company.name, company.stream);}}>delete drive</button>
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

  export default AdminHome;
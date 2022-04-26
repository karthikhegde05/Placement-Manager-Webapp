import React, { useState, useContext } from "react";
import axios from '../Api/axios';
import {AuthContext} from '../Context/AuthContext';
import '../stylesheets/Login.css';


const Login = () => {

    const {auth, setAuth} = useContext(AuthContext);

    const [userId, setUserId] = useState("");
    const [password, setPassword] = useState("");


    const authLogin = async (e) => {
        e.preventDefault();
        const result = await axios.post("login",
        {
            "userId": userId,
            "password": password
        }).then((response)=>{return authLoginSuccess(response);}).
        catch(function(error){console.log(error);})
    };

    const authLoginSuccess = (response) => {
        if(response.data.nullObj==false){
            setAuth({loggedIn:true, userId:response.data.userId, objId:response.data.objId, 
                role: response.data.role, companyIds:response.data.companyIds});
            localStorage.setItem("loggedIn", "true");
            localStorage.setItem("userId", response.data.userId);
            localStorage.setItem("objId", response.data.objId);
            localStorage.setItem("role", response.data.role);
            localStorage.setItem("companyIds", response.data.companyIds);
            console.log("logged In");
        }
        else console.log("Incorrect credentials");
    };

    return (
        <div className="login-body">
            <form onSubmit={authLogin}>
                <div className="login-form">
                    <div className="login-title">Welcome!!</div>
                    <div className="login-subtitle">Login</div>
                    <div className="login-input-container login-ic1">
                        <input id="User ID" className="login-input" type="text" placeholder="" onChange={(e)=>setUserId(e.target.value)}/>
                        <div className="login-cut"></div>
                        <label htmlFor="User ID" className="login-placeholder">User ID</label>
                    </div>
                    <div className="login-input-container login-ic2">
                        <input id="Password" className="login-input" type="password" placeholder="" onChange={(e)=>setPassword(e.target.value)}/>
                        <div className="login-cut"></div>
                        <label htmlFor="Password" className="login-placeholder">Password</label>
                    </div>
                    <button type="text" className="login-submit">login</button>
                </div>
            </form> 
         </div>
    );
};

  export default Login;
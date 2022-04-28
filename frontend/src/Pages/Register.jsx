import React, {useState} from "react";
import { useNavigate } from "react-router-dom";
import axios from '../Api/axios';
import '../stylesheets/Register.css';

  const Register = () => {

    const navigate = useNavigate();

    const [userId, setUserId] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [role, setRole] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [contactNumber, setContactNumber] = useState("");

    const sndRegister = async(e) =>{
        e.preventDefault();

        const result = await axios.post("/register", {
            "userId": userId,
            "email": email,
            "password": password,
            "role": role,
            "firstName": firstName,
            "lastName": lastName,
            "contactNumber": contactNumber
        }).then((response)=>{return rcvRegisterProcess(response);})
        .catch((error)=>{console.log("error while registering");});
    };

    const rcvRegisterProcess = (response) => {
        if(response.data.regComplete==true){
            console.log("registered");
            navigate("/admin/home");
        }
        else {
            if(response.data.alreadyTaken == true){
                console.log("userId / password already taken");
            }
            console.log("registration unsuccessful");
        }
    };

    return (
        <div className="register-body">
            <form onSubmit={sndRegister}>
                <div className="register-form">
                    <div className="register-title">Welcome!!</div>
                    <div className="register-subtitle">Register</div>
                    <div className="register-input-container register-ic1">
                        <input id="User ID" className="register-input" type="text" placeholder="" onChange={(e)=>setUserId(e.target.value)}/>
                        <div className="register-cut"></div>
                        <label htmlFor="User ID" className="register-placeholder">User ID</label>
                    </div>
                    <div className="register-input-container register-ic2">
                        <input id="Email" className="register-input" type="email" placeholder="" onChange={(e)=>setEmail(e.target.value)}/>
                        <div className="register-cut"></div>
                        <label htmlFor="Email" className="register-placeholder">Email ID</label>
                    </div>
                    <div className="register-input-container register-ic2">
                        <input id="Password" className="register-input" type="password" placeholder="" onChange={(e)=>setPassword(e.target.value)}/>
                        <div className="register-cut"></div>
                        <label htmlFor="Password" className="register-placeholder">Password</label>
                    </div>
                    <div className="register-input-container register-ic2">
                        <select id="Role" className="register-input" placeholder="" onChange={(e)=>setRole(e.target.value)}>
                            <option value="admin">admin</option>
                            <option value="student">student</option>
                            <option value="recruiter">recruiter</option>
                        </select>
                        <div className="register-cut"></div>
                        <label htmlFor="Role" className="register-placeholder">Role</label>
                    </div>
                    <div className="register-input-container register-ic2">
                        <input id="firstName" className="register-input" type="text" placeholder="" onChange={(e)=>setFirstName(e.target.value)}/>
                        <div className="register-cut"></div>
                        <label htmlFor="firstName" className="register-placeholder">First Name</label>
                    </div>
                    <div className="register-input-container register-ic2">
                        <input id="lastName" className="register-input" type="text" placeholder="" onChange={(e)=>setLastName(e.target.value)}/>
                        <div className="register-cut"></div>
                        <label htmlFor="lastName" className="register-placeholder">Last Name</label>
                    </div>
                    <div className="register-input-container register-ic2">
                        <input id="contactNumber" className="register-input" type="text" placeholder="" onChange={(e)=>setContactNumber(e.target.value)}/>
                        <div className="register-cut"></div>
                        <label htmlFor="contactNumber" className="register-placeholder">Contact Number</label>
                    </div>
                    <button type="text" className="register-submit">register</button>
                </div>
            </form> 
        </div>
    );
  };

  export default Register;
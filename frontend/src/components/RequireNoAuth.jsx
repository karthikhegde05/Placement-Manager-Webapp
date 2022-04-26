import {AuthContext} from '../Context/AuthContext';
import {useContext} from 'react';
import { Outlet, Navigate } from 'react-router';

const RequireNoAuth = () =>{
    const {auth, setAuth} = useContext(AuthContext);

    let loggedIn = localStorage.getItem("loggedIn");
    if(loggedIn=="true")loggedIn=true;
    loggedIn = loggedIn | auth.loggedIn;
    
    if(loggedIn==false){
        return(
            <Outlet />
        );
    }

    let role = localStorage.getItem("role");
    
    if(role=="admin")
        return <Navigate to="/admin/home" />
    else if(role=="student")
        return <Navigate to="/student/home" />
    else if(role=="recruiter")
        return <Navigate to="/recruiter/home" />

    return <Outlet />
};

export default RequireNoAuth;
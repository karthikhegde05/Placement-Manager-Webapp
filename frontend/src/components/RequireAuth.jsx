import {AuthContext} from '../Context/AuthContext';
import {useContext} from 'react';
import { Outlet, Navigate } from 'react-router';

const RequireAuth = ({allowedRoles}) =>{
    const {auth, setAuth} = useContext(AuthContext);

    let loggedIn = localStorage.getItem("loggedIn");
    if(loggedIn=="true")loggedIn=true;
    loggedIn = loggedIn | auth.loggedIn;
    
    if(loggedIn==false){
        return(
            <Navigate to="/login" />
        );
    }

    

    let role = localStorage.getItem("role");
    if(allowedRoles.includes(role)){
        return <Outlet />;
    }
        
    return (
        <Navigate to="/login" />
    );

};

export default RequireAuth;
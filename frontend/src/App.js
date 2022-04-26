import './App.css';

import { Routes, Route } from 'react-router-dom';
import {useState} from 'react';

import Login from './Pages/Login';
import AdminHome from './Pages/AdminHome';
import RecruiterHome from './Pages/RecruiterHome';
import Register from './Pages/Register';
import CompanyHome from './Pages/CompanyHome';
import StudentHome from './Pages/StudentHome';
import StudentProfile from './Pages/StudentProfile';
import NewDriveForm from './Pages/NewDriveForm';
import CompUpdateDetails from './Pages/CompUpdateDetails';
import {AuthContext} from './Context/AuthContext';
import RequireAuth from './components/RequireAuth';
import RequireNoAuth from './components/RequireNoAuth';

function App() {
  const [auth, setAuth] = useState({loggedIn:false, userId:"", objId:"", role:"", companyIds:""});

  return (

    <AuthContext.Provider value = {{auth, setAuth}}>
      <div className="App">
        <Routes>
          <Route element={<RequireNoAuth />} >
            <Route path="/" element={<Login />} />
            <Route path="/login" element={<Login />}/>
          </Route>
          
          <Route element={<RequireAuth allowedRoles={["admin"]}/>} >
            <Route path="/register" element={<Register />} />
            <Route path="/admin/home" element={<AdminHome /> }/>
            <Route path="/admin/new-drive-form" element={<NewDriveForm />} />
          </Route>
          <Route element={<RequireAuth allowedRoles={["admin", "recruiter", "student"]}/>}>
            <Route path="/company/home" element={<CompanyHome />} />
          </Route>

          <Route element={<RequireAuth allowedRoles={["recruiter"]}/>}>
            <Route path="/recruiter/home" element={<RecruiterHome />}/>
          </Route>

          <Route element={<RequireAuth allowedRoles={["recruiter", "admin"]} />}>
            <Route path="/company/update-details" element={<CompUpdateDetails />} />
          </Route>

          <Route element={<RequireAuth allowedRoles={["student"]} />} >
            <Route path="/student/home" element={<StudentHome />} />
            <Route path="/student/profile" element={<StudentProfile />} />
          </Route>
        </Routes>
      </div>
    </AuthContext.Provider>
  );
}

export default App;

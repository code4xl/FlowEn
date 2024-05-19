import React from 'react';
import { Routes, Route, Link } from "react-router-dom";
import { Dashboard, Home, Login, Register, VerifyEmail, Navbar, ErrorPage, InitiateWf } from './Components';
import { useSelector } from 'react-redux';
import { loginState } from './App/Slice/UserSlice';
import CreateWorkflow from './Components/Utils/CreateWorkflow';

const RoutesConfig = () => {
    const loggedIn = useSelector(loginState);
  return (
    <>
        <Routes>
            <Route path="/" element={<Home/>}/>
            <Route path="/register" element={<Register/>}/>
            <Route path="/login" element={<Login/>}/>
            <Route path="/verifyEmail" element={<VerifyEmail/>}/>
            {
              loggedIn && (
                <>
                  <Route path="/dashboard" element={[<Navbar/>,<Dashboard/>]}/>
                  <Route path="/createWorkflow" element={[<Navbar/>,<CreateWorkflow/>]}/>
                  <Route path="/initiateWorkflow" element={[<Navbar/>,<InitiateWf/>]}/>
                </>
              )
            }
            <Route path="*" element={<ErrorPage/>}/>
        </Routes>
    </>
  )
}

export default RoutesConfig
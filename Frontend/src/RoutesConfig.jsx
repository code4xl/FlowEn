import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { HeroPage, Login, VerifyEmail } from './Components';
import { dashboardMenuState } from './App/DashboardSlice';
import { isUserLoggedIn } from './App/DashboardSlice';

import NavBar from './Components/protected/Dashboard/NavBar';
import Sidebar from './Components/utils/Sidebar';
import Dashboard from './Components/protected/Dashboard/Dashboard';
import Builder from './Components/protected/Builder/Builder';
import ExecuteWorkflow from './Components/protected/ExecuteWF/ExecuteWorkflow';
import ViewWorkflow from './Components/protected/ViewWF/ViewWorkflow';

const RoutesConfig = () => {
  const isLoggedIn = useSelector(isUserLoggedIn);
  const ifDMenuState = useSelector(dashboardMenuState);
  if (!isLoggedIn) {
    return (
      <Routes>
        <Route
          path="/"
          key={'home'}
          className="transition-all scrollbar-hide"
          element={[<HeroPage key={'HeroPage'} />]}
        />
        <Route
          path="/login"
          className="transition-all scrollbar-hide"
          element={[<Login />]}
        />
        <Route
          path="/verify-email"
          className="transition-all scrollbar-hide"
          element={[<VerifyEmail />]}
        />
      </Routes>
    );
  } else {
    return (
      <div
        className={`w-full h-[100vh] bg-[var(--bg-primary)] flex flex-col overflow-y-auto scrollbar-hide`}
      >
        <Sidebar isOpen={ifDMenuState} />
        <NavBar />
        <div className={`${ifDMenuState && 'pl-[4rem]'} `}>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/create" element={<Builder />} />
            <Route path="/execute" element={<ExecuteWorkflow />} />
            <Route path="/view" element={<ViewWorkflow />} />
          </Routes>
        </div>
      </div>
    );
  }
};

export default RoutesConfig;

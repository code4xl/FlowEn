import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { HeroPage, Login, VerifyEmail } from './components';
import { dashboardMenuState } from './app/DashboardSlice';
import { isUserLoggedIn } from './app/DashboardSlice';

import NavBar from './components/protected/Dashboard/NavBar';
import Sidebar from './components/utils/Sidebar';
import Dashboard from './components/protected/Dashboard/Dashboard';
import Builder from './components/protected/Builder/Builder';
import ExecuteWorkflow from './components/protected/ExecuteWF/ExecuteWorkflow';
import ViewWorkflow from './components/protected/ViewWF/ViewWorkflow';

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

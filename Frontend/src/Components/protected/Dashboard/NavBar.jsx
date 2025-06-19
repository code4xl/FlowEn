import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  setCloseDMenu,
  LogOut,
  dashboardMenuState,
  selectAccount,
  setTheme,
  selectTheme,
} from '../../../app/DashboardSlice';
import logo from "../../../assets/Flowen_B.png"

import { useNavigate } from 'react-router-dom';
import { ArrowRight, CircleUserRound, LogOutIcon, Menu, Moon, Sun } from 'lucide-react';

function NavBar() {
  const ifDMenuState = useSelector(dashboardMenuState);
  const user = useSelector(selectAccount);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const theme = useSelector(selectTheme);

  const onMenuToggle = () => {
    console.log(user);
    dispatch(
      setCloseDMenu({
        dashboardMenuState: !ifDMenuState,
      }),
    );
  };

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    dispatch(setTheme({ theme: newTheme }));
    document.documentElement.setAttribute('data-theme', newTheme);
  };

  const logout = () => {
    dispatch(LogOut());
    navigate('/');
  };

  return (
    <div className="flex w-full sticky top-0 z-40 bg-[#1A2F23] drop-shadow-xl h-[4rem]">
      <div className="flex w-full px-[1rem] justify-between items-center">
        <div className={`flex items-center ${ifDMenuState ? 'pl-[3rem]' : ''}`}>
          <Menu
            className="w-10 h-8 text-logo-blue cursor-pointer"
            onClick={onMenuToggle}
          />
          <img className="w-[8rem]" src={logo} alt="logo_B" />
        </div>
        <div className="flex items-center"></div>
        <div className="flex items-center gap-3">
          <div className="flex items-center px-2 py-2 shadow-xl rounded-2xl border-yellow border-[.1rem]">
            <CircleUserRound className="w-[2rem] rounded-full text-logo-blue" />
            <div className="flex flex-col items-start justify-center px-1">
              <h1 className="text-sm font-bold text-avocado hidden sm:flex">
                {user.uname}
              </h1>
              <h1 className="text-sm font-bold text-yellow hidden sm:flex">
                User
              </h1>
            </div>
          </div>
            <div
            className="flex items-center justify-center p-1 cursor-pointer"
            onClick={toggleTheme}
          >
            {theme === 'light' ? (
              <Moon className="w-[2.5rem] text-[var(--accent-color)] rounded-xl" />
            ) : (
              <Sun className="w-[2.5rem] text-[var(--accent-color)] rounded-xl" />
            )}
          </div>
          <div
            className="flex items-center justify-center p-1 cursor-pointer gap-4"
            onClick={logout}
          >
            <LogOutIcon className="w-[3rem] text-logo-blue rounded-xl" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default NavBar;

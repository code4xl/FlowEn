import React from "react";

import logo from "../../assets/Flowen_B.png";
import avatar from  "../../assets/profileicon.png";
import { Bars4Icon } from "@heroicons/react/24/solid"
import { useDispatch, useSelector } from "react-redux";
import { getAccountData, logOutUser } from "../../App/Slice/UserSlice";
import { useNavigate } from "react-router-dom";
// import { clearWishListReceipes, getWishListReceipeCount } from "../../App/Slice/ReceipeSlice";

const Navbar = () => {
    const account = useSelector(getAccountData);
    // const receipeCount = useSelector(getWishListReceipeCount);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const logout = () => {
        console.log("you hit the log out button...!");
        dispatch(logOutUser());
        navigate("/");
    }
  return (
    <>
      <div className="flex w-full sticky top-0 z-50 bg-[#ffffff] drop-shadow-xl h-[70px] bg-gradient-to-br from-yellow-200 to-yellow-100">
        <div className="flex w-full px-[1rem] justify-between items-center ">
          <div>
            <img
              className=" w-[4rem] sm:w-[7rem] m-2 lg:ml-6"
              src={logo}
              alt="logo"
              onClick={() => navigate("/dashboard")}
            />
          </div>
          <div className="flex flex-row w-[40%] place-content-end items-center text-black ">
            <div className="flex flex-row mx-[.6rem]" onClick={()=>{navigate("/wishlist")}}>
              <div className="flex items-center w-full border shadow-xl rounded-2xl bg-green-500 hover:bg-green-400 text-white">
                <p className="py-2 px-5 tex-sm font-bold cursor-pointer">Wish List</p>
              </div>
            </div>
            <div className="flex flex-row mx-[.6rem]">
              <div className="flex items-center w-full border shadow-xl rounded-2xl bg-orange-500 text-white hover:bg-orange-400">
                <p className="py-2 px-5 tex-sm font-bold cursor-pointer">Upload</p>
              </div>
            </div>
            <div className="flex flex-row w-auto mx-[.6rem]  cursor-pointer">
              <div className="flex items-center w-auto border shadow-xl rounded-2xl ">
                <img
                  className="w-[2rem] m-1 rounded-full"
                //   src={acc.avatar ? acc.avatar : profile}
                  src={avatar}
                  alt="profile"
                />
                <h1 className="text-sm font-bold text-black p-2 hidden sm:flex cursor-pointer">
                  {account?.uname}{" "}
                </h1>
              </div>
            </div>
            {/* <Bars4Icon
              className="w-10 h-8"
            /> */}
            <div className="flex flex-row cursor-pointer" onClick={logout}>
              <div className="flex items-center py-2 px-2 w-full border shadow-xl rounded-2xl">
                <svg fill="#22C55E" height="19px" width="19px" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" viewBox="-23.1 -23.1 431.17 431.17" xmlSpace="preserve" stroke="#22C55E" strokeWidth="23.483231"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round" stroke="#CCCCCC" strokeWidth="1.539884"></g><g id="SVGRepo_iconCarrier"> <g> <g id="Sign_Out"> <path d="M180.455,360.91H24.061V24.061h156.394c6.641,0,12.03-5.39,12.03-12.03s-5.39-12.03-12.03-12.03H12.03 C5.39,0.001,0,5.39,0,12.031V372.94c0,6.641,5.39,12.03,12.03,12.03h168.424c6.641,0,12.03-5.39,12.03-12.03 C192.485,366.299,187.095,360.91,180.455,360.91z"></path> <path d="M381.481,184.088l-83.009-84.2c-4.704-4.752-12.319-4.74-17.011,0c-4.704,4.74-4.704,12.439,0,17.179l62.558,63.46H96.279 c-6.641,0-12.03,5.438-12.03,12.151c0,6.713,5.39,12.151,12.03,12.151h247.74l-62.558,63.46c-4.704,4.752-4.704,12.439,0,17.179 c4.704,4.752,12.319,4.752,17.011,0l82.997-84.2C386.113,196.588,386.161,188.756,381.481,184.088z"></path> </g> <g> </g> <g> </g> <g> </g> <g> </g> <g> </g> <g> </g> </g> </g></svg>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;

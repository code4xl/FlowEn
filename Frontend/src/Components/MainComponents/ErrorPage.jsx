import React from 'react'
import errImg from "../../assets/page-404.png";
import { useNavigate } from 'react-router-dom';

const ErrorPage = () => {
  const navigate = useNavigate();
  return (
    <>
        <div className="w-full h-[97vh] bg-[#ececec] px-5 pt-5">
            <div className="flex flex-row w-full items-center justify-between bg-white px-[10rem] py-5">
              <img src={errImg} alt="err_img" />
              <div className="flex flex-col items-center justify-center p-5 gap-4">
                <h1 className="text-2xl font-raleway text-center font-bold">Oops...! the page you're looking for <br /> cannot be reached</h1>
                <button onClick={() => {navigate("/")}} className="bg-[#F7CBBC] hover:scale-110 hover:text-[#ffffff] hover:bg-[#fe7439] transition-all duration-300 font-raleway font-bold text-[#fe7439]">
                  Return Home
                </button>
              </div>
            </div>

        </div>
    </>
  )
}

export default ErrorPage
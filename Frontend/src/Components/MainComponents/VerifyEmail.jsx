import React, { useState } from 'react'
import { Link } from "react-router-dom";
import OtpInput from "react-otp-input";
import { BiArrowBack } from "react-icons/bi";
import { RxCountdownTimer } from "react-icons/rx";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getAccountData } from '../../App/Slice/UserSlice.js';
import { authEmail } from '../../Services/Repository/UserRepo.js';

const VerifyEmail = () => {
    let [otp, setOtp] = useState("");
    const acc = useSelector(getAccountData);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const handleVerifyAndSignup = (e) => {
        e.preventDefault();
        dispatch(authEmail(acc.id, otp, acc.token, navigate));
      };
  return (
    <>
        <div className="flex flex-col items-center justify-center w-full h-[97vh] px-[5rem]">
            <div className="flex flex-col gap-5 px-[5rem] py-[3rem] rounded-[2rem] shadow-xl bg-[#ffded3] hover:animate-none animate-pulse">
            <h1 className="text-raleway font-semibold text-[1.875rem] leading-[2.375rem]">Verify Email</h1>
            <p className="text-[1.125rem] leading-[1.625rem] my-4 text-richblack-100">
                A verification code has been sent to you. Enter the code below
            </p>
            <form onSubmit={handleVerifyAndSignup}>
                <OtpInput
                value={otp}
                onChange={setOtp}
                numInputs={6}
                renderInput={(props) => (
                    <input
                    {...props}
                    placeholder="-"
                    style={{
                        boxShadow: "inset 0px -1px 0px rgba(255, 255, 255, 0.18)",
                    }}
                    className="w-[48px] lg:w-[60px] border-0 bg-richblack-800 rounded-[0.5rem] text-richblack-5 aspect-square text-center focus:border-0 focus:outline-2 focus:outline-yellow-50"
                    />
                )}
                containerStyle={{
                    justifyContent: "space-between",
                    gap: "0 6px",
                }}
                />
                <button
                type="submit"
                className="w-full bg-yellow-50 py-[12px] px-[12px] rounded-[8px] mt-6 font-medium text-richblack-900"
                >
                Verify Email
                </button>
            </form>
            <div className="mt-6 flex items-center justify-between">
                <Link to="/register">
                <p className="text-richblack-5 flex items-center gap-x-2">
                    <BiArrowBack /> Back To Signup
                </p>
                </Link>
                <button
                className="flex items-center text-blue-100 gap-x-2"
                //   onClick={() => dispatch(sendOtp(signupData.email))}
                >
                <RxCountdownTimer />
                Resend it
                </button>
            </div>
            </div>
        </div>
    </>
  )
}

export default VerifyEmail
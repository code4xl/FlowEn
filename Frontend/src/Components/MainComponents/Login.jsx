import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
// import homeImg from "../../assets/homeImg.jpg";
import { login } from '../../Services/Repository/UserRepo';

//red: #F92E53
// violet: #E62B9B
// purple: #A058D6
//blue: #0076EE
const Login = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    function submit(event){
        event.preventDefault();
        dispatch(login(email, password, navigate));
    }

    return (
        <div className="h-screen w-screen relative">
            {/* Background image with blur */}
            {/* <div
                className="absolute inset-0 w-full h-full bg-cover bg-center"
                style={{
                    backgroundImage: `url(${homeImg})`,
                    filter: "blur(8px)", // Adjust the blur intensity as needed
                    zIndex: -1,
                }}
            ></div> */}

            {/* Login card */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-md p-6 bg-white bg-opacity-90 shadow-lg rounded-lg">
                <h2 className="text-2xl font-bold mb-4 text-[#F92E53] text-[30px] ">Sign In to your account!</h2>
                <form onSubmit={submit} className="space-y-4">
                    <input
                        type="email"
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder='Email'
                        className="w-full p-2 border border-gray-700 rounded-lg focus:outline-none focus:border-[#0076EE] text-gray-700 bg-transparent"
                    />
                    <input
                        type="password"
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder='Password'
                        className="w-full p-2 mb-4 border border-gray-700 rounded-lg focus:outline-none focus:border-[#0076EE] text-gray-700 bg-transparent"
                    />

                    <button
                        type="submit"
                        className="w-full bg-[#F92E53] text-white py-2 rounded hover:bg-[#E62B9B] focus:outline-none focus:bg-green-600 mt-4"
                    >
                        Login
                    </button>
                </form>
                
                <p className="text-sm mt-4 text-gray-700 cursor-pointer text-[15px]">Not a member, <span className='text-[#0076EE] text-[15px] cursor-pointer' onClick={() => {navigate("/register")}} >Register</span></p>
            </div>
        </div>
    )
}

export default Login;

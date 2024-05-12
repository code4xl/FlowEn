import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { register } from '../../Services/Repository/UserRepo';
// import homeImg from "../../assets/";

const Register = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [username, setUsername] = useState("");

    function submit(event){
        event.preventDefault();
        dispatch(register(email, password, username, navigate));
    }

    return (
        <div className="h-screen flex">
            {/* Background image with blur */}
            {/* <div
                className="absolute inset-0 w-full h-full bg-cover bg-center"
                style={{
                    // backgroundImage: `url(${homeImg})`,
                    filter: "blur(8px)", // Adjust the blur intensity as needed
                    zIndex: -1,
                }}
            ></div> */}

            {/* Registration form */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-md p-6 bg-white bg-opacity-90 shadow-lg rounded-lg">
                <h2 className="text-2xl font-bold mb-4 text-[#F92E53] text-[30px]">Register yourself here!</h2>
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
                    <input 
                        type="text" 
                        onChange={(e) => setUsername(e.target.value)} 
                        placeholder='Username'
                        className="w-full p-2 mb-4 border border-gray-700 rounded-lg focus:outline-none focus:border-[#0076EE] text-gray-700 bg-transparent"
                    />

                    <button 
                        type="submit" 
                        className="w-full bg-[#F92E53] text-white py-2 rounded hover:bg-[#E62B9B] focus:outline-none focus:bg-green-600 mt-4"
                    >
                        Register
                    </button>
                </form>
                {/* <button 
                    onClick={() => {navigate("/login")}} 
                    className="mt-4 w-full bg-gray-300 text-gray-700 py-2 rounded hover:bg-gray-400 focus:outline-none focus:bg-gray-400 mt-4"
                >
                    Login
                </button> */}
                <p className="text-sm mt-4 text-gray-700 text-[15px]">Already a member, <span className='text-[#0076EE] text-[15px] cursor-pointer' onClick={()=> {navigate("/login")}}>Sign In</span></p>
            </div>
        </div>
    );
}

export default Register;

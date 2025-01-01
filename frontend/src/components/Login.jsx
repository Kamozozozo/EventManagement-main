import React, { useState, useEffect } from 'react';
import unizulu from '../assets/unizulu.png';
import axios from "axios"
import { Navigate,Link } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
//import io from 'socket.io-client';
//import { json } from 'express';
import useLogin from './hooks/useLogin';

//const socket = io.connect('http://localhost:3000');

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const {login,loading}=useLogin()
    
  

    const handleUserName = (event) => {
        setEmail(event.target.value);
    };

    const handlePassword = (event) => {
        setPassword(event.target.value);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        await login(email,password)
    };
    return (
        <section className="bg-gray-50 dark:bg-gray-900 min-h-screen flex items-center justify-center">
    <div className="w-full max-w-sm bg-white rounded-lg shadow dark:border md:mt-0 xl:p-0 dark:bg-gray-800 dark:border-gray-700 flex flex-col items-center">
        <img className="w-32 h-32 mb-4" src={unizulu} alt="logo" /> {/* Adjusted image size for better visibility */}
        <h1 className="text-xl font-bold mb-4">EMS</h1> {/* Added a heading for better structure */}
        <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
            <form className="space-y-3 md:space-y-6" onSubmit={handleSubmit}>
                <div>
                    <input
                        type="text"
                        name="email"
                        id="email"
                        onChange={handleUserName}
                        className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        placeholder="username"
                        required
                    />
                </div>
                <div>
                    <input
                        type="password"
                        name="password"
                        id="password"
                        onChange={handlePassword}
                        placeholder="••••••••"
                        className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        required
                    />
                </div>
                <div className="flex items-center justify-between">
                    <div className="flex items-start"></div>
                </div>
                <button
                    type="submit"
                    className="w-full text-white bg-blue-500 hover:bg-blue-600 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                    disabled={loading}
                >
                    {!loading ? <>Login</> : <span className="inline-block w-12 h-12 border-4 border-t-transparent border-gray-500 rounded-full animate-spin"></span>}
                </button>
            </form>
            <Link to="/signup"><div>request to become Event Organizer</div></Link>
        </div>
    </div>
</section>

    );
};

export default Login;

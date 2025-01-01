import React, { useState, useEffect } from 'react';
import { Navigate, useNavigate } from "react-router-dom";
import Home from './components/sideBarComponents/Home';
import Sidebar from './components/BarComponents/Sidebar';
import './App.css';
import SearchBar from './components/BarComponents/SearchBar';
import PastEvents from "./components/sideBarComponents/PastEvents";
import NotifyMe from "./components/sideBarComponents/NotifyMe";
import Read from "./components/sideBarComponents/Read";
import ExternalEvents from "./components/sideBarComponents/ExternalEvents";
import Login from './components/Login';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useAuthContext } from './components/context/AuthContext';
import HomeApp from './HomeApp';
import toast, { Toaster } from 'react-hot-toast';
import AddOrganizer from './components/addOrganizer';
import Verification from './components/Verification';
export const URL=  import.meta.env.URL_BACKEND || 'http://10.11.136.187:3000';
console.log(URL)
console.log(import.meta.env.URL_BACKEND);
const App = () =>  { 

  const { authUser, setAuthUser } = useAuthContext();
  const navigate = useNavigate();
  let inactivityTimeout;

  useEffect(() => {
    // Check if the user is already logged in by checking localStorage
    const storedUser = localStorage.getItem('event-user');
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setAuthUser(parsedUser);
    }

    const resetInactivityTimeout = () => {
      clearTimeout(inactivityTimeout);
      inactivityTimeout = setTimeout(() => {
        localStorage.removeItem('event-user');
        setAuthUser(null);
        toast.error('Session expired due to inactivity. Please log in again.');
        navigate('/login');
      }, 50 * 60 * 1000); // 1 hour
    };

    // Add event listeners for user activity
    window.addEventListener('mousemove', resetInactivityTimeout);
    window.addEventListener('keydown', resetInactivityTimeout);
    window.addEventListener('click', resetInactivityTimeout);

    // Cleanup event listeners on component unmount
    return () => {
      clearTimeout(inactivityTimeout);
      window.removeEventListener('mousemove', resetInactivityTimeout);
      window.removeEventListener('keydown', resetInactivityTimeout);
      window.removeEventListener('click', resetInactivityTimeout);
    };
  }, [setAuthUser, navigate]);

  return (
    <div>
      <Routes>
        {/* Public Route */}
        
        <Route path="/*" element={authUser ? <HomeApp/> : <Navigate to={"/login"} />} />
        <Route path="/login" element={authUser ? <Navigate to='/' /> : <Login />} />
        <Route path="/signup" element={ <AddOrganizer/>} />
        <Route path="/verify-email/:id" element={<Verification/>}/>
      
      </Routes>
      <Toaster />
    </div>
  );
};

export default App;

import React, { useState } from 'react';
import toast, { Toaster } from "react-hot-toast";
import { useAuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { URL } from '../../App';

const useLogin = () => {
    const { setAuthUser } = useAuthContext();
    const [loading, setLoading] = useState("");
    const navigate = useNavigate();

    const login = async (email, password) => {
        setLoading(true);
        try {
            const response = await fetch(`${URL}/api/auth/login`, {
                method: 'POST',
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
                credentials: "include"
            });
            const data = await response.json();

            if (data.error) {
                throw new Error(data.error);
            }

            // Set user data and token expiration time in localStorage
            const expirationTime = Date.now() + 50 * 60 * 1000;
            localStorage.setItem("event-user", JSON.stringify({ ...data, expirationTime }));

            setAuthUser(data);
            toast.success("Logged in successfully");

            // Navigate based on the user's role
            if (data.role === "Admin") {
                toast.success("Logged in as admin");
                navigate("/");
            } else if (data.role === "Student") {
                navigate("/");
            } else if (data.role === "Organizer") {
                navigate("/");
            }
        } catch (error) {
            toast.error(error.message);
            setTimeout(() => {
                window.location.reload();
            }, 800);
        } finally {
            setLoading(false); // Ensure loading is reset
        }
    };

    return { login, loading };
};

export default useLogin;

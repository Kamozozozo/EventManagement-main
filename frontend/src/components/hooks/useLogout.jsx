import React, { useState } from 'react'
import toast,{Toaster} from "react-hot-toast"
import { AuthContext, useAuthContext } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';
import { URL } from '../../App';

const useLogout = () => {
    const {setAuthUser}=useAuthContext()
    const [loading,setLoading]=useState(false)
    const logout= async()=>{
        const confirmed= window.confirm("are you sure you want to logout")
        if(confirmed){
            try {
                const response = await fetch(`${URL}/api/auth/logout`, {
                    method: 'POST',
                    headers: { "Content-Type": "application/json" },
                });
                const data = await response.json();
                console.log(data);
                if(data.error){
                    throw new Error(data.error);
                }
                else{
                    localStorage.removeItem("event-user")
                    setAuthUser(null)
                    toast.success("succesfully logged out")
                }
                
            }
            catch(error){
                toast.error(error.message)
        
            }finally{
                setLoading(false)
            }
        
        }
        else {
            toast.error("cancelled")
        }
          
        }
       
    return {logout,loading}
}

export default useLogout
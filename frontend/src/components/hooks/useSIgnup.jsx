
import toast,{Toaster} from "react-hot-toast"
import React from 'react'
import { useNavigate } from 'react-router-dom';
import { URL } from "../../App";

const useSIgnup = () => {
    const navigate=useNavigate()
    const addOrganizers= async(name,email,password,confirmPassword,motivation,role)=>{
        try {
            const response = await fetch(`${URL}/api/auth/signup`, {
                method: 'POST',
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({name,email,password,confirmPassword,motivation,role})
            });
            const data = await response.json();
            console.log(data);
            if(response.ok){
                toast.success(data.message)
                navigate('/login')
            }else{
                toast.error(data.message)
                
            }
        
        }
        catch(error){
            toast.error("failed to request")

        }
    
    }
    return {addOrganizers}

}

export default useSIgnup



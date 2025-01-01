
import toast,{Toaster} from "react-hot-toast"
import React from 'react'
import { useNavigate } from 'react-router-dom';
import { URL } from "../../App";
const useAddStudent = () => {
    const navigate=useNavigate()
    const addStudent= async( name , surname, password, role,faculty,StudyLevel,StudentNumber )=>{
        try {
            const response = await fetch(`${URL}/api/auth/signupSTudents`, {
                method: 'POST',
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name , surname, password, role,faculty,StudyLevel,StudentNumber })
            });
            const data = await response.json();
            console.log(data);
            if(response.ok){
                toast.success(data.message)
                navigate('/manageStudent')
            }else{
                toast.error(data.message)
                
            }
        
        }
        catch(error){
            toast.error("failed to request")

        }
    
    }
    return {addStudent}

}

export default useAddStudent



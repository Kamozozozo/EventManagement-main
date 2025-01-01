import React from 'react'
import useLogout from '../hooks/useLogout.jsx'
import { IoMdLogOut } from "react-icons/io";

const LogoutButton = () => {
 
    const {logout,loading} =useLogout();
  return (
    <div className="menu-item">
    {!loading?(
      
      <button  className=' border-gray-500 border-4' onClick={logout}>
        <div className='icons'>
        <IoMdLogOut className="size-7" />
        <span className="tooltip">logout</span>

        </div>
        </button>
    ): (
      <span className="inline-block w-12 h-12 border-4 border-t-transparent border-gray-500 rounded-full animate-spin"></span>
    )}
    </div>

  )
}

export default LogoutButton
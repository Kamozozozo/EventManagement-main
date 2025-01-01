import React, { useEffect, useState } from 'react'
import {useNavigate, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import { URL } from '../../App';

const ManageOrganizer = () => {
  const [organizer,setOrganizer]=useState([])
  const navigate=useNavigate()

  const  redirectToAdd=()=>{
    navigate('/addOrganizer')

  }
  async function deleteOrganizer (id){
    const response = await fetch(`${URL}/api/ManageOrganizer/Organizer/${id}`,
      {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials:"include"
      }
    )
        const data = await response.json();
        if (response.ok) {
          toast.success(data.message)
          window.location.reload()
            
          navigate("/manageOrganizers")
        }
  }
   async function getOrganizers(){
    const response = await fetch(`${URL}/api/ManageOrganizer/Organizer`,
      
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          },
          credentials:"include"
        }
    );
    const data = await response.json();
    console.log(data)
    if(response.ok){
      setOrganizer(data)
    }
    else{
      toast(data.message)
    }
   }
   useEffect(()=>{
    getOrganizers()


   },[])
  return (
  
<div className="flex flex-col items-center pt-5 gap-4 w-full">
  <div className="flex justify-center w-full">
    <button className="bg-blue-400 p-2 rounded-md" onClick={redirectToAdd}>
      ADD Organizer
    </button>
  </div>
  {organizer.map((data) => (
    <div 
      className="flex flex-row justify-between items-center w-full max-w-xl h-auto bg-white shadow-md rounded-lg p-4"
      to={`/event/${data._id}`} 
      key={data._id}
    >
      <h2 className="text-gray-700 hidden sm:block">{data._id}</h2> {/* Hidden on small screens */}
      <div className="flex flex-col">
        <h1 className="text-gray-800 font-semibold text-lg">{data.name}</h1>
        <h2 className="text-gray-600 text-sm">{data.email}</h2>
      </div>
      <div className="flex flex-col">
        <button 
          onClick={() => deleteOrganizer(data._id)} 
          className="bg-red-400 p-2 rounded-md"
        >
          Delete
        </button>
      </div>
    </div>
  ))}
</div>



  )
}

export default ManageOrganizer
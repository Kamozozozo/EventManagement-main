import React, { useEffect, useState } from 'react'
import {useNavigate, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import { URL } from '../../App';

const AdminDecide = () => {
  const [organizer,setOrganizer]=useState([])
  const [expandedOrganizer, setExpandedOrganizer] = useState(null); 
  const navigate=useNavigate()
  const  redirectToAdd=()=>{
    navigate('/addOrganizer')

  }
  async function AcceptOrganizer (id){
    const response = await fetch(`${URL}/api/ManageOrganizer/AcceptOrganizer/${id}`,
      {
        method: 'PUT',
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
  async function RejectOrganizer (id){
    const response = await fetch(`${URL}/api/ManageOrganizer/RejectOrganizer/${id}`,
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

   async function getRequestOrganizers(){
    const response = await fetch(`${URL}/api/ManageOrganizer/GetOrganizer`,
      
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
    getRequestOrganizers()


   },[])

   const toggleDetails = (id) => {
     if (expandedOrganizer === id) {
       setExpandedOrganizer(null); // Collapse if already expanded
     } else {
       setExpandedOrganizer(id); // Expand the clicked organizer
     }
   };
 
   return (
     <div className="flex flex-col items-center pt-5 gap-4 w-full">
       {organizer.map((data) => (
         <div
           key={data._id}
           className="flex flex-col justify-between items-center w-full max-w-xl h-auto bg-white shadow-md rounded-lg p-4"
         >
           {/* Organizer Info */}
           <div className="flex flex-row justify-between items-center w-full">
             <h1 className="text-gray-800 font-semibold text-lg">{data.name}</h1>
             <button
               onClick={() => toggleDetails(data._id)}
               className="bg-blue-500 text-white p-2 rounded-md"
             >
               {expandedOrganizer === data._id ? "Hide Details" : "Show Details"}
             </button>
           </div>
 
           {/* Conditionally Render Expanded Details */}
           {expandedOrganizer === data._id && (
             <div className="w-full mt-4">
               <h2 className="text-gray-700">ID: {data._id}</h2>
               <h2 className="text-gray-600">Email: {data.email}</h2>
               <p className="text-gray-600">Motivation: {data.Motivation}</p>
               {/* Additional Organizer Details */}
               <div className="flex flex-row justify-start gap-4 mt-2">
                 <button
                   onClick={() => AcceptOrganizer(data._id)}
                   className="bg-green-400 p-2 rounded-md"
                 >
                   Accept
                 </button>
                 <button
                   onClick={() => RejectOrganizer(data._id)}
                   className="bg-red-400 p-2 rounded-md"
                 >
                   Reject
                 </button>
               </div>
             </div>
           )}
         </div>
       ))}
     </div>
   );
 };
 
 export default AdminDecide;
import React, { useEffect, useState ,} from 'react'
import toast from 'react-hot-toast'
import { useNavigate, useParams } from 'react-router-dom'
import { Select, Option } from "@material-tailwind/react";
import { URL } from '../../App';

const SetRemainder = () => {
    const navigate=useNavigate()
    const { id } = useParams()
    const [time,setTime]=useState("")
    console.log(time)
    async function setRemainder(){
        try{
            const response = await fetch(`${URL}/api/events/reminders/${id}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    },
                    credentials:"include",
                    body:JSON.stringify({time}),
                    })
                const data = await response.json()
                if(response.ok){
                    toast.success(data.message)
                    navigate("/Reminders")
                }
                else{
                    toast.error(data.message)
                }

        }
        catch(error){
            toast.error(error)
        }
       
    }
  return (
    <div>
    <form onSubmit={(e) => {
    e.preventDefault();  // Prevent the default form submission
    setRemainder();  // Call the setRemainder function
  }}>
    <div className='flex flex-col justify-center '>
    <label>Time:</label>
  <select  onChange={(value) => setTime(value.target.value)}>
    <option value="">choose time</option>
    <option value="5m">5 minutes</option>
    <option value="15m">15 minutes</option>
    <option value="30m">30 minutes</option>
    <option value="1h">1 hour</option>
    <option value="2h">2 hours</option>
    <option value="3h">3 hours</option>
    <option value="4h">4 hours</option>
  </select>
  <button type="submit">Set Reminder</button>

    </div>
</form>
    </div>
  )
}
export default SetRemainder
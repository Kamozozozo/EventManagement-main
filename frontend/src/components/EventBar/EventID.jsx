import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { URL } from '../../App';
import toast from 'react-hot-toast';

const EventID = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [event, setEvent] = useState({});
  const [userRole, setUserRole] = useState("");
  const [edit, setEdit] = useState(false);
  const Role = localStorage.getItem("event-user");

  async function setRemainder() {
    navigate(`/Reminders/${id}`);
  }
  async function updateEvent(){
    const confirmed =window.confirm(
      "Are you sure you want to update this event?"
    )
    if (confirmed) {
      toast.success("you have confirmed ")
      navigate(`/UpdateEvent/${id}`)
    }
    else{
      toast.error("you have cancelled")
    }


  }
  async function deleteEvent() {
    const confirmed = window.confirm(
      "Are you sure you want to delete this event?"
      );
    if(confirmed){
      try {
        const response = await fetch(`${URL}/api/events/Event/${id}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: "include",
        });
        const data = await response.json();
        if (response.ok) {
          toast.success(data.message);
          navigate("/");
        } else {
          toast.error(data.message);
        }
      } catch (error) {
        toast.error(error.message);
      }
    }
    else{
      toast.error("operation cancelled")
    }

    }
    

  function toggleEdit() {
    setEdit(!edit);
  }

  useEffect(() => {
    async function fetchEvent() {
      const response = await fetch(`${URL}/api/events/Event/${id}`);
      const data = await response.json();
      setEvent(data);
    }
    fetchEvent();

    if (Role) {
      const parsedUser = JSON.parse(Role);
      setUserRole(parsedUser.role);
    }
  }, [id, Role]);

  return (
    <div className="flex flex-col items-center p-6 bg-gray-100 min-h-screen">
      <div className="w-full flex-col max-w-2xl bg-white shadow-md rounded-lg p-6">
        <div className='flex flex-row justify-between items-center'>
          <h1 className="text-4xl font-bold text-gray-800 mb-6">{event.eventName}</h1>

          <button
            onClick={setRemainder}
            className="w-36 h-12 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-md transition duration-300 ease-in-out"
          >
            Set Reminder
          </button>

          {userRole !== "Student" && (
            <button
              className="w-36 h-12 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-md transition duration-300 ease-in-out"
              onClick={toggleEdit}
            >
              Edit
            </button>
          )}
        </div>

        <div className="flex flex-col items-center mb-6">
          <img className="w-full  object-cover rounded-md" src={event.image} alt="Event Flier" />
        </div>

        <div className="text-gray-700 text-lg leading-relaxed mb-6">
          <p className="font-serif">{event.eventDescription}</p>
          {/*}
          <p className="font-bold"> Date: {new Date( event.eventDate).toLocaleDateString('en-US', { timeZone: 'UTC' })}</p>
          <p className="font-bold"> Time: {new Date( event.eventDate).toLocaleTimeString('en-US', { timeZone: 'UTC' })}</p>
          <p className="font-bold">Venue: {event.venue}</p>*/}
        </div>

        {userRole !== "Student" && edit && (
          <div className="flex justify-between mt-6">
            <button
              className="w-1/2 h-12 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-md mr-4"
              onClick={deleteEvent}
            >
              Delete
            </button>
            <button className="w-1/2 h-12 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-md"
            onClick={updateEvent}

            >
              Update

            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default EventID;

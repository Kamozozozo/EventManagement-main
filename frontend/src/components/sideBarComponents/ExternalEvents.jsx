import React,{useState,useEffect} from 'react'
import EventsBar from '../BarComponents/EventsBar'
import { URL } from '../../App'


const ExternalEvents = () => {
  const other ="Other"
  const [events, setEvents] = useState([])
  async function getEvents() {
    const response = await fetch(`${URL}/api/events/EventsBY`,
      {
        method: 'POST',
        credentials:'include',
        headers: {
          'Content-Type': 'application/json',
         
          },
          body:JSON.stringify({other})
      }
    );
    const data = await response.json();
    setEvents(data);
  }

  useEffect(() => {
    getEvents();
  }, []);
  return (
    <EventsBar events={events} />
  )
}

export default ExternalEvents
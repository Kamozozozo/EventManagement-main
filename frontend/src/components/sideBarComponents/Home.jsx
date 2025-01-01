import React, { useState, useEffect } from 'react';
import EventsBar from '../BarComponents/EventsBar';
import toast from 'react-hot-toast';
import NotificationManager from '../../NotificationManager';
import { URL } from '../../App';

const Home = () => {

  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [selectedFilter, setSelectedFilter] = useState('All Events');
  const status=Notification.permission
  const getEvents = async () => {
    try {
      const response = await fetch(`${URL}/api/events/Events`, {
        method: 'GET',
        credentials: 'include',
      });
      const data = await response.json();
      setEvents(data);
      setFilteredEvents(data);
    } catch (error) {
      console.error('Error fetching events:', error);
      toast.error('Failed to fetch events');
    }
  };

  useEffect(() => {
    getEvents();

  }, []);

  // Function to filter events based on the selected time range
  const filterEvents = (weeks, filterName) => {
    const now = new Date();
    let startDate, endDate;

    if (filterName === 'Upcoming 1 Month') {
      startDate = now;
      endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    } else {
      startDate = now;
      endDate = new Date();
      endDate.setDate(now.getDate() + weeks * 7);
    }

    const filtered = events.filter((event) => {
      const eventDate = new Date(event.eventDate);
      return eventDate >= startDate && eventDate <= endDate;
    });

    setFilteredEvents(filtered);
    setSelectedFilter(filterName);
  };

  return (
    <div className="container mx-auto p-4">
     
        <NotificationManager/>
    
         
        <div className="flex flex-col md:flex-row justify-center mb-4 space-y-2 md:space-y-0 md:space-x-4">
        <div className="md:hidden">
          <select
            className="bg-blue-500 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition duration-300 ease-in-out"
            onChange={(e) => {
              const value = e.target.value;
              if (value === 'All Events') {
                setFilteredEvents(events);
                setSelectedFilter(value);
              } else {
                const weeks = parseInt(value.split(' ')[1]);
                filterEvents(weeks, value);
              }
            }}
            value={selectedFilter}
          >
            <option>All Events</option>
            <option>Upcoming 1 Week</option>
            <option>Upcoming 2 Weeks</option>
            <option>Upcoming 3 Weeks</option>
            <option>Upcoming 1 Month</option>
          </select>
        </div>

        <div className="hidden md:flex flex-wrap justify-center space-x-4">
          <button
            className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition duration-300 ease-in-out"
            onClick={() => {
              setFilteredEvents(events);
              setSelectedFilter('All Events');
            }}
          >
            All Events
          </button>
          <button
            className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition duration-300 ease-in-out"
            onClick={() => filterEvents(1, 'Upcoming 1 Week')}
          >
            Upcoming 1 Week
          </button>
          <button
            className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition duration-300 ease-in-out"
            onClick={() => filterEvents(2, 'Upcoming 2 Weeks')}
          >
            Upcoming 2 Weeks
          </button>
          <button
            className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition duration-300 ease-in-out"
            onClick={() => filterEvents(3, 'Upcoming 3 Weeks')}
          >
            Upcoming 3 Weeks
          </button>
          <button
            className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition duration-300 ease-in-out"
            onClick={() => filterEvents(4, 'Upcoming 1 Month')}
          >
            Upcoming 1 Month
          </button>
        </div>
      </div>
      <div>
        <EventsBar events={filteredEvents} />
      </div>
    </div>
  );
};

export default Home;

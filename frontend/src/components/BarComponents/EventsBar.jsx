import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types'; // Optional, for type-checking

const EventsBar = (props) => {
  const events = props.events || []; // Fallback to an empty array

  return (
    <div className="pt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-7 p-5 place-items-center overflow-y-auto">
      {events.map((data) => (
        <Link
          to={`/event/${data._id}`}
          key={data._id}
          className="w-full h-full"
        >
          <div className="relative bg-white shadow-lg hover:shadow-xl transition-shadow duration-300 rounded-lg overflow-hidden w-full h-full flex flex-col justify-between">
            <div className="p-4">
              <h3 className="text-lg font-bold text-gray-800 mb-2">
                {data.eventName}
              </h3>
              <p><strong>Location:</strong> {data.venue}</p>
              <p>on {new Date(data.eventDate).toLocaleDateString('en-US', { timeZone: 'UTC' })}</p>
              <p>at {new Date(data.eventDate).toLocaleTimeString('en-US', { timeZone: 'UTC' })}</p>
              <p className="text-sm text-gray-400">
                Posted on: {new Date(data.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
};

// Optional: Define PropTypes for better type checking
EventsBar.propTypes = {
  events: PropTypes.array, // Expect events to be an array
};

export default EventsBar;

import React from 'react';
import { Link  } from 'react-router-dom';

const Event = (props) => {
  return (
    <div className='w-72 h-auto bg-white shadow-xl  '>
      <div className='flex justify-center'>
      <img 
        className='w-40 h-auto object-cover' 
        src={props.image} 
        alt={props.Eventname} 
      />
      </div>
      <div className='p-4'>
        <h3 className='text-xl font-semibold text-gray-800 mb-2'>
          {props.Eventname}
        </h3>
        <p className='text-gray-600 mb-4'>
          {props.EventDescription}
        </p>
        <div className='flex justify-between items-center text-gray-500'>
          <span>{props.EventPostedDate}</span>
         
        </div>
      </div>
    </div>
  );
}

export default Event;

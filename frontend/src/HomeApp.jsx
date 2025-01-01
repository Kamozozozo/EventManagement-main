import React from 'react';
import { useState,useEffect } from 'react';
import Home from './components/sideBarComponents/Home'; // Ensure the path is correct
import Sidebar from './components/BarComponents/Sidebar'; // Ensure the path is correct
import './App.css'; // Ensure this file exists and is properly configured
import SearchBar from './components/BarComponents/SearchBar';
import PastEvents from "./components/sideBarComponents/PastEvents"
import EventID from './components/EventBar/EventID';
import NotifyMe from "./components/sideBarComponents/NotifyMe"
import CreateEvent from './components/sideBarComponents/CreateEvent';
import ExternalEvents from "./components/sideBarComponents/ExternalEvents"
import ManageOrganizer from './components/sideBarComponents/ManageOrganizer';
import AddOrganizer from './components/addOrganizer';
import Login from './components/Login';
import { DataProvider } from './components/context/DataContext';
import SetRemainder from './components/sideBarComponents/SetRemainder';
import { BrowserRouter,Routes,Route, Navigate } from 'react-router-dom'
import NotFound from './components/sideBarComponents/NotFound';
import SearchEvent from './components/EventBar/searchEvent';
import UpdateEvent from './components/sideBarComponents/updateEvent';
import AdminDecide from './components/sideBarComponents/AdminDecide';
import ManageStudent from './components/sideBarComponents/ManageStudent';
const HomeApp = () => {
  const [userRole, setUserRole] = useState("");
  useEffect(() => {
    // Read from localStorage and update state on component mount
    const Role = localStorage.getItem("event-user");
    console.log(search)
    if (Role) {
      const parsedUser = JSON.parse(Role);
      setUserRole(parsedUser.role);
    }
  }, []);

  return (
            <div className='flex flex-row h-screen'>
              <div className='first-div w-1/4 bg-gray-800'>
                <Sidebar/>
              </div>
              <DataProvider>
              <div className='second-div flex-1 flex flex-col'>

                <div className='h-16 '>
                  <SearchBar />
                </div>
                <div className='bg-gray-300 flex-1 overflow-y-auto'>
                  <Routes>
                    <Route path="/" element={<Home/>} />
                    <Route path='/Other-events' element={<ExternalEvents />} />
                    <Route path='/event/:id' element={<EventID/>} />
                    <Route path='/event/search' element={<SearchEvent/>} />
                    <Route path='/Reminders' element={<NotifyMe/>} />
                    <Route path='/Reminders/:id' element={<SetRemainder/>} />
                    <Route path='/past-events' element={<PastEvents/>} />
                    <Route path="*" element= {<NotFound/>}/>
                    <Route path='/create-event' element={<CreateEvent/>} />
                    <Route path='/UpdateEvent/:id' element={<UpdateEvent/>}/>

                    {userRole !="Admin" ?(
                      <>
                      {/*all the routes that a person who is not an admin is not allowed to follow*/}
                       <Route path='/manageOrganizers' element={<Navigate to="/"/>} />
                       <Route path='/addOrganizer' element={<Navigate to="/"/>} />
                       <Route path='/manageStudent' element={<Navigate to="/"/>} />


                      </>
                    ):
                    <>
                     {/*all the routes that a person who is  an admin is not allowed to follow*/}
                  
                     <Route path='/past-events' element={<PastEvents/>} />
                     <Route path='/manageOrganizers' element={<ManageOrganizer/>} />
                     <Route path='/addOrganizer' element={<AdminDecide/>} />
                     <Route path='/manageStudent' element={<ManageStudent/>} />
                    </>}
                  </Routes>
                </div>
              </div>
              </DataProvider>
            </div>
  );
};
export default HomeApp;
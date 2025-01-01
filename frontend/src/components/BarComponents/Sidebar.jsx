import React, { useState, useEffect } from 'react';
import unizulu from '../../assets/unizulu.png'; // Adjust the path as needed
import { FaHome } from "react-icons/fa";
import { BiSolidMessageCheck } from "react-icons/bi";
import { MdEventAvailable, MdCallMissed, MdEventNote , MdCreateNewFolder} from "react-icons/md";
import { FaExternalLinkAlt } from "react-icons/fa";
import { GrUserAdmin } from "react-icons/gr";
import { Link } from 'react-router-dom';
import LogoutButton from '../sideBarComponents/LogoutButton';

const Sidebar = () => {
  const [userRole, setUserRole] = useState("");

  useEffect(() => {
    // Read from localStorage and update state on component mount
    const Role = localStorage.getItem("event-user");
    if (Role) {
      const parsedUser = JSON.parse(Role);
      setUserRole(parsedUser.role);
    }
  }, []); // Empty dependency array means this runs once on component mount
  return (
    <nav >
      <div className="sidebar">
        <div className="logo">
          <img src={unizulu} alt="Unizulu Logo" className="logo-img" />
        </div>
        <div className="menu">
          {/* Common Routes for all roles */}
          <Link to="/">
            <div className="menu-item">
              <div className="icons">
                <FaHome className="size-7" />
                <span className="tooltip">Home</span>
              </div>
  
              <span className="icon-name">
                Home
              </span>
            </div>
          </Link>
          
          <Link to="/past-events">
            <div className="menu-item">
              <div className="icons">
                <MdCallMissed className="size-7" />
                <span className="tooltip">Past Events</span>
              </div>
              <span className="icon-name">
                Past Events
              </span>
            </div>
          </Link>
          {/* Role-Based Routes */}
          {userRole === 'Admin' && (
            <>
              <Link to="/Other-events">
                <div className="menu-item">
                  <div className="icons">
                    <FaExternalLinkAlt className="size-7" />
                    <span className="tooltip">Other events</span>
                  </div>
                  <span className="icon-name">
                    Other Events
                  </span>
                </div>
              </Link>

              <Link to="/reminders">
                <div className="menu-item notify">
                  <div className="icons">
                    <MdEventAvailable className="size-7" />
                    <span className="tooltip">Reminders</span>
                  </div>
                  <span className="icon-name" >
                    Reminders
                  </span>
                </div>
              </Link>
              <Link to="/manageOrganizers">
                <div className="menu-item notify">
                  <div className="icons">
                  <GrUserAdmin className="size-7" />
                  <span className="tooltip">Manage Organizer</span>
                  </div>
                  <span className="icon-name">
                    Manage Organizers
                  </span>
                </div>
              </Link>
              <Link to="/manageStudent">
                <div className="menu-item notify">
                  <div className="icons">
                  <GrUserAdmin className="size-7" />
                  <span className="tooltip">Manage Students</span>
                  </div>
                  <span className="icon-name">
                    Manage Student
                  </span>
                </div>
              </Link>
              
              <LogoutButton/>
            </>
          )}
          {userRole === 'Student' && (
            <>
              <Link to="/Other-events">
                <div className="menu-item">
                  <div className="icons">
                    <FaExternalLinkAlt className="size-7" />
                    <span className="tooltip">Other events</span>
                  </div>
                  <span className="icon-name">
                    Other Events
                  </span>
                </div>
              </Link>

              <Link to="/reminders">
                <div className="menu-item notify">
                  <div className="icons">
                    <MdEventAvailable className="size-7" />
                    <span className="tooltip">Reminders</span>
                  </div>
                  <span className="icon-name">
                    Reminders
                  </span>
                </div>
              </Link>
              
              <LogoutButton/>
            </>
          )}

          {userRole === 'Organizer' && (
            <>
              <Link to="/Other-events">
                <div className="menu-item">
                  <div className="icons">
                    <FaExternalLinkAlt className="size-7" />
                    <span className="tooltip">Other events</span>
                  </div>
                  <span className="icon-name">
                    Other Events
                  </span>
                </div>
              </Link>
              <Link to="/reminders">
                <div className="menu-item notify">
                  <div className="icons">
                    <MdEventAvailable className="size-7" />
                    <span className="tooltip">Reminders</span>
                  </div>
                  <span className="icon-name">
                    Reminders
                  </span>
                </div>
              </Link>
              <Link to="/create-event">
                <div className="menu-item notify">
                  <div className="icons">
                
                    <MdCreateNewFolder className="size-7" />
                    <span className="tooltip">Create Event</span>
                  </div>
                  <span className="icon-name">
                    create event
                  </span>
                </div>
              </Link>
              <LogoutButton/>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Sidebar;

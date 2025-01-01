import React,{ useState } from 'react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import html2canvas from 'html2canvas';
import {io} from "socket.io-client"
import unizulu from '../../assets/unizulu.png';
import { URL } from '../../App';

const CreateEvent = () => {
  const styles = {
    modalOverlay: {
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: "rgba(0, 0, 0, 0.5)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      zIndex: 1000,
      
    },
    modalContent: {
      backgroundColor: "white",
      padding: "20px",
      borderRadius: "8px",
      width: "80%",
      maxWidth: "500px",
      textAlign: "center",
      position: "relative",
    },
    downloadButton: {
      marginTop: "20px",
      padding: "10px 20px",
      backgroundColor: "#007bff",
      color: "white",
      border: "none",
      borderRadius: "4px",
      cursor: "pointer",
    },
    // Style for template previews
    template1: {
      width: "450px",
      height:"600px",
      padding: "10px",
      backgroundColor: "#f0f8ff",
      borderRadius: "8px",
    },
    template2: {
      padding: "20px",
      backgroundColor: "#e6f2ff",
      borderRadius: "8px",
    },
    template3: {
      padding: "20px",
      backgroundColor: "#ccf2ff",
      borderRadius: "8px",
    },
    template1Content: {
      color: "#333",
      fontSize: "18px",
      fontWeight: "bold",
    },
    template2Content: {
      color: "#333",
      fontSize: "18px",
      fontWeight: "bold",
    },
    template3Content: {
      color: "#333",
      fontSize: "18px",
      fontWeight: "bold",
      
    },
    templateExternal: {
      position: 'relative',
      padding: "20px",
      backgroundColor: "#f5f5dc",
      border: "8px double #007BFF", // Blue double border
      borderRadius: "12px",
      textAlign: "left",
      color: "#4b2e83",
      fontSize: "1.1em",
      fontFamily: "Georgia, serif",
      boxShadow: "0 6px 12px rgba(0, 0, 0, 0.15)",
      marginBottom: "20px",
      overflow: 'hidden',
  },
  backgroundShapes: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      zIndex: -1,
      background: `
          radial-gradient(circle, rgba(255, 255, 255, 0.2) 10%, transparent 40%),
          radial-gradient(circle, rgba(255, 255, 255, 0.2) 10%, transparent 40%)
      `,
      backgroundSize: '100px 100px, 150px 150px',
      backgroundPosition: '0 0, 100px 100px',
  },
  logoContainer: {
    
      textAlign: 'center',
      marginBottom: '10px',
  },
  logoFrame: {
      display: 'flex',
      justifyContent: 'center',
      width:"150px",
      marginLeft:"100px",
      
      border: '5px solid #007BFF', // Border around the logo
      borderRadius: '10px', // Rounded corners
      backgroundColor: '#fff', // White background for contrast
      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',


  },
  logo: {
      width: '120px',
      height: '120px',
      
  },
  subtitle: {
      marginTop: '5px',
      fontStyle: 'italic',
      color: '#4b2e83',
      fontSize: '0.65em',
  },
  templateTitle: {
      marginBottom: "15px",
      fontWeight: "bold",
      color: "#4b2e83",
  },
  infoContainer: {
      backgroundColor: "#e7f1ff",
      borderRadius: "8px",
      padding: "15px",
      boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
      marginTop: "10px",
      textAlign: "left",
  },
  infoItem: {
      margin: "5px 0",
      fontSize: "1.1em",
      color: "#333",
  }
};
  
  


  const navigate = useNavigate();
  const [venues, setVenues] = useState([]);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState('');
  const [faculty, setFaculty] = useState('');
  const [date, setDate] = useState('');
  const [venue, setVenue] = useState('');
  const [venueId, setVenueId] = useState('');
  const [studyLevel, setStudyLevel] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false); // New state for submission
  const [showModal, setShowModal] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState(1);

  const handleChange = (setter) => (event) => setter(event.target.value);

  const handleImageChange = (e) => {
    const reader = new FileReader();
    reader.readAsDataURL(e.target.files[0]);
    reader.onload = () => setImage(reader.result);
  };

  const handleVenueSelection = (event) => {
    const [venueName, venueTime, venueId] = event.target.value.split('^');
    setVenue(venueName);
    setDate(venueTime);
    setVenueId(venueId);
  };

  const handleBooking = async () => {
    try {
      const response = await fetch(`${URL}/api/events/booking`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ date }),
        credentials: 'include',
      });

      const data = await response.json();
      if (response.ok) {
        if(data.length>=1){
          toast.success("Please select available venues and dates");
          setVenues(data);
        }
        else{
          toast.error("no avaliable venues",
          );
        }
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error('Error fetching available venues.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const confirmed = window.confirm('Are you sure you want to create this event?');
    if (confirmed) {
      setIsSubmitting(true); // Disable the button after click

      const eventData = {
        eventName: name,
        eventDescription: description,
        eventDate: date,
        venue,
        venueId,
        image,
        faculty,
        StudyLevel:studyLevel,
      };

      try {
        const response = await fetch(`${URL}/api/events/Event`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
          body: JSON.stringify(eventData),
          credentials: 'include',
        });

        const result = await response.json();
        if (response.ok) {
          toast.success(result.message);
          setTimeout(() => {
            navigate('/');
          }, 1000);
        } else {
          toast.error(result.message);
        }
      } catch (error) {
        console.error('Error creating event:', error);
        toast.error('Error creating event.');
      } finally {
        setIsSubmitting(false); // Re-enable the button after process completes
      }
    }
  };

  const openModal = (templateNumber) => {
    setSelectedTemplate(templateNumber);
    setShowModal(true);
  };

  const closeModal = () => setShowModal(false);

  const saveAsImage = () => {
    const previewElement = document.getElementById("templatePreview");
    html2canvas(previewElement).then((canvas) => {
      const link = document.createElement("a");
      link.href = canvas.toDataURL("image/png");
      link.download = `event-template-${selectedTemplate}.png`;
      link.click();
    });
  };
  return (
    <section className="bg-gray-50 dark:bg-gray-900 h-screen">
      <div className="flex h-full w-full items-center justify-center mx-auto md:h-screen">
        <div className="w-full max-w-7xl flex flex-col gap-8 md:flex-row">

          {/* Book a Venue */}
          <div className="w-full md:w-1/2 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-bold mb-4 dark:text-white">Book a Venue</h2>
            <form onSubmit={(e) => e.preventDefault()} className="space-y-6">
              <div>
                <input
                  type="date"
                  onChange={handleChange(setDate)}
                  className="w-full p-2.5 bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                  required
                />
                  </div>
              <div className="hidden sm:grid grid-cols-4 gap-4 font-semibold">
            <span className="text-gray-700">Venue</span>
            <span className="text-gray-700">Date</span>
            <span className="text-gray-700">Time</span>
            <span className="text-gray-700">Capacity</span>
          </div>

          <div>
            {venues.map((item, index) => {
              const [date, time] = item.startDate.split('T'); // Extract date and time
              return (
                <div
                  key={index}
                  className="grid grid-cols-1 sm:grid-cols-4 gap-4 items-center py-2 border-b border-gray-200"
                >
                  {/* Venue Selection */}
                  <div>
                    <input
                      onChange={handleVenueSelection}
                      type="radio"
                      id={item._id}
                      name="venue"
                      value={`${item.name}^${item.startDate}^${item._id}`}
                      className="mr-2.5 h-4 w-4"
                    />
                    <label htmlFor={item.name} className="text-gray-600 dark:text-gray-300">
                      {item.name}
                    </label>
                  </div>

                  {/* Date */}
                  <span className="text-sm text-gray-500">{date}</span>

                  {/* Time */}
                  <span className="text-sm text-gray-500">{time.slice(0, 5)}</span>

                  {/* Capacity */}
                  <span className="text-sm text-gray-500">{item.capacity}</span>
                </div>
              );
            })}
          </div>


              <button
                type="button"
                onClick={handleBooking}
                className="w-full p-2.5 text-white bg-blue-500 rounded-lg hover:bg-blue-600 focus:ring-4 focus:ring-blue-300"
              >
                Check
              </button>
            </form>
          </div>

          {/* Create an Event */}
          <div className="w-full md:w-1/2 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-bold mb-4 dark:text-white">Create an Event</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <input
                type="text"
                onChange={handleChange(setName)}
                placeholder="Event Name"
                className="w-full p-2.5 bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                required
              />
              <input
                type="text"
                onChange={handleChange(setDescription)}
                placeholder="Event Description"
                className="w-full p-2.5 bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                required
              />
               <div className="flex gap-20px">
                <button type="button" onClick={() => openModal(1)} className="p-2 text-white bg-blue-500 rounded-lg mr-4">Sports</button>
                <button type="button" onClick={() => openModal(2)} className="p-2 text-white bg-blue-500 rounded-lg mr-4">EXternal</button>
                <button type="button" onClick={() => openModal(3)} className="p-2 text-white bg-blue-500 rounded-lg mr-4">Academic</button>
              </div>
          

              <input
                type="file"
                onChange={handleImageChange}
                className="w-full p-2.5 bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                required
              />
              <select onChange={handleChange(setFaculty)} className="w-full p-2.5 bg-gray-50 border border-gray-300 rounded-lg">
                <option value="">Select Faculty</option>
                <option value="COMMERCE,ADMINISTRATION AND LAW">COMMERCE,ADMINISTRATION AND LAW</option>
                <option value="EDUCATION">EDUCATION</option>
                <option value="ENGINEERING, SCIENCE AND AGRICULTURE">ENGINEERING, SCIENCE AND AGRICULTURE</option>
                <option value="HUMANITIES AND SOCIAL SCIENCE">HUMANITIES AND SOCIAL SCIENCE</option>
                <option value="Other">Other</option>
              </select>
              <select onChange={handleChange(setStudyLevel)} className="w-full p-2.5 bg-gray-50 border border-gray-300 rounded-lg">
                <option value="">Select Study Level</option>
                <option value="postgrad">Postgrad</option>
                <option value="undergrad">Undergrad</option>
              </select>
              <button
                type="submit"
                className="w-full p-2.5 text-white bg-blue-500 rounded-lg hover:bg-blue-600 focus:ring-4 focus:ring-blue-300"
                disabled={isSubmitting} // Disable the button when submitting
              >
                {isSubmitting ? 'Creating Event...' : 'Create Event'}
              </button>
            </form>
          </div>
        </div>
      </div>
       {/* Modal for Template Preview */}
       {showModal && (
        <div style={styles.modalOverlay} onClick={closeModal}>
          <div style={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <div id="templatePreview" style={styles[`template${selectedTemplate}`]}>
              {selectedTemplate === 1 && (
                <div style={styles.template1Content}>
                   <div className="w-[450px] h-[600px] border-2 border-gray-300 shadow-2xl p-4 bg-gray-100 rounded-lg">

                      <div className="bg-blue-800 w-full h-20 flex items-center justify-center text-white font-bold text-lg rounded-bl-[200px] rounded-br-[200px] -mt-5 mb-6">
                        {name}
                      </div>

                      <div className="w-full h-32 flex flex-col items-center justify-center bg-blue-400 rounded-xl text-white p-4 shadow-lg mb-8">
                        <div className="text-center">{description}</div>
                        <p ><strong>Location:</strong>{venue}</p>
                        <div className="flex flex-row justify-center gap-4 mt-2">
                          <p>on {new Date(date).toLocaleDateString('en-US', { timeZone: 'UTC' })}</p>
                          <p>at {new Date(date).toLocaleTimeString('en-US', { timeZone: 'UTC' })}</p>
                        </div>
                      </div>
                      <div className="w-60 h-60 bg-blue-600 rounded-full flex items-center justify-center mx-auto mt-10 overflow-hidden shadow-lg transform hover:scale-105 duration-300">
                        <img src={unizulu} className="w-56 h-56 rounded-full object-cover" alt="Event image" />
                      </div>
                    </div>


                </div>
              )}
              {selectedTemplate === 2 && (
                <div style={styles.template2Content}>
                      
                        <div id="templatePreview" style={styles.templateExternal}>
                            <div style={styles.backgroundShapes}></div>
                            <h2 style={styles.templateTitle}>🌍 External Events</h2>
                            <h4 style={styles.templateTitle}><strong>Topic:</strong> {name}</h4>
                            <div style={styles.logoContainer}>
                                <div style={styles.logoFrame}>
                                    <img 
                                        src={unizulu} 
                                        alt="Logo" 
                                        style={styles.logo} 
                                    />
                                </div>
                                <p style={styles.subtitle}>A NODE FOR AFRICAN THOUGHT</p>
                            </div>
                        
                            <div style={styles.infoContainer}>
                                <p style={styles.infoItem}><strong>Description:</strong>{description}</p>
                                <p style={styles.infoItem}><strong>Location:</strong>{venue}</p>
                                <p><strong>Date:</strong> {new Date(date).toLocaleDateString('en-US', { timeZone: 'UTC' })}</p>
                                <p><strong>Time:</strong> {new Date(date).toLocaleTimeString('en-US', { timeZone: 'UTC' })}</p>
                            </div>
                        </div>
                  
                  
                </div>
              )}
              {selectedTemplate === 3 && (
                <div style={styles.template3Content}>
                        <div id="templatePreview" style={styles.templateAcademic}>
                            <div style={styles.backgroundShapes}></div>
                            <h2 style={styles.templateTitle}>🎓 Academic Events</h2>
                            <h4 style={styles.templateTitle}><strong>Topic:</strong> {name}</h4>
                            <div style={styles.logoContainer}>
                                <img 
                                    src={unizulu}
                                    alt="Logo" 
                                    style={styles.logo}
                                />
                                <p style={styles.subtitle}>A NODE FOR AFRICAN THOUGHT</p>
                            </div>
                        
                            <div style={styles.infoContainer}>
                                <p style={styles.infoItem}><strong>Description:</strong>{description}</p>
                                <p style={styles.infoItem}><strong>Location:</strong>{venue}</p>

                                <p><strong>Date:</strong> {new Date(date).toLocaleDateString('en-US', { timeZone: 'UTC' })}</p>
                                <p><strong>Time:</strong> {new Date(date).toLocaleTimeString('en-US', { timeZone: 'UTC' })}</p>
                            </div>
                        </div>
                </div>
              )}
            </div>
            <button onClick={saveAsImage} style={styles.downloadButton}>Download Image</button>
          </div>
        </div>
      )}
    </section>
  );
};

export default CreateEvent;
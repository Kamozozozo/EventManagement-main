import React,{useState,useEffect} from 'react'
import toast from 'react-hot-toast';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import { URL } from '../../App';

const UpdateEvent = () => {
    const {id}=useParams()
    const navigate=useNavigate()
    const [venues, setVenues] = useState([]);
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [image, setImage] = useState('');
    const [faculty, setFaculty] = useState('');
    const [date, setDate] = useState('');
    const [venue, setVenue] = useState('');
    const [venueId, setVenueId] = useState('');
    const [studyLevel, setStudyLevel] = useState('');
    const venueToChange=venueId;
    console.log(venueId)
  useEffect(() => {
    const fetchEventDetails = async () => {
      try {
        const response = await fetch(`${URL}/api/events/Event/${id}`, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
        });

        const eventData = await response.json();
        if (response.ok) {
          // Set the event data to the state variables
          setName(eventData.eventName);
          setDescription(eventData.eventDescription);
          setDate(eventData.eventDate);
          setVenue(eventData.venue);
          setVenueId(eventData.venueId);
          setImage(eventData.image);
          setFaculty(eventData.faculty);
          setStudyLevel(eventData.studyLevel);
        } else {
          toast.error('Error fetching event details.');
        }
      } catch (error) {
        console.error('Error fetching event details:', error);
        toast.error('Error fetching event details.');
      }
    };

    fetchEventDetails();
  }, [id]);

  // Generic handler for text inputs
  const handleChange = (setter) => (event) => setter(event.target.value);

  // Handle image upload and convert it to Base64
  const handleImageChange = (e) => {
    const reader = new FileReader();
    reader.readAsDataURL(e.target.files[0]);
    reader.onload = () => setImage(reader.result);
  };

  // Handle venue selection and split the data correctly
  const handleVenueSelection = (event) => {
    const [venueName, venueTime, venueId] = event.target.value.split('^');
    setVenue(venueName);
    setDate(venueTime);
    setVenueId(venueId);
  };

  // Fetch available venues based on selected date
  const handleBooking = async () => {
    const confirmed = window.confirm('Are you sure you want to modify event date?');
    if (confirmed) {
        try {
            // First, update the venue status
            const updateVenueResponse = await fetch(`${URL}/api/events/venue`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body:JSON.stringify({ venueToChange }) // Assuming venueToChange holds the correct data
            });
            const venueStatus = await updateVenueResponse.json();

            if (!updateVenueResponse.ok) {
                toast.error(venueStatus.message)
                
            }
            // After successfully updating the venue, fetch available venues
            const fetchVenuesResponse = await fetch(`${URL}/api/events/booking`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ date }), // Fetch venues based on the selected date
                credentials: 'include',
            });

            const data = await fetchVenuesResponse.json();

            if (fetchVenuesResponse.ok) {
                toast.success('Available venues loaded. Please select a venue.');
                setVenues(data); // Populate the available venues
            } else {
                toast.error('Error fetching venues.');
            }

        } catch (error) {
          
            toast.error('An error occurred while processing the booking.');
        }
    }
};


  // Handle event submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    const confirmed = window.confirm('Are you sure you want to update this event?');
    if (confirmed) {
      const eventData = {
        eventName: name,
        eventDescription: description,
        eventDate: date,
        venue,
        venueId,
        image,
        faculty,
        studyLevel,
      };

      try {
        const response = await fetch(`${URL}/api/events/Event/${id}`, {
          method: 'PUT',
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
          navigate("/")
          
        } else {
          toast.error(result.message);
        }
      } catch (error) {
        console.error('Error updating event:', error);
        toast.error('Error updating event.');
      }
    }
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
                  value={date.split('T')[0]} 
                  className="w-full p-2.5 bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                  required
                />
              </div>
              <div>
                <span>{'****venue**********date&&time********capacity '}</span>
                {venues.map((item, index) => (
                  <div key={index}>
                    <input
                      onChange={handleVenueSelection}
                      type="radio"
                      id={item._id}
                      name="venue"
                      value={`${item.name}^${item.startDate}^${item._id}`}
                      className="mr-2.5 h-4 w-4"
                      checked={item._id === venueId} // Pre-select venue
                    />
                    <label htmlFor={item.name} className="text-gray-600 dark:text-gray-300">
                      {item.name}
                      <span className="ml-2 text-sm text-gray-500">{item.startDate.split('T')}</span>
                      <span className="ml-2 text-sm text-gray-500">{item.capacity}</span>
                    </label>
                  </div>
                ))}
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

          {/* Update an Event */}
          <div className="w-full md:w-1/2 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-bold mb-4 dark:text-white">Update an Event</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <input
                type="text"
                onChange={handleChange(setName)}
                value={name} // Pre-fill name
                placeholder="Event Name"
                className="w-full p-2.5 bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                required
              />
              <input
                type="text"
                onChange={handleChange(setDescription)}
                value={description} // Pre-fill description
                placeholder="Event Description"
                className="w-full p-2.5 bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                required
              />
              <input
                type="file"
                onChange={handleImageChange}
                className="w-full p-2.5 bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
              />
              {image && <img src={image} alt="Event" className="w-32 h-32 mt-4" />}
              <select
                onChange={handleChange(setFaculty)}
                value={faculty} // Pre-fill faculty
                className="w-full p-2.5 bg-gray-50 border border-gray-300 rounded-lg"
              >
                <option value="">Select Faculty</option>
                <option value="faculty of science">Faculty of Science</option>
                <option value="faculty of law">Faculty of Law</option>
                <option value="faculty of arts">Faculty of Arts</option>
                <option value="Other">Other</option>
              </select>
              <select onChange={handleChange(setStudyLevel)}
                value={studyLevel}className="w-full p-2.5 bg-gray-50 border border-gray-300 rounded-lg">
                <option value="">Select Study Level</option>
                <option value="postgrad">Postgrad</option>
                <option value="undergrad">Undergrad</option>
              </select>

            
                  <button
                    type="submit"
                    className="w-full p-2.5 text-white bg-blue-500 rounded-lg hover:bg-blue-600 focus:ring-4 focus:ring-blue-300"
                  >
                    update Event
                  </button>
                </form>
              </div>
            </div>
          </div>
        </section>
      );
    };
    

export default UpdateEvent
import * as React from 'react';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { StaticDatePicker } from '@mui/x-date-pickers/StaticDatePicker';
import { Box, Typography, Paper, Button } from '@mui/material';
import { PickersDay } from '@mui/x-date-pickers/PickersDay';
import dayjs from 'dayjs';
import { URL } from '../../App';

export default function FullEventCalendar() {
  const [selectedDate, setSelectedDate] = React.useState(dayjs());
  const [fetchedEvents, setFetchedEvents] = React.useState([]);

  // Fetch events when the component mounts
  React.useEffect(() => {
    async function getEvents() {
      try {
        const response = await fetch(`${URL}/api/events/reminders`, {
          method: 'GET',
          credentials: "include"
        });
        const data = await response.json();
        console.log(data)
        if (response.ok) {
          setFetchedEvents(data);
        }
      } catch (error) {
        console.log(error);
      }
    }
    getEvents();
  }, []);

  // Function to check if a day has any events
  const isEventDay = (date) => {
    return fetchedEvents.some((event) =>
      dayjs(event.eventDate).isSame(date, 'day')
    );
  };

  // Function to get events for the selected day
  const selectedDayEvents = fetchedEvents.filter(event =>
    dayjs(event.eventDate).isSame(selectedDate, 'day')
  );

  // Custom day rendering to highlight days with events
  const renderDay = (day, selectedDates, pickersDayProps) => {
    const hasEvent = isEventDay(day);
    return (
      <PickersDay
        {...pickersDayProps}
        sx={{
          backgroundColor: hasEvent ? 'red' : 'transparent', // Red background for event days
          '&:hover': {
            backgroundColor: hasEvent ? 'darkred' : 'transparent', // Darker red on hover
          },
          color: hasEvent ? 'white' : 'inherit', // White text for event days
        }}
      />
    );
  };

  // Handle button click for each day (could be a reminder setting or event view)
  const handleButtonClick = (date) => {
    setSelectedDate(date);
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mt: 2 }}>
      {/* Calendar Component */}
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <StaticDatePicker
          orientation="portrait"
          openTo="date"
          value={selectedDate}
          onChange={(newValue) => {
            if (newValue && dayjs.isDayjs(newValue)) {
              setSelectedDate(newValue);
            }
          }}
          renderDay={renderDay} // Custom rendering for event days
          sx={{ width: '100%', maxWidth: 400 }} // Responsive width for the calendar
        />
      </LocalizationProvider>
      {/* Display Event Information */}
      <Paper elevation={3} sx={{ mt: 3, p: 2, width: '100%', maxWidth: 400 }}>
        <Typography variant="h6" gutterBottom>
          Events for {selectedDate.format('MMMM D, YYYY')}:
        </Typography>

        {selectedDayEvents.length > 0 ? (
          selectedDayEvents.map((event, index) => (
            <Box key={index} sx={{ mb: 2 }}>
              <Typography variant="body1">
                {event.eventName} at {event.time}
                <br />
                located in {event.venue}
              </Typography>
            </Box>
          ))
        ) : (
          <Typography variant="body2" color="text.secondary">
            No events for this day.
          </Typography>
        )}
      </Paper>
      {/* Render Buttons for Each Event Day */}
      <Box sx={{ display: 'flex', flexWrap: 'wrap', mt: 2 }}>
        {fetchedEvents.map((event, index) => {
          const eventDate = dayjs(event.eventDate);
          return (
            <Button
              key={index}
              variant="contained"
              onClick={() => handleButtonClick(eventDate)} // Handle button click to select the date
              sx={{
                backgroundColor: isEventDay(eventDate) ? 'red' : 'gray', // Red if event exists, otherwise gray
                color: 'white',
                margin: '5px',
                '&:hover': {
                  backgroundColor: isEventDay(eventDate) ? 'darkred' : 'darkgray', // Darker on hover
                },
              }}
            >
              {eventDate.format('D')} {/* Show the day of the month */}
            </Button>
          );
        })}
      </Box>
    </Box>
  );
}
import React, { useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import './PositionCalendar.css';

const PositionCalendar = ({ positions, onDateSelect }) => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [modalPosition, setModalPosition] = useState(null);

  const positionDates = positions.map((position) => {
    return new Date(position.last_fill_time);
  });

  const hasPositionOnDate = (date) => {
    return positionDates.some((positionDate) => {
      const normalizedPositionDate = new Date(
        positionDate.getFullYear(),
        positionDate.getMonth(),
        positionDate.getDate()
      );
      const normalizedDate = new Date(
        date.getFullYear(),
        date.getMonth(),
        date.getDate()
      );
      return normalizedPositionDate.getTime() === normalizedDate.getTime();
    });
  };

  const handleChange = (date) => {
    setSelectedDate(date);
    if (onDateSelect) {
      onDateSelect(date);
    }
  };

  // Get positions for a specific date
  const getPositionsForDate = (date) => {
    return positions.filter((position) => {
      const normalizedPositionDate = new Date(
        new Date(position.last_fill_time).getFullYear(),
        new Date(position.last_fill_time).getMonth(),
        new Date(position.last_fill_time).getDate()
      );
      const normalizedDate = new Date(
        date.getFullYear(),
        date.getMonth(),
        date.getDate()
      );
      return normalizedPositionDate.getTime() === normalizedDate.getTime();
    });
  };

  // Handle "Today" button click
  const goToToday = () => {
    const today = new Date();
    setSelectedDate(today);
  };

  return (
    <div className="position-calendar-container">
      {positions.length === 0 ? (
        <p className="no-data-message">No Data</p>
      ) : (
        <>
          <button className="today-button" onClick={goToToday}>
            Today
          </button>
          <Calendar
            onChange={handleChange}
            value={selectedDate}
            tileClassName={({ date, view }) => {
              if (view === 'month' && hasPositionOnDate(date)) {
                return 'highlight';
              }
            }}
          />
        </>
      )}
    </div>
  );
};

export default PositionCalendar;
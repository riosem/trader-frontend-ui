import './App.css';
import React from 'react';
import KPICalculator from './components/PositionKpis';
import PositionCalendar from './components/PositionCalendar';
import PositionOverTime from './components/PositionOverTime';
import { useState, useEffect } from 'react';
import { useAuth } from 'auth/useAuth';
import { useSchedules, usePositions } from './client/api.js'

// import { positionData } from './client/mockApi';


const App = () => {
  const { user, isAuthenticated, getAccessTokenSilently, login } = useAuth();
  const [token, setToken] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [positionsForDate, setPositionsForDate] = useState([]);
  const [hoveredPosition, setHoveredPosition] = useState(null);

  useEffect(() => {
    const fetchToken = async () => {
      try {
        const token = await getAccessTokenSilently();
        setToken(token);
      } catch (error) {
        console.error("Error fetching token:", error);
      }
    };

    if (isAuthenticated) {
      fetchToken();
    }
  }, [isAuthenticated]);

  const schedules = useSchedules(token);
  const positions = usePositions(schedules, token);

  const handleDateSelect = (date) => {
    setSelectedDate(date);

    // Find positions for the selected date
    const normalizedSelected = new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime();
    const filtered = positions.filter((pos) => {
      const posDate = new Date(pos.last_fill_time);
      const normalizedPos = new Date(posDate.getFullYear(), posDate.getMonth(), posDate.getDate()).getTime();
      return normalizedPos === normalizedSelected;
    });
    setPositionsForDate(filtered);
  };

  return (
    <div className="app-container">
      {
        isAuthenticated ? 
        (
          <>
            <main className="app-main-row">
        <section className="calendar-section">
          <PositionCalendar positions={positions} onDateSelect={handleDateSelect} />
        </section>
        <aside className="positions-list-section">
          <h2>Positions for {selectedDate ? selectedDate.toLocaleDateString() : "..."}</h2>
          {selectedDate && positionsForDate.length === 0 && (
            <p>No positions for this date.</p>
          )}
          <ul className="positions-list">
            {positionsForDate.map((pos, idx) => (
              <li
                key={idx}
                className="position-list-item"
                style={{ position: 'relative' }}
              >
                <span className={`position-type ${pos.side === 'BUY' ? 'entry' : 'exit'}`}>
                  {pos.side === 'BUY' ? 'Entry' : 'Exit'}
                </span>
                {" - "}
                <span>{pos.product_id} (Order: {pos.order_id})</span>
                <div className="position-tooltip" style={{display: 'block'}}>
                  <pre>{JSON.stringify(pos, null, 2)}</pre>
                </div>
              </li>
            ))}
          </ul>
        </aside>
      </main>
      <main className="app-main">
        <section className="chart-section">
          <PositionOverTime positions={positions} />
        </section>
        <section className="kpi-section">
          <KPICalculator data={positions} />
        </section>
      </main>
          </>
        ) 
        : 
        (
          <button onClick={login} className="login-button">Login</button>
        )
      }
    </div>
  );
};

export default App;
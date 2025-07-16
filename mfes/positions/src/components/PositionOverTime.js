import React from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  LinearScale,
  Title,
  Tooltip,
  Legend,
  CategoryScale,
} from 'chart.js';

// Register Chart.js components
ChartJS.register(
  LineElement,
  PointElement,
  LinearScale,
  Title,
  Tooltip,
  Legend,
  CategoryScale
);

const PositionOverTime = ({ positions }) => {
  // Check if positions is empty and display "No Data"
  if (positions.length === 0) {
    return <p className="no-data-message">No Data</p>;
  }

  // Extract labels (timestamps) and prices from positions
  const labels = positions.map((position) =>
    new Date(position.last_fill_time).toLocaleString()
  ); // Convert timestamps to readable dates
  // extract # total positions over time
  const positionPoints = positions.map((position) => {
    const posDate = new Date(position.last_fill_time);
    return {
      x: posDate.toLocaleString(),
      y: position.total_value_after_fees,
      type: position.side === 'BUY' ? 'Entry' : 'Exit',
    };
  });

  // Chart.js data configuration
  const data = {
    labels, // X-axis labels (timestamps)
    datasets: [
      {
        label: 'Positions',
        data: positionPoints.map((point) => ({
          x: point.x,
          y: point.y,
        })), // Overlay position points
        borderColor: 'transparent',
        backgroundColor: (context) =>
          positionPoints[context.dataIndex]?.type === 'Entry' ? 'blue' : 'red',
        pointRadius: 6,
        pointStyle: 'circle',
      },
    ],
  };

  // Chart.js options configuration
  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
        position: 'top',
      },
      tooltip: {
        callbacks: {
          label: (tooltipItem) => {
            const point = positionPoints[tooltipItem.dataIndex];
            return point
              ? `${point.type} at ${point.y}`
              : `$ Amt: ${tooltipItem.raw}`;
          },
        },
      },
    },
    scales: {
      x: {
        type: 'category',
        title: {
          display: true,
          text: 'Time',
        },
      },
      y: {
        title: {
          display: true,
          text: '$ Amt',
        },
      },
    },
  };

  return (
    <div className="position-over-time-container">
      <h2>Position Over Time</h2>
      <Line data={data} options={options} />
    </div>
  );
};

export default PositionOverTime;
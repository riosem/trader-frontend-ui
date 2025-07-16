import './PositionTable.css';
import React, { useState, useEffect } from 'react';

const PositionTable = ({ data }) => {
  const [lineChartData, setLineChartData] = useState({});
  const [barChartData, setBarChartData] = useState({});
  const [tableData, setTableData] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (data && data.length > 0) {
      try {
        const lineData = {
          labels: data.map((item) =>
            new Date(item.created_time).toLocaleString()
          ),
          datasets: [
            {
              label: 'Position Size',
              data: data.map((item) => parseFloat(item.filled_size)),
              borderColor: 'rgba(75, 192, 192, 1)',
              backgroundColor: 'rgba(75, 192, 192, 0.2)',
            },
          ],
        };

        const barData = {
          labels: data.map((item) =>
            new Date(item.created_time).toLocaleString()
          ),
          datasets: [
            {
              label: 'Realized PnL',
              data: data.map(
                (item) =>
                  parseFloat(item.total_value_after_fees) -
                  parseFloat(item.filled_value)
              ),
              backgroundColor: 'rgba(153, 102, 255, 0.2)',
              borderColor: 'rgba(153, 102, 255, 1)',
              borderWidth: 1,
            },
          ],
        };

        setLineChartData(lineData);
        setBarChartData(barData);
        setTableData(data);
      } catch (err) {
        setError('Error processing data');
        console.error(err);
      }
    }
  }, [data]); // Only re-run this effect when `data` changes

  // Check if data is empty and display "No Data"
  if (!data || data.length === 0) {
    return <p className="no-data-message">No Data</p>;
  }

  return (
    <div className="position-table-container">
      <h2 className="position-table-title">Table Metrics</h2>
      {error ? (
        <div className="error-message">Error: {error}</div>
      ) : (
        <div className="table-container">
          <table className="position-table">
            <thead>
              <tr>
                <th>Product ID</th>
                <th>Order ID</th>
                <th>Created Time</th>
                <th>Filled Size</th>
                <th>Total Value After Fees</th>
              </tr>
            </thead>
            <tbody>
              {tableData.map((item, index) => (
                <tr key={index}>
                  <td>{item.product_id}</td>
                  <td>{item.order_id}</td>
                  <td>{new Date(item.created_time).toLocaleString()}</td>
                  <td>{item.filled_size}</td>
                  <td>{item.total_value_after_fees}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default PositionTable;
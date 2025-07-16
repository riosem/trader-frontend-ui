import React, { useState, useEffect, useMemo } from "react";
import "./PositionKpis.css"; // Import your CSS file for styling

const KPICalculator = ({ data }) => {
  const [positions, setPositions] = useState([]);
  const [kpis, setKpis] = useState({});

  // Memoize filteredData to prevent unnecessary re-renders
  const filteredData = useMemo(() => {
    return data.filter((pos) => pos.last_fill_time);
  }, [data]);

  // Function to calculate KPIs
  const calculateKpis = (data) => {
    const totalFilledValue = data.reduce((sum, pos) => sum + parseFloat(pos.filled_value || 0), 0);
    const totalFees = data.reduce((sum, pos) => sum + parseFloat(pos.total_fees || 0), 0);

    const netPnL = totalFilledValue - totalFees;
    const pnlPercentage = (netPnL / totalFilledValue) * 100;

    const winningTrades = data.filter((pos) => parseFloat(pos.filled_value || 0) - parseFloat(pos.total_fees || 0) > 0).length;
    const winRate = (winningTrades / data.length) * 100;

    const gains = data.filter((pos) => parseFloat(pos.filled_value || 0) - parseFloat(pos.total_fees || 0) > 0).map((pos) => parseFloat(pos.filled_value || 0) - parseFloat(pos.total_fees || 0));
    const losses = data.filter((pos) => parseFloat(pos.filled_value || 0) - parseFloat(pos.total_fees || 0) < 0).map((pos) => Math.abs(parseFloat(pos.filled_value || 0) - parseFloat(pos.total_fees || 0)));

    const averageGain = gains.length > 0 ? gains.reduce((sum, gain) => sum + gain, 0) / gains.length : 0;
    const averageLoss = losses.length > 0 ? losses.reduce((sum, loss) => sum + loss, 0) / losses.length : 0;
    const riskRewardRatio = averageLoss !== 0 ? averageGain / averageLoss : null;

    const sharpeRatio = netPnL / Math.sqrt(data.map((pos) => parseFloat(pos.filled_value || 0)).reduce((sum, val) => sum + Math.pow(val - totalFilledValue, 2), 0));

    const cumulativePnL = data.reduce((acc, pos) => {
      const pnl = parseFloat(pos.filled_value || 0) - parseFloat(pos.total_fees || 0);
      acc.push((acc.length > 0 ? acc[acc.length - 1] : 0) + pnl);
      return acc;
    }, []);

    const maxDrawdown = cumulativePnL.reduce((max, value, index, arr) => {
      const maxPeak = Math.max(...arr.slice(0, index + 1));
      const drawdown = maxPeak - value;
      return drawdown > max ? drawdown : max;
    }, 0);

    const realizedPnL = data.filter((pos) => pos.status === "closed").reduce((sum, pos) => sum + (parseFloat(pos.filled_value || 0) - parseFloat(pos.total_fees || 0)), 0);
    const unrealizedPnL = data.filter((pos) => pos.status === "open").reduce((sum, pos) => sum + (parseFloat(pos.filled_value || 0) - parseFloat(pos.total_fees || 0)), 0);

    return {
      Net_PnL: netPnL,
      PnL_Percentage: pnlPercentage,
      Win_Rate: winRate,
      Risk_Reward_Ratio: riskRewardRatio,
      Sharpe_Ratio: sharpeRatio,
      Max_Drawdown: maxDrawdown,
      Realized_PnL: realizedPnL,
      Unrealized_PnL: unrealizedPnL,
    };
  };

  useEffect(() => {
    if (filteredData && filteredData.length > 0) {
      setPositions(filteredData);
    }
  }, [filteredData]);

  useEffect(() => {
    if (positions.length > 0) {
      const kpiResults = calculateKpis(positions);
      setKpis(kpiResults);
    }
  }, [positions]);

  // Check if positions is empty and display "No Data"
  if (positions.length === 0) {
    return <p className="no-data-message">No Data</p>;
  }

  return (
    <div className="kpi-calculator-container">
      <div className="kpi-content">
        <h2 className="kpi-subtitle">Key Performance Indicators</h2>
        {Object.keys(kpis).length > 0 ? (
          <ul className="kpi-list">
            {Object.entries(kpis).map(([key, value]) => (
              <li key={key} className="kpi-item">
                <strong>{key}:</strong> {value}
              </li>
            ))}
          </ul>
        ) : (
          <p className="kpi-loading">Loading data...</p>
        )}
      </div>
    </div>
  );
};

export default KPICalculator;
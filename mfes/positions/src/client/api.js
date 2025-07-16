import React from "react";
import { useState, useEffect } from "react";
import { scheduleData, positionData } from "./mockApi";

// Example mock data
const MOCK_SCHEDULES = [
  "schedule-1-BTC-USD-spot",
];

const MOCK_POSITIONS = [
  {
    product_id: "BTC-USD",
    order_id: "order-1",
    created_time: Date.now(),
    filled_size: 1,
    total_value_after_fees: 100,
    last_fill_time: Date.now(),
    price: 68000,
    side: "BUY",
    status: "closed"
  },
  {
    product_id: "ETH-USD",
    order_id: "order-2",
    created_time: Date.now(),
    filled_size: 2,
    total_value_after_fees: 200,
    last_fill_time: Date.now(),
    price: 3500,
    side: "SELL",
    status: "open"
  }
];

const PROXY_API_URL = process.env.PROXY_API_BASE_URL;

export const useSchedules = (token, useMock = false) => {
  const [schedules, setSchedules] = useState([]);

  useEffect(() => {
    if (useMock) {
      setSchedules(scheduleData);
      return;
    }

    const fetchSchedules = async () => {
      try {
        const url = `${PROXY_API_URL}/proxy/active-schedules`;
        const response = await fetch(url, {
          credentials: 'include',
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await response.json();
        setSchedules(data);
      } catch (error) {
        console.error("Error fetching schedules:", error);
      }
    };

    if (token) fetchSchedules();
  }, [token, useMock]);

  return schedules;
};

export const usePositions = (schedules, token, useMock = false) => {
  const [positions, setPositions] = useState([]);

  useEffect(() => {
    if (useMock) {
      setPositions(positionData);
      return;
    }

    const fetchPositions = async () => {
      if (!schedules || schedules.length === 0) return;

      try {
        const positionPromises = schedules.map((scheduleName) => {
          const parts = scheduleName.split('-');
          if (parts.length < 5) return null;
          const baseAsset = parts[2];
          const quoteAsset = parts[3];
          const productId = `${baseAsset}-${quoteAsset}`;
          return fetch(
            `${PROXY_API_URL}/proxy/providers/coinbase/products/${productId}/positions`,
            {
              credentials: 'include',
              headers: { Authorization: `Bearer ${token}` },
            }
          ).then((res) => res.json());
        });

        const allPositions = await Promise.all(positionPromises);
        const flatSorted = allPositions
          .flat()
          .sort((a, b) => new Date(a.created_time) - new Date(b.created_time));
        setPositions(flatSorted);
      } catch (error) {
        console.error("Error fetching positions:", error);
      }
    };

    fetchPositions();
  }, [schedules, token, useMock]);

  return positions;
};

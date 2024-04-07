// src/components/ViewLogisticsRequests.js
import React, { useEffect, useState } from 'react';
import API from '../api/api';

const ViewLogisticsRequests = () => {
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const response = await API.get('/logistics');
        setRequests(response.data);
      } catch (error) {
        console.error('Failed to fetch logistics requests:', error);
      }
    };

    fetchRequests();
  }, []);

  return (
    <div>
      <h2>My Logistics Requests</h2>
      <ul>
        {requests.map((request) => (
          <li key={request._id}>
            {request.description} - {request.status}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ViewLogisticsRequests;

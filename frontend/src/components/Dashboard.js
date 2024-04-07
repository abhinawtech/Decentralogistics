// Assuming axios is set up for API calls and useAuth hook is correctly configured
import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import axios from 'axios'; // Make sure axios is installed and configured

const Dashboard = () => {
  const { auth } = useAuth(); // Destructuring to directly access the auth object
  const [logisticsRequests, setLogisticsRequests] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Fetch logistics requests when the component mounts or the auth token changes
  useEffect(() => {
    const fetchLogisticsRequests = async () => {
      setIsLoading(true);
      setError('');
      try {
        // Adjust the URL to your API endpoint for fetching logistics requests
        const response = await axios.get('http://localhost:3000/api/logistics/my-logistics-requests', {
          headers: {
            Authorization: `Bearer ${auth?.token}`, // Optional chaining in case auth is null initially
          },
        });

        console.log('====================================');
        console.log(response.data);
        console.log('====================================');
        setLogisticsRequests(response.data); // Assuming the API returns an array of requests
      } catch (err) {
        console.error('Failed to fetch logistics requests:', err);
        setError('Failed to load logistics requests. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    if (auth?.token) {
      fetchLogisticsRequests();
    }
  }, [auth?.token]); // Dependency array to re-run the effect when the auth token changes

  return (
    <div>
      <h1>Welcome to the Dashboard, {auth?.user?.username}</h1>
      <nav>
        <ul>
          <li><Link to="/create-logistics-request">Create Logistics Request</Link></li>
          <li><Link to="/view-logistics-requests">View My Logistics Requests</Link></li>
          <li><Link to="/bid-management">Manage Bids</Link></li>
        </ul>
      </nav>
      <section>
        <h2>Your Logistics Requests</h2>
        {isLoading ? (
          <p>Loading logistics requests...</p>
        ) : error ? (
          <p className="error">{error}</p>
        ) : logisticsRequests.length > 0 ? (
          <ul>
            {logisticsRequests.map(request => (
              // Assuming each request has an id and a title
             
               <li key={request._id}>{request.description}</li>
            ))}
          </ul>
        ) : (
          <p>No logistics requests found. Start by creating a new one.</p>
        )}
      </section>
    </div>
  );
};

export default Dashboard;

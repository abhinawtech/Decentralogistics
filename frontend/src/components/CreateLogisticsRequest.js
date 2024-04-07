// src/components/CreateLogisticsRequest.js
import React, { useState } from 'react';
import API from '../api/api';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const CreateLogisticsRequest = () => {
  const [formData, setFormData] = useState({
    description: '',
    volume: '',
    origin: '',
    destination: '',
    timeline: '',
  });
  const navigate = useNavigate();
  const { auth } = useAuth(); 
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.post('/api/logistics/logistics-requests', formData, {
        headers: {
          Authorization: `Bearer ${auth?.token}`, // Optional chaining in case auth is null initially
        },
      });
    //    navigate('/api/view-logistics-requests');
    } catch (error) {
      console.error('Failed to create logistics request:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="text" name="description" placeholder="Description" value={formData.description} onChange={handleChange} required />
      <input type="number" name="volume" placeholder="Volume" value={formData.volume} onChange={handleChange} required />
      <input type="text" name="origin" placeholder="Origin" value={formData.origin} onChange={handleChange} required />
      <input type="text" name="destination" placeholder="Destination" value={formData.destination} onChange={handleChange} required />
      <input type="date" name="timeline" value={formData.timeline} onChange={handleChange} required />
      <button type="submit">Submit Request</button>
    </form>
  );
};

export default CreateLogisticsRequest;

// src/components/Register.js
import React, { useState } from 'react';
import API from '../api/api'; // This file should export an Axios instance configured with your backend's base URL

const Register = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    role: 'Shipper' // Default role; adjust as needed
  });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    try {
      await API.post('/api/users/signup', {
        username: formData.username,
        password: formData.password,
        role: formData.role,
      });
  
    } catch (error) {
      console.error('Registration failed:', error.response?.data || error.message);
     setError(error.response?.data.error || 'Failed to register');
    }
  };

  return (
    <div>
      {error && <p className="error">{error}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="username">Username</label>
          <input
            type="text"
            name="username"
            id="username"
            value={formData.username}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label htmlFor="password">Password</label>
          <input
            type="password"
            name="password"
            id="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label htmlFor="role">Role</label>
          <select
            name="role"
            id="role"
            value={formData.role}
            onChange={handleChange}
            required
          >
            <option value="Shipper">Shipper</option>
            <option value="Service Provider">Service Provider</option>
          </select>
        </div>
        <button type="submit">Register</button>
      </form>
    </div>
  );
};

export default Register;

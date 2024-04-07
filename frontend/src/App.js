// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Register from './components/Register';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import ProtectedRoute from './components/ProtectedRoute'; // Import the ProtectedRoute component
import { AuthProvider } from './context/AuthContext';
import { SolanaProvider } from './context/SolanaContext';
import CreateLogisticsRequest from './components/CreateLogisticsRequest';
import ViewLogisticsRequests from './components/ViewLogisticsRequests';
import ManageBidsComponent from './components/ManageBidsComponent';



const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/create-logistics-request" element={<CreateLogisticsRequest />} />
          <Route path="/view-logistics-requests" element={<ViewLogisticsRequests />} />
          <Route path="/bid-management" element={<ManageBidsComponent />} />
          <Route path="/manage-bids" element={<ManageBidsComponent />} />
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>

          } />
          {/* Define other routes here */}
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;

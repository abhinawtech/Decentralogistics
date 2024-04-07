import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import API from '../api/api';

const ManageBidsComponent = () => {
  const { auth } = useAuth();
  const [showSection, setShowSection] = useState(null);
  const [formData, setFormData] = useState({
    bidPoolId: '',
    logisticsId: '',
    amount: '',
    bidId: '', // For accepting or canceling bids
  });
  const [bidPools, setBidPools] = useState([]);
  const [bids, setBids] = useState([]);

  useEffect(() => {
    // Fetch bid pools and bids here
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({ ...prevData, [name]: value }));
  };

  const handleCreateBidPool = async (e) => {
    e.preventDefault();
    // API call to create bid pool
    try {
      await API.post('/create-bid-pool', {
        bidPoolId: formData.bidPoolId,
        logisticsId: formData.logisticsId,
      });
      // Fetch updated bid pools here
    } catch (error) {
      console.error('Error creating bid pool:', error);
    }
  };

  const handleSubmitBid = async (e) => {
    e.preventDefault();
    // API call to submit a bid
    try {
      await API.post('/submit-bid', {
        bidPoolId: formData.bidPoolId,
        amount: formData.amount,
      });
      // Fetch updated bids here
    } catch (error) {
      console.error('Error submitting bid:', error);
    }
  };

  const handleAcceptBid = async (bidId) => {
    // API call to accept a bid
    try {
      await API.post('/accept-bid', { bidId });
      // Fetch updated bids here
    } catch (error) {
      console.error('Error accepting bid:', error);
    }
  };

  const handleCancelBid = async (bidId) => {
    // API call to cancel a bid
    try {
      await API.post('/cancel-bid', { bidId });
      // Fetch updated bids here
    } catch (error) {
      console.error('Error canceling bid:', error);
    }
  };

  const renderSectionContent = () => {
    switch (showSection) {
      case 'createBidPool':
        return (
          <form onSubmit={handleCreateBidPool}>
            <input
              type="text"
              placeholder="Bid Pool ID"
              name="bidPoolId"
              value={formData.bidPoolId}
              onChange={handleInputChange}
            />
            <input
              type="text"
              placeholder="Logistics ID"
              name="logisticsId"
              value={formData.logisticsId}
              onChange={handleInputChange}
            />
            <button type="submit">Create Bid Pool</button>
          </form>
        );
      case 'submitBid':
        return (
          <form onSubmit={handleSubmitBid}>
            <input
              type="text"
              placeholder="Bid Pool ID"
              name="bidPoolId"
              value={formData.bidPoolId}
              onChange={handleInputChange}
            />
            <input
              type="number"
              placeholder="Amount"
              name="amount"
              value={formData.amount}
              onChange={handleInputChange}
            />
            <button type="submit">Submit Bid</button>
          </form>
        );
      case 'acceptBid':
        return bids.map((bid) => (
          <div key={bid.id}>
            {`Bid Amount: ${bid.amount}`}
            <button onClick={() => handleAcceptBid(bid.id)}>Accept</button>
          </div>
        ));
      case 'cancelBid':
        return bids.filter(bid => !bid.isAccepted).map((bid) => (
          <div key={bid.id}>
            {`Bid Amount: ${bid.amount}`}
            <button onClick={() => handleCancelBid(bid.id)}>Cancel</button>
          </div>
        ));
      default:
        return <div>Select an action above</div>;
    }
  };

  return (
    <div>
      {auth.user.role === 'Shipper' && (
        <div>
          <button onClick={() => setShowSection('createBidPool')}>Create Bid Pool</button>
          <button onClick={() => setShowSection('submitBid')}>Submit Bid</button>
          <button onClick={() => setShowSection('acceptBid')}>Accept Bid</button>
          <button onClick={() => setShowSection('cancelBid')}>Cancel Bid</button>
        </div>
      )}
      {auth.user.role === 'Service Provider' && (
        <div>
          <button onClick={() => setShowSection('submitBid')}>Submit Bid</button>
        </div>
      )}
      {renderSectionContent()}
    </div>
  );
};

export default ManageBidsComponent;

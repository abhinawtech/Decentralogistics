// src/components/CreateBidPoolComponent.js
import React, { useState } from 'react';
import { createBidPool } from '../solana/solana'; // Adjust the import path as necessary

const CreateBidPoolComponent = () => {
  const [bidPoolId, setBidPoolId] = useState('');
  const [logisticsId, setLogisticsId] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [createdPoolPublicKey, setCreatedPoolPublicKey] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const publicKey = await createBidPool(bidPoolId, logisticsId);
      setCreatedPoolPublicKey(publicKey.toString());
      alert('Bid Pool created successfully!');
    } catch (error) {
      console.error('Error creating bid pool:', error);
      alert('Failed to create bid pool.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <h2>Create a New Bid Pool</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>
            Bid Pool ID:
            <input
              type="text"
              value={bidPoolId}
              onChange={(e) => setBidPoolId(e.target.value)}
              required
            />
          </label>
        </div>
        <div>
          <label>
            Logistics ID:
            <input
              type="text"
              value={logisticsId}
              onChange={(e) => setLogisticsId(e.target.value)}
              required
            />
          </label>
        </div>
        <button type="submit" disabled={isLoading}>
          {isLoading ? 'Creating...' : 'Create Bid Pool'}
        </button>
      </form>
      {createdPoolPublicKey && <p>Created Pool Public Key: {createdPoolPublicKey}</p>}
    </div>
  );
};

export default CreateBidPoolComponent;

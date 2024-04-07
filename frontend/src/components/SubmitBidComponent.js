// src/components/SubmitBidComponent.js
import React, { useState, useEffect } from 'react';
import { submitBid } from '../solana/solana'; // Adjust the import path as necessary

const SubmitBidComponent = ({ bidPools }) => { // Assuming bidPools is passed as a prop for simplicity
  const [selectedPool, setSelectedPool] = useState('');
  const [amount, setAmount] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Assuming bidPools contains the necessary information to identify and submit to a bid pool
      const poolPublicKey = selectedPool; // Adjust according to how you identify pools
      await submitBid(poolPublicKey, amount);
      alert('Bid submitted successfully!');
    } catch (error) {
      console.error('Error submitting bid:', error);
      alert('Failed to submit bid.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <h2>Submit a Bid</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>
            Select Bid Pool:
            <select value={selectedPool} onChange={(e) => setSelectedPool(e.target.value)} required>
              <option value="">Select a pool</option>
              {bidPools.map((pool) => (
                <option key={pool.id} value={pool.publicKey}>
                  {pool.id}
                </option>
              ))}
            </select>
          </label>
        </div>
        <div>
          <label>
            Bid Amount:
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
            />
          </label>
        </div>
        <button type="submit" disabled={isLoading}>
          {isLoading ? 'Submitting...' : 'Submit Bid'}
        </button>
      </form>
    </div>
  );
};

export default SubmitBidComponent;

const express = require('express');
const { submitBid, createBidPool, acceptBid, cancelBid } = require('../solana/solana');
const router = express.Router();

// Endpoint to create a bid pool with logistics details
router.post('/create-bid-pool', async (req, res) => {
  try {
      const { bidPoolId, logisticsId } = req.body; // Expecting logisticsId from the request
      const bidPoolPublicKey = await createBidPool(bidPoolId, logisticsId); // Passing logisticsId to createBidPool
      res.json({ success: true, bidPoolPublicKey });
  } catch (error) {
      res.status(500).json({ success: false, error: error.message });
  }
});

// Endpoint to submit a bid with logistics details
router.post('/submit-bid', async (req, res) => {
  try {
      const { bidPoolPublicKey, amount, logisticsId } = req.body; // Now also includes logisticsId
      await submitBid(bidPoolPublicKey, amount, logisticsId); // Passing logisticsId to submitBid
      res.json({ success: true });
  } catch (error) {
      res.status(500).json({ success: false, error: error.message });
  }
});

// Endpoint to accept a bid remains unchanged
router.post('/accept-bid', async (req, res) => {
    try {
        const { bidPoolPublicKey, bidderPubkey } = req.body;
        await acceptBid(bidPoolPublicKey, bidderPubkey);
        res.json({ success: true, message: 'Bid accepted successfully.' });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Endpoint to cancel a bid remains unchanged
router.post('/cancel-bid', async (req, res) => {
    try {
        const { bidPoolPublicKey, bidderPubkey } = req.body;
        await cancelBid(bidPoolPublicKey, bidderPubkey);
        res.json({ success: true, message: 'Bid cancelled successfully.' });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

module.exports = router;

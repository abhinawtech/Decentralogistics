const express = require('express');
const LogisticsRequest = require('../models/LogisticsRequest');
const router = express.Router();

// Middleware to protect routes
const auth = require('../middleware/auth');
const checkRole = require('../middleware/checkRole'); 

// POST endpoint for creating a new logistics request
router.post('/', auth, async (req, res) => {
  try {
    const request = new LogisticsRequest({
      ...req.body,
      createdBy: req.user._id
    });
    await request.save();
    res.status(201).send(request);
  } catch (error) {
    res.status(400).send(error);
  }
});

// GET endpoint to fetch all logistics requests created by the authenticated user
router.get('/', auth, async (req, res) => {
  try {
    const requests = await LogisticsRequest.find({ createdBy: req.user._id });
    res.send(requests);
  } catch (error) {
    res.status(500).send(error);
  }
});

// Additional CRUD endpoints can be added here as necessary

// Update a logistics request
router.patch('/:id', auth, async (req, res) => {
    const updates = Object.keys(req.body);
    const allowedUpdates = ['description', 'volume', 'destination', 'timeline', 'status'];
    const isValidOperation = updates.every(update => allowedUpdates.includes(update));
  
    if (!isValidOperation) {
      return res.status(400).send({ error: 'Invalid updates!' });
    }
  
    try {
      const request = await LogisticsRequest.findOne({ _id: req.params.id, createdBy: req.user._id });
  
      if (!request) {
        return res.status(404).send();
      }
  
      updates.forEach(update => request[update] = req.body[update]);
      await request.save();
      res.send(request);
    } catch (error) {
      res.status(400).send(error);
    }
  });
// Delete a logistics request
router.delete('/:id', auth, async (req, res) => {
    try {
      const request = await LogisticsRequest.findOneAndDelete({ _id: req.params.id, createdBy: req.user._id });
  
      if (!request) {
        return res.status(404).send();
      }
  
      res.send(request);
    } catch (error) {
      res.status(500).send(error);
    }
  });  

// Endpoint for shippers to post a new logistics request
router.post('/logistics-requests', auth, checkRole('Shipper'), async (req, res) => {
  try {
    const logisticsRequest = new LogisticsRequest({
      ...req.body,
      createdBy: req.user._id
    });
    await logisticsRequest.save();
    res.status(201).send(logisticsRequest);
  } catch (error) {
    res.status(400).send(error);
  }
});

// Endpoint for shippers to view their own logistics requests
router.get('/my-logistics-requests', auth, checkRole('Shipper'), async (req, res) => {
  try {
    const logisticsRequests = await LogisticsRequest.find({ createdBy: req.user._id });
    res.send(logisticsRequests);
  } catch (error) {
    res.status(500).send(error);
  }
});

// Endpoint for service providers to view open logistics requests
router.get('/open-logistics-requests', auth, checkRole('Service Provider'), async (req, res) => {
  try {
    const openRequests = await LogisticsRequest.find({ status: 'open' });
    res.send(openRequests);
  } catch (error) {
    res.status(500).send(error);
  }
});

// Endpoint for updating the status of a logistics request
router.patch('/logistics-requests/:id/status', auth, async (req, res) => {
  try {
    const logisticsRequest = await LogisticsRequest.findOneAndUpdate(
      { _id: req.params.id, createdBy: req.user._id }, 
      { status: req.body.status }, 
      { new: true }
    );
    if (!logisticsRequest) {
      return res.status(404).send();
    }
    res.send(logisticsRequest);
  } catch (error) {
    res.status(400).send(error);
  }
});



module.exports = router;

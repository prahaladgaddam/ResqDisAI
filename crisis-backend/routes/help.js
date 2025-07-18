// crisis-backend/routes/help.js
const express = require('express');
const router = express.Router();
const HelpRequest = require('../models/HelpRequest');

// @route   POST api/help
// @desc    Submit a new help request
// @access  Public
router.post('/', async (req, res) => {
  const { description, location, phoneNumber, source, urgency, requestTypes, notes, reporterName, numPeople } = req.body;

  try {
    const newRequest = new HelpRequest({
      description,
      location,
      phoneNumber,
      source,
      urgency: urgency || 'request',
      requestTypes: requestTypes || [],
      notes: notes || '',
      reporterName: reporterName || '',
      numPeople: numPeople || 1
    });

    const helpRequest = await newRequest.save();
    res.status(201).json(helpRequest);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/help
// @desc    Get all help requests
// @access  Public (for now, will be private for admin)
router.get('/', async (req, res) => {
  try {
    const requests = await HelpRequest.find().sort({ createdAt: -1 });
    res.json(requests);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   PUT api/help/:id/status
// @desc    Update status of a help request
// @access  Private (for admin)
router.put('/:id/status', async (req, res) => {
  const { status } = req.body;
  try {
    let request = await HelpRequest.findById(req.params.id);

    if (!request) {
      return res.status(404).json({ msg: 'Help request not found' });
    }

    request.status = status;
    await request.save();
    res.json(request);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Help request not found' });
    }
    res.status(500).send('Server Error');
  }
});

// @route   PUT api/help/:id/urgency
// @desc    Update urgency level of a help request
// @access  Private (for admin/AI)
router.put('/:id/urgency', async (req, res) => {
  const { urgency } = req.body;
  try {
    let request = await HelpRequest.findById(req.params.id);

    if (!request) {
      return res.status(404).json({ msg: 'Help request not found' });
    }

    request.urgency = urgency;
    await request.save();
    res.json(request);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Help request not found' });
    }
    res.status(500).send('Server Error');
  }
});

module.exports = router;
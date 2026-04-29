const express = require('express');
const Appointment = require('../models/Appointment');
const User = require('../models/User');
const auth = require('../middleware/auth');
const router = express.Router();

// Create appointment
router.post('/', auth, async (req, res) => {
  try {
    const { doctorId, dateTime, duration, type, notes } = req.body;
    const appointment = await Appointment.create({
      patientId: req.user.id,
      doctorId,
      dateTime,
      duration: duration || 30,
      type: type || 'video',
      notes: notes || ''
    });

    const io = req.app.get('io');
    if (io) {
      io.to(`user-${doctorId}`).emit('new-appointment', appointment);
    }

    res.status(201).json(appointment);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get appointments
router.get('/', auth, async (req, res) => {
  try {
    const query = req.user.role === 'doctor' 
      ? { doctorId: req.user.id }
      : req.user.role === 'admin' ? {} : { patientId: req.user.id };
    
    const appointments = await Appointment.find(query)
      .populate('patientId', 'name email')
      .populate('doctorId', 'name email specialization')
      .sort({ dateTime: -1 });
    res.json(appointments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update appointment
router.put('/:id', auth, async (req, res) => {
  try {
    const appointment = await Appointment.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    ).populate('patientId', 'name email').populate('doctorId', 'name email');
    res.json(appointment);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get doctors list (for booking)
router.get('/doctors', auth, async (req, res) => {
  try {
    const doctors = await User.find({ role: 'doctor', status: 'active' })
      .select('name email specialization availability avatar');
    res.json(doctors);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;

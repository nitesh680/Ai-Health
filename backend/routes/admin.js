const express = require('express');
const User = require('../models/User');
const Message = require('../models/Message');
const Mood = require('../models/Mood');
const Appointment = require('../models/Appointment');
const AuditLog = require('../models/AuditLog');
const escalationService = require('../services/escalationService');
const auth = require('../middleware/auth');
const authorize = require('../middleware/role');
const router = express.Router();

// System analytics
router.get('/analytics', auth, authorize('admin'), async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const patients = await User.countDocuments({ role: 'patient' });
    const doctors = await User.countDocuments({ role: 'doctor' });
    const totalMessages = await Message.countDocuments();
    const totalAppointments = await Appointment.countDocuments();
    const activeUsers = await User.countDocuments({ isOnline: true });
    
    const recentMoods = await Mood.find().sort({ date: -1 }).limit(100);
    const avgMoodScore = recentMoods.length > 0 
      ? Math.round(recentMoods.reduce((s, m) => s + m.score, 0) / recentMoods.length) : 50;

    const highRiskMessages = await Message.countDocuments({ riskScore: { $gte: 70 } });
    const crisisAlerts = escalationService.getActiveAlerts();

    res.json({
      totalUsers, patients, doctors, totalMessages, totalAppointments,
      activeUsers, avgMoodScore, highRiskMessages, activeCrisisAlerts: crisisAlerts.length,
      crisisAlerts
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Audit logs
router.get('/audit-logs', auth, authorize('admin'), async (req, res) => {
  try {
    const { severity, limit = 50 } = req.query;
    const filter = {};
    if (severity) filter.severity = severity;

    const logs = await AuditLog.find(filter)
      .populate('userId', 'name email role')
      .sort({ createdAt: -1 })
      .limit(parseInt(limit));
    res.json(logs);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Crisis alerts
router.get('/crisis-alerts', auth, authorize('admin', 'doctor'), async (req, res) => {
  try {
    const alerts = escalationService.getAllAlerts();
    res.json(alerts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Acknowledge crisis alert
router.put('/crisis-alerts/:id/acknowledge', auth, authorize('admin', 'doctor'), async (req, res) => {
  try {
    const alert = escalationService.acknowledgeAlert(req.params.id, req.user.id);
    res.json(alert);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Chat logs (admin)
router.get('/chat-logs', auth, authorize('admin'), async (req, res) => {
  try {
    const { userId, limit = 50 } = req.query;
    const filter = {};
    if (userId) filter.senderId = userId;

    const messages = await Message.find(filter)
      .populate('senderId', 'name email role')
      .sort({ createdAt: -1 })
      .limit(parseInt(limit));
    res.json(messages);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;

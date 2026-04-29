const express = require('express');
const Mood = require('../models/Mood');
const auth = require('../middleware/auth');
const router = express.Router();

// Log mood
router.post('/', auth, async (req, res) => {
  try {
    const { score, label, emotions, notes, triggers, activities } = req.body;
    const mood = await Mood.create({
      userId: req.user.id,
      score,
      label,
      emotions: emotions || [],
      notes: notes || '',
      triggers: triggers || [],
      activities: activities || []
    });
    
    // Gamification
    const gamificationService = require('../services/gamificationService');
    await gamificationService.addPoints(req.user.id, 'mood_log');
    
    res.status(201).json(mood);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get mood history
router.get('/history', auth, async (req, res) => {
  try {
    const { days = 30 } = req.query;
    const since = new Date();
    since.setDate(since.getDate() - parseInt(days));
    
    const moods = await Mood.find({
      userId: req.user.id,
      date: { $gte: since }
    }).sort({ date: -1 });
    res.json(moods);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get mood analytics
router.get('/analytics', auth, async (req, res) => {
  try {
    const userId = req.query.userId || req.user.id;
    const moods = await Mood.find({ userId }).sort({ date: -1 }).limit(90);
    
    const avgScore = moods.length > 0 
      ? Math.round(moods.reduce((s, m) => s + m.score, 0) / moods.length) 
      : 50;
    
    const labelCounts = {};
    const emotionCounts = {};
    moods.forEach(m => {
      labelCounts[m.label] = (labelCounts[m.label] || 0) + 1;
      (m.emotions || []).forEach(e => { emotionCounts[e] = (emotionCounts[e] || 0) + 1; });
    });

    const trend = moods.length >= 7 
      ? moods.slice(0, 7).reduce((s, m) => s + m.score, 0) / 7 > 
        moods.slice(-7).reduce((s, m) => s + m.score, 0) / 7 ? 'improving' : 'declining'
      : 'stable';

    res.json({ avgScore, labelCounts, emotionCounts, trend, totalEntries: moods.length, recentMoods: moods.slice(0, 7) });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get patient mood (for doctors)
router.get('/patient/:patientId', auth, async (req, res) => {
  try {
    const moods = await Mood.find({ userId: req.params.patientId }).sort({ date: -1 }).limit(30);
    res.json(moods);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;

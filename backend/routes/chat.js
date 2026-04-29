const express = require('express');
const Message = require('../models/Message');
const aiService = require('../services/aiService');
const escalationService = require('../services/escalationService');
const auth = require('../middleware/auth');
const { v4: uuidv4 } = require('uuid');
const router = express.Router();

// AI Chat - Process message through AI pipeline
router.post('/ai', auth, async (req, res) => {
  try {
    const { message, sessionId, language } = req.body;
    const userId = req.user.id;
    const currentSession = sessionId || uuidv4();

    // Analyze the message
    const emotion = aiService.detectEmotion(message);
    const sentiment = aiService.analyzeSentiment(message);
    const riskScore = aiService.calculateRiskScore(message, emotion, sentiment);
    const crisis = aiService.detectCrisis(message);

    // Fetch recent conversation history for context (last 5 messages)
    const recentMessages = await Message.find({ 
      sessionId,
      $or: [
        { senderId: userId, type: 'user' },
        { senderId: null, receiverId: userId, type: 'ai' }
      ]
    })
    .sort({ createdAt: -1 })
    .limit(5)
    .lean();

    // Reverse to get chronological order
    recentMessages.reverse();

    // Save user message
    const userMsg = await Message.create({
      senderId: userId,
      content: message,
      type: 'user',
      sentiment,
      emotion,
      riskScore,
      sessionId: currentSession,
      language: language || 'en',
      metadata: { crisisDetected: crisis.detected }
    });

    // Generate AI response with conversation history
    const aiResponse = await aiService.generateResponse(message, emotion, sentiment, riskScore, language || 'en', recentMessages);

    // Save AI response
    const aiMsg = await Message.create({
      senderId: userId,
      content: aiResponse.message,
      type: 'ai',
      sentiment: 'positive',
      emotion: 'supportive',
      riskScore: 0,
      sessionId: currentSession,
      language: language || 'en'
    });

    // Handle crisis escalation
    if (crisis.detected) {
      const io = req.app.get('io');
      escalationService.createAlert(userId, currentSession, riskScore, crisis.phrase, io);
    }

    const stressLevel = aiService.calculateStressLevel(riskScore, emotion);

    res.json({
      userMessage: userMsg,
      aiMessage: aiMsg,
      analysis: { emotion, sentiment, riskScore, stressLevel, crisis: crisis.detected },
      response: aiResponse,
      sessionId: currentSession
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get chat history
router.get('/history/:sessionId', auth, async (req, res) => {
  try {
    const messages = await Message.find({ sessionId: req.params.sessionId })
      .sort({ createdAt: 1 })
      .limit(100);
    res.json(messages);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get user sessions
router.get('/sessions', auth, async (req, res) => {
  try {
    const sessions = await Message.aggregate([
      { $match: { senderId: require('mongoose').Types.ObjectId.createFromHexString(req.user.id), type: 'user' } },
      { $group: { _id: '$sessionId', lastMessage: { $last: '$content' }, date: { $last: '$createdAt' }, count: { $sum: 1 } } },
      { $sort: { date: -1 } },
      { $limit: 20 }
    ]);
    res.json(sessions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get session summary
router.get('/summary/:sessionId', auth, async (req, res) => {
  try {
    const messages = await Message.find({ sessionId: req.params.sessionId, type: 'user' });
    const summary = aiService.generateSessionSummary(messages);
    res.json({ summary, sessionId: req.params.sessionId });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Doctor-patient chat
router.post('/send', auth, async (req, res) => {
  try {
    const { receiverId, content, sessionId } = req.body;
    const msg = await Message.create({
      senderId: req.user.id,
      receiverId,
      content,
      type: req.user.role === 'doctor' ? 'doctor' : 'user',
      sessionId: sessionId || uuidv4()
    });

    const io = req.app.get('io');
    if (io) {
      io.to(`user-${receiverId}`).emit('new-message', msg);
    }

    res.status(201).json(msg);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get messages between two users
router.get('/direct/:userId', auth, async (req, res) => {
  try {
    const messages = await Message.find({
      $or: [
        { senderId: req.user.id, receiverId: req.params.userId },
        { senderId: req.params.userId, receiverId: req.user.id }
      ]
    }).sort({ createdAt: 1 }).limit(100);
    res.json(messages);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get latest stress level
router.get('/stress', auth, async (req, res) => {
  try {
    const latestMsg = await Message.findOne({ senderId: req.user.id, type: 'user' }).sort({ createdAt: -1 });
    if (!latestMsg) return res.json({ stressLevel: 'Low', riskScore: 0 });
    const stressLevel = aiService.calculateStressLevel(latestMsg.riskScore, latestMsg.emotion);
    res.json({ stressLevel, riskScore: latestMsg.riskScore, emotion: latestMsg.emotion });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;

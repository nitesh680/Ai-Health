const express = require('express');
const Journal = require('../models/Journal');
const aiService = require('../services/aiService');
const auth = require('../middleware/auth');
const router = express.Router();

// Create journal entry
router.post('/', auth, async (req, res) => {
  try {
    const { title, content, tags } = req.body;
    const emotion = aiService.detectEmotion(content);
    const sentiment = aiService.analyzeSentiment(content);
    
    const aiSummary = `Emotion: ${emotion} | Sentiment: ${sentiment} | ` +
      `This entry reflects ${emotion === 'neutral' ? 'a balanced state of mind' : `feelings of ${emotion}`}.`;

    const journal = await Journal.create({
      userId: req.user.id,
      title,
      content,
      aiSummary,
      emotion,
      tags: tags || []
    });
    
    // Gamification
    const gamificationService = require('../services/gamificationService');
    await gamificationService.addPoints(req.user.id, 'journal_entry');

    res.status(201).json(journal);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get journal entries
router.get('/', auth, async (req, res) => {
  try {
    const journals = await Journal.find({ userId: req.user.id }).sort({ createdAt: -1 });
    res.json(journals);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get journal prompts
router.get('/prompts', auth, (req, res) => {
  res.json({ prompts: aiService.getJournalPrompts() });
});

// Delete journal entry
router.delete('/:id', auth, async (req, res) => {
  try {
    await Journal.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
    res.json({ message: 'Journal entry deleted.' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;

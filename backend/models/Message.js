const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  senderId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  receiverId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  content: { type: String, required: true },
  type: { type: String, enum: ['user', 'ai', 'system', 'doctor'], default: 'user' },
  sentiment: { type: String, default: 'neutral', enum: ['positive', 'negative', 'neutral', 'mixed'] },
  emotion: { type: String, default: 'neutral' },
  riskScore: { type: Number, default: 0, min: 0, max: 100 },
  sessionId: { type: String, required: true },
  language: { type: String, default: 'en' },
  isRead: { type: Boolean, default: false },
  metadata: {
    crisisDetected: { type: Boolean, default: false },
    escalated: { type: Boolean, default: false },
    aiSummary: { type: String, default: '' }
  }
}, { timestamps: true });

messageSchema.index({ senderId: 1, sessionId: 1 });
messageSchema.index({ receiverId: 1, createdAt: -1 });

module.exports = mongoose.model('Message', messageSchema);

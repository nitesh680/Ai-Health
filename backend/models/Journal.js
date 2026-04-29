const mongoose = require('mongoose');

const journalSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  content: { type: String, required: true },
  aiSummary: { type: String, default: '' },
  emotion: { type: String, default: 'neutral' },
  tags: [{ type: String }],
  isPrivate: { type: Boolean, default: true },
  prompt: { type: String, default: '' }
}, { timestamps: true });

journalSchema.index({ userId: 1, createdAt: -1 });

module.exports = mongoose.model('Journal', journalSchema);

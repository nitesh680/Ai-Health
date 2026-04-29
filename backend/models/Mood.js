const mongoose = require('mongoose');

const moodSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  score: { type: Number, required: true, min: 0, max: 100 },
  label: { 
    type: String, 
    required: true, 
    enum: ['very_bad', 'bad', 'okay', 'good', 'great'] 
  },
  emotions: [{ type: String }],
  notes: { type: String, default: '' },
  triggers: [{ type: String }],
  activities: [{ type: String }],
  date: { type: Date, default: Date.now }
}, { timestamps: true });

moodSchema.index({ userId: 1, date: -1 });

module.exports = mongoose.model('Mood', moodSchema);

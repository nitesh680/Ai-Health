const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true, minlength: 6 },
  role: { type: String, enum: ['patient', 'doctor', 'admin'], default: 'patient' },
  avatar: { type: String, default: '' },
  phone: { type: String, default: '' },
  assignedDoctor: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  assignedPatients: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  specialization: { type: String, default: '' },
  language: { type: String, default: 'en', enum: ['en', 'hi', 'te'] },
  anonymousMode: { type: Boolean, default: false },
  privacyLock: { type: Boolean, default: false },
  streaks: { type: Number, default: 0 },
  lastActive: { type: Date, default: Date.now },
  status: { type: String, enum: ['active', 'inactive', 'suspended'], default: 'active' },
  isOnline: { type: Boolean, default: false },
  bio: { type: String, default: '' },
  trustedContacts: [{
    name: { type: String, required: true },
    email: { type: String },
    phone: { type: String, required: true },
    relation: { type: String, default: 'Family' },
    consentGiven: { type: Boolean, default: false }
  }],
  points: { type: Number, default: 0 },
  badges: [{ type: String }],
  availability: [{
    day: { type: String, enum: ['monday','tuesday','wednesday','thursday','friday','saturday','sunday'] },
    startTime: String,
    endTime: String
  }]
}, { timestamps: true });

userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

userSchema.methods.toJSON = function() {
  const obj = this.toObject();
  delete obj.password;
  return obj;
};

module.exports = mongoose.model('User', userSchema);

const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
  patientId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  doctorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  dateTime: { type: Date, required: true },
  duration: { type: Number, default: 30 },
  status: { 
    type: String, 
    enum: ['pending', 'confirmed', 'completed', 'cancelled'], 
    default: 'pending' 
  },
  type: { type: String, enum: ['video', 'chat', 'in-person'], default: 'video' },
  notes: { type: String, default: '' },
  prescription: { type: String, default: '' },
  summary: { type: String, default: '' }
}, { timestamps: true });

appointmentSchema.index({ patientId: 1, dateTime: -1 });
appointmentSchema.index({ doctorId: 1, dateTime: -1 });

module.exports = mongoose.model('Appointment', appointmentSchema);

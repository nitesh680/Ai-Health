import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { appointmentAPI } from '../../services/api';
import { Calendar, Clock, Plus, Trash2 } from 'lucide-react';

const Availability = () => {
  const [slots, setSlots] = useState([
    { day: 'monday', startTime: '09:00', endTime: '12:00' },
    { day: 'wednesday', startTime: '14:00', endTime: '18:00' },
    { day: 'friday', startTime: '10:00', endTime: '16:00' },
  ]);
  const [appointments, setAppointments] = useState([]);

  useEffect(() => {
    loadAppointments();
  }, []);

  const loadAppointments = async () => {
    try {
      const res = await appointmentAPI.getAll();
      setAppointments(res.data);
    } catch(err) { console.log('Demo mode'); }
  };

  const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

  const addSlot = () => {
    setSlots(prev => [...prev, { day: 'monday', startTime: '09:00', endTime: '17:00' }]);
  };

  const removeSlot = (index) => {
    setSlots(prev => prev.filter((_, i) => i !== index));
  };

  const updateSlot = (index, field, value) => {
    setSlots(prev => prev.map((s, i) => i === index ? { ...s, [field]: value } : s));
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <h1 className="text-3xl font-bold text-slate-800 dark:text-white flex items-center gap-3">
          <Calendar className="w-8 h-8 text-calm-500" /> Availability Schedule
        </h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1">Manage your appointment slots</p>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-slate-800 dark:text-white">Your Time Slots</h3>
          <button onClick={addSlot} className="btn-primary text-sm py-2 flex items-center gap-1">
            <Plus className="w-4 h-4" /> Add Slot
          </button>
        </div>
        <div className="space-y-3">
          {slots.map((slot, i) => (
            <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-700/50">
              <select value={slot.day} onChange={e => updateSlot(i, 'day', e.target.value)}
                className="input-field w-40 py-2 text-sm capitalize">
                {days.map(d => <option key={d} value={d} className="capitalize">{d}</option>)}
              </select>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-slate-400" />
                <input type="time" value={slot.startTime} onChange={e => updateSlot(i, 'startTime', e.target.value)} className="input-field w-32 py-2 text-sm" />
                <span className="text-slate-400">to</span>
                <input type="time" value={slot.endTime} onChange={e => updateSlot(i, 'endTime', e.target.value)} className="input-field w-32 py-2 text-sm" />
              </div>
              <button onClick={() => removeSlot(i)} className="p-2 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
        <button className="btn-primary w-full mt-4">Save Schedule</button>
      </motion.div>

      {/* Upcoming Appointments */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass-card p-6">
        <h3 className="font-semibold text-slate-800 dark:text-white mb-4">Upcoming Appointments</h3>
        {appointments.length === 0 ? (
          <p className="text-center text-slate-500 py-6">No upcoming appointments</p>
        ) : appointments.slice(0, 5).map((apt, i) => (
          <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-700/50 mb-2">
            <div className="w-10 h-10 rounded-xl bg-primary-50 dark:bg-primary-900/20 flex items-center justify-center">
              <Calendar className="w-5 h-5 text-primary-500" />
            </div>
            <div className="flex-1">
              <p className="font-medium text-sm text-slate-800 dark:text-white">{apt.patientId?.name || 'Patient'}</p>
              <p className="text-xs text-slate-500">{new Date(apt.dateTime).toLocaleString()}</p>
            </div>
            <span className="text-xs px-2 py-1 rounded-full bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 capitalize">{apt.status}</span>
          </div>
        ))}
      </motion.div>
    </div>
  );
};

export default Availability;

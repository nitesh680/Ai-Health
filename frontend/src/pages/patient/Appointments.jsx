import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { appointmentAPI } from '../../services/api';
import { Calendar, Clock, Video, MessageSquare, User, Plus, Check, X } from 'lucide-react';

const Appointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [showBook, setShowBook] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState('');
  const [dateTime, setDateTime] = useState('');
  const [type, setType] = useState('video');

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    try {
      const [apptRes, docRes] = await Promise.all([appointmentAPI.getAll(), appointmentAPI.getDoctors()]);
      setAppointments(apptRes.data);
      setDoctors(docRes.data);
    } catch (err) { console.log('Using demo data'); }
  };

  const handleBook = async () => {
    if (!selectedDoctor || !dateTime) return;
    try {
      await appointmentAPI.create({ doctorId: selectedDoctor, dateTime, type });
      setShowBook(false);
      loadData();
    } catch (err) {
      setAppointments(prev => [...prev, { _id: Date.now(), doctorId: { name: 'Dr. Smith' }, dateTime, type, status: 'pending', createdAt: new Date() }]);
      setShowBook(false);
    }
  };

  const statusColors = {
    pending: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
    confirmed: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
    completed: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
    cancelled: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
  };

  const typeIcons = { video: Video, chat: MessageSquare, 'in-person': User };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-3xl font-bold text-slate-800 dark:text-white flex items-center gap-3">
            <Calendar className="w-8 h-8 text-primary-500" /> Appointments
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Schedule and manage your therapy sessions</p>
        </motion.div>
        <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
          onClick={() => setShowBook(true)} className="btn-primary flex items-center gap-2">
          <Plus className="w-5 h-5" /> Book Session
        </motion.button>
      </div>

      {/* Booking Modal */}
      {showBook && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={() => setShowBook(false)}>
          <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }}
            className="w-full max-w-md bg-white dark:bg-slate-800 rounded-2xl shadow-2xl p-6" onClick={e => e.stopPropagation()}>
            <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-6">Book Appointment</h3>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 block">Select Doctor</label>
                <select value={selectedDoctor} onChange={e => setSelectedDoctor(e.target.value)} className="input-field">
                  <option value="">Choose a doctor...</option>
                  {doctors.map(d => <option key={d._id} value={d._id}>{d.name} - {d.specialization || 'General'}</option>)}
                </select>
              </div>
              <div>
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 block">Date & Time</label>
                <input type="datetime-local" value={dateTime} onChange={e => setDateTime(e.target.value)} className="input-field" />
              </div>
              <div>
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-3 block">Session Type</label>
                <div className="grid grid-cols-3 gap-3">
                  {['video', 'chat', 'in-person'].map(t => {
                    const Icon = typeIcons[t];
                    return (
                      <button key={t} onClick={() => setType(t)}
                        className={`p-3 rounded-xl border-2 text-center transition-all ${type === t ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20' : 'border-slate-200 dark:border-slate-700'}`}>
                        <Icon className={`w-5 h-5 mx-auto mb-1 ${type === t ? 'text-primary-500' : 'text-slate-400'}`} />
                        <p className="text-xs font-medium capitalize">{t}</p>
                      </button>
                    );
                  })}
                </div>
              </div>
              <div className="flex gap-3 pt-2">
                <button onClick={() => setShowBook(false)} className="btn-secondary flex-1">Cancel</button>
                <button onClick={handleBook} className="btn-primary flex-1">Confirm</button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* Appointments List */}
      <div className="space-y-4">
        {appointments.length === 0 ? (
          <div className="text-center py-16 glass-card">
            <Calendar className="w-16 h-16 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
            <p className="text-xl font-semibold text-slate-800 dark:text-white">No appointments yet</p>
            <p className="text-slate-500 dark:text-slate-400 mt-1">Book a session to get started</p>
          </div>
        ) : appointments.map((apt, i) => {
          const TypeIcon = typeIcons[apt.type] || Video;
          return (
            <motion.div key={apt._id} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
              className="glass-card p-5 flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-primary-50 dark:bg-primary-900/20 flex items-center justify-center">
                <TypeIcon className="w-7 h-7 text-primary-500" />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-slate-800 dark:text-white">{apt.doctorId?.name || 'Dr. Smith'}</p>
                <div className="flex items-center gap-3 mt-1">
                  <span className="text-sm text-slate-500 dark:text-slate-400 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    {new Date(apt.dateTime).toLocaleDateString()} at {new Date(apt.dateTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-semibold capitalize ${statusColors[apt.status] || statusColors.pending}`}>
                {apt.status}
              </span>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default Appointments;

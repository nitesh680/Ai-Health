import { useState } from 'react';
import { motion } from 'framer-motion';
import { Users, Search, MessageSquare, Activity, FileText, AlertTriangle } from 'lucide-react';
import MoodChart from '../../components/MoodChart';

const Patients = () => {
  const [search, setSearch] = useState('');
  const [selectedPatient, setSelectedPatient] = useState(null);

  const demoPatients = [
    { _id: '1', name: 'Alice Johnson', email: 'alice@email.com', riskLevel: 'low', mood: 72, emotions: ['calm', 'hopeful'], sessions: 12, lastActive: '2 hours ago' },
    { _id: '2', name: 'Bob Chen', email: 'bob@email.com', riskLevel: 'medium', mood: 45, emotions: ['anxious', 'stressed'], sessions: 8, lastActive: '1 hour ago' },
    { _id: '3', name: 'Carol White', email: 'carol@email.com', riskLevel: 'high', mood: 25, emotions: ['depressed', 'isolated'], sessions: 15, lastActive: '30 min ago' },
    { _id: '4', name: 'David Park', email: 'david@email.com', riskLevel: 'low', mood: 80, emotions: ['happy', 'grateful'], sessions: 6, lastActive: '3 hours ago' },
    { _id: '5', name: 'Emma Davis', email: 'emma@email.com', riskLevel: 'medium', mood: 55, emotions: ['stressed', 'tired'], sessions: 10, lastActive: '5 hours ago' },
  ];

  const riskColors = {
    low: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
    medium: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
    high: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
  };

  const filtered = demoPatients.filter(p => p.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <h1 className="text-3xl font-bold text-slate-800 dark:text-white flex items-center gap-3">
          <Users className="w-8 h-8 text-primary-500" /> My Patients
        </h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1">Monitor and manage your assigned patients</p>
      </motion.div>

      <div className="relative mb-6">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
        <input type="text" value={search} onChange={e => setSearch(e.target.value)}
          placeholder="Search patients..." className="input-field pl-12" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-3">
          {filtered.map((patient, i) => (
            <motion.div key={patient._id} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
              onClick={() => setSelectedPatient(patient)}
              className={`glass-card p-5 cursor-pointer hover:shadow-xl transition-all ${selectedPatient?._id === patient._id ? 'ring-2 ring-primary-500' : ''}`}>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary-400 to-calm-400 flex items-center justify-center text-white font-bold">
                  {patient.name.charAt(0)}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <p className="font-semibold text-slate-800 dark:text-white">{patient.name}</p>
                    {patient.riskLevel === 'high' && <AlertTriangle className="w-4 h-4 text-red-500" />}
                  </div>
                  <p className="text-sm text-slate-500">{patient.email} · {patient.sessions} sessions</p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-slate-800 dark:text-white">{patient.mood}</p>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${riskColors[patient.riskLevel]}`}>{patient.riskLevel} risk</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Patient Detail */}
        <div className="lg:col-span-1">
          {selectedPatient ? (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="glass-card p-6 sticky top-4">
              <div className="text-center mb-4">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary-400 to-calm-400 flex items-center justify-center text-white text-2xl font-bold mx-auto mb-3">
                  {selectedPatient.name.charAt(0)}
                </div>
                <h3 className="font-bold text-slate-800 dark:text-white">{selectedPatient.name}</h3>
                <p className="text-sm text-slate-500">{selectedPatient.email}</p>
                <span className={`inline-block mt-2 text-xs px-3 py-1 rounded-full ${riskColors[selectedPatient.riskLevel]}`}>{selectedPatient.riskLevel} risk</span>
              </div>

              <div className="space-y-3 mb-4">
                <div className="flex justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-700/50">
                  <span className="text-sm text-slate-600 dark:text-slate-400">Mood Score</span>
                  <span className="font-bold text-slate-800 dark:text-white">{selectedPatient.mood}/100</span>
                </div>
                <div className="flex justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-700/50">
                  <span className="text-sm text-slate-600 dark:text-slate-400">Sessions</span>
                  <span className="font-bold text-slate-800 dark:text-white">{selectedPatient.sessions}</span>
                </div>
                <div className="flex justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-700/50">
                  <span className="text-sm text-slate-600 dark:text-slate-400">Last Active</span>
                  <span className="font-bold text-slate-800 dark:text-white">{selectedPatient.lastActive}</span>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 mb-4">
                {selectedPatient.emotions.map(e => (
                  <span key={e} className="text-xs px-2.5 py-1 rounded-full bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400">{e}</span>
                ))}
              </div>

              <h4 className="text-sm font-semibold text-slate-800 dark:text-white mb-2">Mood Trend</h4>
              <MoodChart data={[]} height={150} />

              <div className="flex gap-2 mt-4">
                <button className="btn-primary flex-1 text-sm py-2 flex items-center justify-center gap-1">
                  <MessageSquare className="w-4 h-4" /> Chat
                </button>
                <button className="btn-secondary flex-1 text-sm py-2 flex items-center justify-center gap-1">
                  <FileText className="w-4 h-4" /> Report
                </button>
              </div>
            </motion.div>
          ) : (
            <div className="glass-card p-6 text-center">
              <Activity className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
              <p className="text-slate-500 dark:text-slate-400">Select a patient to view details</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Patients;

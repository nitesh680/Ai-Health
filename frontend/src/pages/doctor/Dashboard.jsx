import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { adminAPI, appointmentAPI, userAPI } from '../../services/api';
import StatsCard from '../../components/StatsCard';
import { Users, AlertTriangle, Activity, Stethoscope, Calendar, MessageSquare, Brain, Bell, Pill, ChevronRight, Heart, FileText, Send, X } from 'lucide-react';

const DoctorDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({ patientsCount: 5, alertsCount: 0, appointments: [] });
  const [alerts, setAlerts] = useState([]);
  const [patients, setPatients] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [medicineForm, setMedicineForm] = useState({ medicine: '', dosage: '', frequency: '', notes: '' });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [apptRes, alertsRes, patientsRes] = await Promise.all([
        appointmentAPI.getAll(),
        adminAPI.getCrisisAlerts(),
        userAPI.getPatients()
      ]);
      setStats(prev => ({ ...prev, appointments: apptRes.data }));
      setAlerts(alertsRes.data?.filter(a => a.status === 'active') || []);
      setPatients(patientsRes.data || []);
    } catch (err) {
      console.log('Demo mode');
      setPatients(demoPatients);
    } finally {
      setLoading(false);
    }
  };

  const demoPatients = [
    { 
      id: 1,
      name: 'Alice Johnson', 
      age: 28,
      gender: 'Female',
      riskLevel: 'low', 
      lastMood: 72, 
      lastActive: '2 hours ago',
      symptoms: ['Mild anxiety', 'Difficulty sleeping'],
      medications: [],
      healthHistory: ['Anxiety disorder - 2023', 'Insomnia episodes'],
      notes: 'Responding well to therapy'
    },
    { 
      id: 2,
      name: 'Bob Chen', 
      age: 34,
      gender: 'Male',
      riskLevel: 'medium', 
      lastMood: 45, 
      lastActive: '1 hour ago',
      symptoms: ['Stress', 'Headaches', 'Fatigue'],
      medications: ['Paracetamol - as needed'],
      healthHistory: ['Work-related stress', 'Hypertension'],
      notes: 'High work stress, needs monitoring'
    },
    { 
      id: 3,
      name: 'Carol White', 
      age: 22,
      gender: 'Female',
      riskLevel: 'high', 
      lastMood: 25, 
      lastActive: '30 min ago',
      symptoms: ['Depression', 'Social withdrawal', 'Loss of appetite'],
      medications: ['Sertraline 50mg - daily'],
      healthHistory: ['Major depression episode - 2024', 'Previous suicidal ideation'],
      notes: 'Requires close monitoring'
    },
    { 
      id: 4,
      name: 'David Park', 
      age: 41,
      gender: 'Male',
      riskLevel: 'low', 
      lastMood: 80, 
      lastActive: '3 hours ago',
      symptoms: [],
      medications: [],
      healthHistory: ['Fully recovered from burnout'],
      notes: 'Stable, maintenance phase'
    },
  ];

  const riskColors = {
    low: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
    medium: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
    high: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <h1 className="text-3xl font-bold text-slate-800 dark:text-white">
          Welcome, Dr. {user?.name?.split(' ').pop() || 'Doctor'} 👨‍⚕️
        </h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1">Your patient monitoring dashboard</p>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatsCard icon={Users} label="Active Patients" value={user?.assignedPatients?.length || 5} color="primary" delay={1} />
        <StatsCard icon={AlertTriangle} label="Crisis Alerts" value={alerts.length} color="red" delay={2} />
        <StatsCard icon={Calendar} label="Today's Sessions" value={stats.appointments.length || 3} color="calm" delay={3} />
        <StatsCard icon={Activity} label="Avg Patient Mood" value="62" trend="up" color="lavender" delay={4} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Active Alerts */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-6">
          <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-4 flex items-center gap-2">
            <Bell className="w-5 h-5 text-red-500" /> Active Alerts
          </h3>
          {alerts.length === 0 ? (
            <div className="text-center py-6">
              <div className="w-16 h-16 rounded-full bg-green-50 dark:bg-green-900/20 flex items-center justify-center mx-auto mb-3">
                <Activity className="w-8 h-8 text-green-500" />
              </div>
              <p className="text-slate-600 dark:text-slate-400">No active crisis alerts</p>
              <p className="text-sm text-slate-400 dark:text-slate-500">All patients are stable</p>
            </div>
          ) : alerts.map((alert, i) => (
            <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-red-50 dark:bg-red-900/10 mb-2 border border-red-100 dark:border-red-800/30">
              <AlertTriangle className="w-5 h-5 text-red-500 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-red-700 dark:text-red-400">Risk Score: {alert.riskScore}</p>
                <p className="text-xs text-red-500 truncate">"{alert.crisisPhrase}"</p>
              </div>
            </div>
          ))}
        </motion.div>

        {/* Patient List */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass-card p-6">
          <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-4 flex items-center gap-2">
            <Users className="w-5 h-5 text-primary-500" /> Patient Overview
          </h3>
          <div className="space-y-3">
            {patients.length > 0 ? patients.map((patient, i) => (
              <motion.div key={patient._id || i} whileHover={{ x: 4 }} onClick={() => setSelectedPatient(patient)}
                className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-700/50 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors cursor-pointer">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-400 to-calm-400 flex items-center justify-center text-white font-bold text-sm">
                  {patient.name?.charAt(0) || '?'}
                </div>
                <div className="flex-1">
                  <p className="font-medium text-sm text-slate-800 dark:text-white">{patient.name || 'Unknown'}</p>
                  <p className="text-xs text-slate-500">{patient.lastActive || 'Recently'} • {patient.age || '--'} years • {patient.gender || '--'}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-slate-800 dark:text-white">{patient.lastMood || '--'}/100</p>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${riskColors[patient.riskLevel] || riskColors.low}`}>{patient.riskLevel || 'low'}</span>
                </div>
                <ChevronRight className="w-5 h-5 text-slate-400" />
              </motion.div>
            )) : (
              <div className="text-center py-8 text-slate-500">
                <Users className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p>No patients found. New registrations will appear here.</p>
              </div>
            )}
          </div>
        </motion.div>
      </div>
      {/* Patient Detail Modal */}
      <AnimatePresence>
        {selectedPatient && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          >
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="glass-card p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            >
              {/* Header */}
              <div className="flex justify-between items-start mb-6">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary-400 to-calm-400 flex items-center justify-center text-white font-bold text-2xl">
                    {selectedPatient.name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-800 dark:text-white">{selectedPatient.name}</h3>
                    <p className="text-slate-500 dark:text-slate-400">{selectedPatient.age} years • {selectedPatient.gender}</p>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${riskColors[selectedPatient.riskLevel]}`}>{selectedPatient.riskLevel} risk</span>
                  </div>
                </div>
                <button onClick={() => {setSelectedPatient(null); setMedicineForm({ medicine: '', dosage: '', frequency: '', notes: '' });}} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full">
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Health Stats */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="p-4 bg-slate-50 dark:bg-slate-700/50 rounded-xl">
                  <div className="flex items-center gap-2 mb-2">
                    <Heart className="w-5 h-5 text-red-500" />
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Mood Score</span>
                  </div>
                  <p className="text-2xl font-bold text-slate-800 dark:text-white">{selectedPatient.lastMood}/100</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-slate-700/50 rounded-xl">
                  <div className="flex items-center gap-2 mb-2">
                    <Activity className="w-5 h-5 text-green-500" />
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Last Active</span>
                  </div>
                  <p className="text-lg font-bold text-slate-800 dark:text-white">{selectedPatient.lastActive}</p>
                </div>
              </div>

              {/* Symptoms */}
              <div className="mb-6">
                <h4 className="font-semibold text-slate-800 dark:text-white mb-3 flex items-center gap-2">
                  <Brain className="w-5 h-5 text-purple-500" /> Current Symptoms
                </h4>
                <div className="flex flex-wrap gap-2">
                  {selectedPatient.symptoms?.length > 0 ? selectedPatient.symptoms.map((symptom, i) => (
                    <span key={i} className="px-3 py-1 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 rounded-full text-sm">{symptom}</span>
                  )) : (
                    <span className="text-slate-500 dark:text-slate-400 text-sm">No current symptoms</span>
                  )}
                </div>
              </div>

              {/* Health History */}
              <div className="mb-6">
                <h4 className="font-semibold text-slate-800 dark:text-white mb-3 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-blue-500" /> Health History
                </h4>
                <ul className="space-y-2">
                  {selectedPatient.healthHistory?.map((item, i) => (
                    <li key={i} className="text-sm text-slate-600 dark:text-slate-400 flex items-center gap-2">
                      <div className="w-2 h-2 bg-slate-400 rounded-full"></div>{item}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Current Medications */}
              <div className="mb-6">
                <h4 className="font-semibold text-slate-800 dark:text-white mb-3 flex items-center gap-2">
                  <Pill className="w-5 h-5 text-green-500" /> Current Medications
                </h4>
                <div className="flex flex-wrap gap-2">
                  {selectedPatient.medications?.length > 0 ? selectedPatient.medications.map((med, i) => (
                    <span key={i} className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-full text-sm">{med}</span>
                  )) : (
                    <span className="text-slate-500 dark:text-slate-400 text-sm">No current medications</span>
                  )}
                </div>
              </div>

              {/* Doctor Notes */}
              <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
                <h4 className="font-semibold text-slate-800 dark:text-white mb-2 flex items-center gap-2">
                  <Stethoscope className="w-5 h-5 text-blue-500" /> Doctor Notes
                </h4>
                <p className="text-sm text-slate-600 dark:text-slate-400">{selectedPatient.notes}</p>
              </div>

              {/* Suggest Medicine Form */}
              <div className="border-t border-slate-200 dark:border-slate-700 pt-6">
                <h4 className="font-semibold text-slate-800 dark:text-white mb-4 flex items-center gap-2">
                  <Pill className="w-5 h-5 text-primary-500" /> Suggest Medicine
                </h4>
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <input
                      type="text"
                      placeholder="Medicine name"
                      value={medicineForm.medicine}
                      onChange={(e) => setMedicineForm(prev => ({ ...prev, medicine: e.target.value }))}
                      className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-800 dark:text-white focus:ring-2 focus:ring-primary-500 focus:outline-none"
                    />
                    <input
                      type="text"
                      placeholder="Dosage (e.g., 50mg)"
                      value={medicineForm.dosage}
                      onChange={(e) => setMedicineForm(prev => ({ ...prev, dosage: e.target.value }))}
                      className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-800 dark:text-white focus:ring-2 focus:ring-primary-500 focus:outline-none"
                    />
                  </div>
                  <input
                    type="text"
                    placeholder="Frequency (e.g., Once daily, Twice daily)"
                    value={medicineForm.frequency}
                    onChange={(e) => setMedicineForm(prev => ({ ...prev, frequency: e.target.value }))}
                    className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-800 dark:text-white focus:ring-2 focus:ring-primary-500 focus:outline-none"
                  />
                  <textarea
                    placeholder="Additional notes for patient..."
                    value={medicineForm.notes}
                    onChange={(e) => setMedicineForm(prev => ({ ...prev, notes: e.target.value }))}
                    className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-800 dark:text-white focus:ring-2 focus:ring-primary-500 focus:outline-none resize-none h-20"
                  />
                  <button
                    onClick={() => {
                      if (medicineForm.medicine && medicineForm.dosage) {
                        alert(`Medicine suggestion sent to ${selectedPatient.name}:\n${medicineForm.medicine} ${medicineForm.dosage} - ${medicineForm.frequency}\nNotes: ${medicineForm.notes || 'None'}`);
                        setMedicineForm({ medicine: '', dosage: '', frequency: '', notes: '' });
                      }
                    }}
                    disabled={!medicineForm.medicine || !medicineForm.dosage}
                    className="w-full btn-primary bg-gradient-to-r from-primary-500 to-calm-500 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Send className="w-4 h-4" />
                    Send Medicine Suggestion
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default DoctorDashboard;

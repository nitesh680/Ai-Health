import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { adminAPI } from '../../services/api';
import { AlertTriangle, Check, Clock, User, MessageSquare } from 'lucide-react';

const CrisisAlerts = () => {
  const [alerts, setAlerts] = useState([]);

  useEffect(() => { loadAlerts(); }, []);

  const loadAlerts = async () => {
    try {
      const res = await adminAPI.getCrisisAlerts();
      setAlerts(res.data);
    } catch(err) {
      setAlerts([
        { id: '1', userId: 'usr1', riskScore: 85, crisisPhrase: 'i feel hopeless', status: 'active', createdAt: new Date(Date.now() - 900000) },
        { id: '2', userId: 'usr2', riskScore: 92, crisisPhrase: 'i want to end it', status: 'active', createdAt: new Date(Date.now() - 3600000) },
        { id: '3', userId: 'usr3', riskScore: 75, crisisPhrase: 'no reason to live', status: 'acknowledged', createdAt: new Date(Date.now() - 7200000), acknowledgedAt: new Date(Date.now() - 6000000) },
        { id: '4', userId: 'usr4', riskScore: 70, crisisPhrase: 'i want to disappear', status: 'resolved', createdAt: new Date(Date.now() - 86400000), resolvedAt: new Date(Date.now() - 84000000) },
      ]);
    }
  };

  const handleAcknowledge = async (id) => {
    try { await adminAPI.acknowledgeCrisis(id); } catch (err) {}
    setAlerts(prev => prev.map(a => a.id === id ? { ...a, status: 'acknowledged', acknowledgedAt: new Date() } : a));
  };

  const statusStyles = {
    active: 'bg-red-50 dark:bg-red-900/10 border-red-200 dark:border-red-800/30',
    acknowledged: 'bg-amber-50 dark:bg-amber-900/10 border-amber-200 dark:border-amber-800/30',
    resolved: 'bg-green-50 dark:bg-green-900/10 border-green-200 dark:border-green-800/30',
  };
  const statusBadge = {
    active: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
    acknowledged: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
    resolved: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <h1 className="text-3xl font-bold text-slate-800 dark:text-white flex items-center gap-3">
          <AlertTriangle className="w-8 h-8 text-red-500" /> Crisis Alerts
        </h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1">Monitor and respond to high-risk patient alerts</p>
      </motion.div>

      {/* Active count */}
      <div className="flex gap-4 mb-6">
        {['active', 'acknowledged', 'resolved'].map(s => {
          const count = alerts.filter(a => a.status === s).length;
          return (
            <div key={s} className={`glass-card px-5 py-3 flex items-center gap-3`}>
              <div className={`w-3 h-3 rounded-full ${s === 'active' ? 'bg-red-500 animate-pulse' : s === 'acknowledged' ? 'bg-amber-500' : 'bg-green-500'}`} />
              <div>
                <p className="text-2xl font-bold text-slate-800 dark:text-white">{count}</p>
                <p className="text-xs text-slate-500 capitalize">{s}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Alerts */}
      <div className="space-y-4">
        {alerts.map((alert, i) => (
          <motion.div key={alert.id} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
            className={`rounded-2xl border p-5 ${statusStyles[alert.status]}`}>
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-4">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
                  alert.status === 'active' ? 'bg-red-100 dark:bg-red-900/30' : 'bg-slate-100 dark:bg-slate-700'
                }`}>
                  <AlertTriangle className={`w-6 h-6 ${alert.status === 'active' ? 'text-red-500 animate-pulse' : 'text-slate-400'}`} />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-bold text-slate-800 dark:text-white">Risk Score: {alert.riskScore}</span>
                    <span className={`text-xs px-2.5 py-0.5 rounded-full font-medium capitalize ${statusBadge[alert.status]}`}>{alert.status}</span>
                  </div>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">
                    <MessageSquare className="w-3.5 h-3.5 inline mr-1" />
                    Detected phrase: "<span className="font-medium">{alert.crisisPhrase}</span>"
                  </p>
                  <div className="flex items-center gap-3 text-xs text-slate-500">
                    <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{new Date(alert.createdAt).toLocaleString()}</span>
                    {alert.acknowledgedAt && <span>Acknowledged: {new Date(alert.acknowledgedAt).toLocaleTimeString()}</span>}
                  </div>
                </div>
              </div>
              {alert.status === 'active' && (
                <button onClick={() => handleAcknowledge(alert.id)}
                  className="btn-primary text-sm py-2 flex items-center gap-1">
                  <Check className="w-4 h-4" /> Acknowledge
                </button>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default CrisisAlerts;

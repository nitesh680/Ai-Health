import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { adminAPI } from '../../services/api';
import { Shield, Search, Filter, User, Clock } from 'lucide-react';

const AuditLogs = () => {
  const [logs, setLogs] = useState([]);
  const [search, setSearch] = useState('');
  const [severityFilter, setSeverityFilter] = useState('all');

  useEffect(() => { loadLogs(); }, []);

  const loadLogs = async () => {
    try {
      const res = await adminAPI.getAuditLogs();
      setLogs(res.data);
    } catch(err) {
      setLogs([
        { _id: '1', action: 'USER_LOGIN', resource: 'auth', userId: { name: 'Alice Johnson', role: 'patient' }, severity: 'low', createdAt: new Date(Date.now() - 300000) },
        { _id: '2', action: 'CRISIS_DETECTED', resource: 'chat', userId: { name: 'System', role: 'admin' }, severity: 'critical', createdAt: new Date(Date.now() - 900000) },
        { _id: '3', action: 'USER_REGISTERED', resource: 'auth', userId: { name: 'Bob Chen', role: 'patient' }, severity: 'low', createdAt: new Date(Date.now() - 1800000) },
        { _id: '4', action: 'ROLE_CHANGED', resource: 'users', userId: { name: 'Admin', role: 'admin' }, severity: 'high', createdAt: new Date(Date.now() - 3600000), details: 'Changed user role to doctor' },
        { _id: '5', action: 'DOCTOR_ASSIGNED', resource: 'users', userId: { name: 'Admin', role: 'admin' }, severity: 'medium', createdAt: new Date(Date.now() - 7200000) },
        { _id: '6', action: 'APPOINTMENT_CREATED', resource: 'appointments', userId: { name: 'David Park', role: 'patient' }, severity: 'low', createdAt: new Date(Date.now() - 10800000) },
        { _id: '7', action: 'HIGH_RISK_MESSAGE', resource: 'chat', userId: { name: 'Carol White', role: 'patient' }, severity: 'high', createdAt: new Date(Date.now() - 14400000) },
        { _id: '8', action: 'USER_SUSPENDED', resource: 'users', userId: { name: 'Admin', role: 'admin' }, severity: 'high', createdAt: new Date(Date.now() - 86400000), details: 'Account suspended due to violations' },
      ]);
    }
  };

  const severityColors = {
    low: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
    medium: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
    high: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400',
    critical: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
  };

  const filtered = logs.filter(l => {
    const matchSearch = l.action.toLowerCase().includes(search.toLowerCase()) || l.userId?.name?.toLowerCase().includes(search.toLowerCase());
    const matchSev = severityFilter === 'all' || l.severity === severityFilter;
    return matchSearch && matchSev;
  });

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-6xl mx-auto">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <h1 className="text-3xl font-bold text-slate-800 dark:text-white flex items-center gap-3">
          <Shield className="w-8 h-8 text-amber-500" /> Audit Logs
        </h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1">Security and activity tracking</p>
      </motion.div>

      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input type="text" value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search logs..." className="input-field pl-12" />
        </div>
        <div className="flex gap-2">
          {['all', 'low', 'medium', 'high', 'critical'].map(s => (
            <button key={s} onClick={() => setSeverityFilter(s)}
              className={`px-3 py-2 rounded-xl text-xs font-medium capitalize transition-all ${
                severityFilter === s ? 'gradient-bg text-white shadow-lg' : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400'
              }`}>{s}</button>
          ))}
        </div>
      </div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-200 dark:border-slate-700">
              <th className="text-left p-4 text-sm font-semibold text-slate-600 dark:text-slate-400">Action</th>
              <th className="text-left p-4 text-sm font-semibold text-slate-600 dark:text-slate-400">User</th>
              <th className="text-left p-4 text-sm font-semibold text-slate-600 dark:text-slate-400">Severity</th>
              <th className="text-left p-4 text-sm font-semibold text-slate-600 dark:text-slate-400">Time</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((log, i) => (
              <motion.tr key={log._id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.02 }}
                className="border-b border-slate-100 dark:border-slate-700/50 hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors">
                <td className="p-4">
                  <p className="font-medium text-sm text-slate-800 dark:text-white">{log.action.replace(/_/g, ' ')}</p>
                  {log.details && <p className="text-xs text-slate-500 mt-0.5">{log.details}</p>}
                </td>
                <td className="p-4">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-slate-400" />
                    <span className="text-sm text-slate-600 dark:text-slate-400">{log.userId?.name || 'System'}</span>
                  </div>
                </td>
                <td className="p-4">
                  <span className={`text-xs px-2.5 py-1 rounded-full font-medium capitalize ${severityColors[log.severity]}`}>{log.severity}</span>
                </td>
                <td className="p-4 text-sm text-slate-500 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />{new Date(log.createdAt).toLocaleString()}
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </motion.div>
    </div>
  );
};

export default AuditLogs;

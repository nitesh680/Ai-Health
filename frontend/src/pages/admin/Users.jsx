import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { userAPI } from '../../services/api';
import { UserCog, Search, Shield, Stethoscope, Heart, MoreVertical, Edit, Ban, UserCheck } from 'lucide-react';

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');

  useEffect(() => { loadUsers(); }, []);

  const loadUsers = async () => {
    try {
      const res = await userAPI.getAll();
      setUsers(res.data);
    } catch(err) {
      setUsers([
        { _id: '1', name: 'Alice Johnson', email: 'alice@email.com', role: 'patient', status: 'active', createdAt: '2024-01-15' },
        { _id: '2', name: 'Dr. Sarah Lee', email: 'sarah@email.com', role: 'doctor', status: 'active', createdAt: '2024-01-10' },
        { _id: '3', name: 'Bob Chen', email: 'bob@email.com', role: 'patient', status: 'active', createdAt: '2024-02-01' },
        { _id: '4', name: 'Dr. James Wilson', email: 'james@email.com', role: 'doctor', status: 'active', createdAt: '2024-01-12' },
        { _id: '5', name: 'Carol White', email: 'carol@email.com', role: 'patient', status: 'suspended', createdAt: '2024-02-15' },
        { _id: '6', name: 'Admin User', email: 'admin@email.com', role: 'admin', status: 'active', createdAt: '2024-01-01' },
        { _id: '7', name: 'David Park', email: 'david@email.com', role: 'patient', status: 'active', createdAt: '2024-03-01' },
        { _id: '8', name: 'Dr. Emily Brown', email: 'emily@email.com', role: 'doctor', status: 'active', createdAt: '2024-02-10' },
      ]);
    }
  };

  const roleIcons = { patient: Heart, doctor: Stethoscope, admin: Shield };
  const roleBadges = {
    patient: 'bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-400',
    doctor: 'bg-lavender-100 text-lavender-700 dark:bg-lavender-900/30 dark:text-lavender-400',
    admin: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
  };
  const statusBadges = {
    active: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
    inactive: 'bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-400',
    suspended: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
  };

  const filtered = users.filter(u => {
    const matchSearch = u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === 'all' || u.role === filter;
    return matchSearch && matchFilter;
  });

  const handleStatusToggle = async (userId, currentStatus) => {
    const newStatus = currentStatus === 'active' ? 'suspended' : 'active';
    try { await userAPI.update(userId, { status: newStatus }); } catch(err) {}
    setUsers(prev => prev.map(u => u._id === userId ? { ...u, status: newStatus } : u));
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <h1 className="text-3xl font-bold text-slate-800 dark:text-white flex items-center gap-3">
          <UserCog className="w-8 h-8 text-primary-500" /> Manage Users
        </h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1">View and manage all platform users</p>
      </motion.div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input type="text" value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search users..." className="input-field pl-12" />
        </div>
        <div className="flex gap-2">
          {['all', 'patient', 'doctor', 'admin'].map(f => (
            <button key={f} onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all capitalize ${
                filter === f ? 'gradient-bg text-white shadow-lg' : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
              }`}>{f === 'all' ? 'All' : f + 's'}</button>
          ))}
        </div>
      </div>

      {/* User Table */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-700">
                <th className="text-left p-4 text-sm font-semibold text-slate-600 dark:text-slate-400">User</th>
                <th className="text-left p-4 text-sm font-semibold text-slate-600 dark:text-slate-400">Role</th>
                <th className="text-left p-4 text-sm font-semibold text-slate-600 dark:text-slate-400">Status</th>
                <th className="text-left p-4 text-sm font-semibold text-slate-600 dark:text-slate-400">Joined</th>
                <th className="text-right p-4 text-sm font-semibold text-slate-600 dark:text-slate-400">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((user, i) => {
                const RoleIcon = roleIcons[user.role] || Heart;
                return (
                  <motion.tr key={user._id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.03 }}
                    className="border-b border-slate-100 dark:border-slate-700/50 hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-400 to-calm-400 flex items-center justify-center text-white font-bold text-sm">
                          {user.name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-semibold text-sm text-slate-800 dark:text-white">{user.name}</p>
                          <p className="text-xs text-slate-500">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className={`inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full font-medium capitalize ${roleBadges[user.role]}`}>
                        <RoleIcon className="w-3 h-3" /> {user.role}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className={`text-xs px-2.5 py-1 rounded-full font-medium capitalize ${statusBadges[user.status]}`}>
                        {user.status}
                      </span>
                    </td>
                    <td className="p-4 text-sm text-slate-500">{new Date(user.createdAt).toLocaleDateString()}</td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button onClick={() => handleStatusToggle(user._id, user.status)}
                          className={`p-2 rounded-lg transition-colors ${
                            user.status === 'active'
                              ? 'text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20'
                              : 'text-green-400 hover:bg-green-50 dark:hover:bg-green-900/20'
                          }`}>
                          {user.status === 'active' ? <Ban className="w-4 h-4" /> : <UserCheck className="w-4 h-4" />}
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
};

export default ManageUsers;

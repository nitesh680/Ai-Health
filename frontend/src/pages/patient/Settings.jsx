import React, { useState, useEffect } from 'react';
import { userAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { Shield, Plus, Trash2, Check, X, AlertTriangle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Settings = () => {
  const { user } = useAuth();
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    relation: 'Family',
  });

  const fetchContacts = async () => {
    if (!user?.id) {
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      const res = await userAPI.getProfile(user.id);
      setContacts(res.data.trustedContacts || []);
    } catch (err) {
      setError('Failed to fetch profile settings');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContacts();
  }, [user?.id]);

  const handleAddContact = async (e) => {
    e.preventDefault();
    try {
      const res = await userAPI.addTrustedContact(formData);
      setContacts(res.data);
      setFormData({ name: '', email: '', phone: '', relation: 'Family' });
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to add contact');
    }
  };

  const handleToggleConsent = async (contactId, currentConsent) => {
    try {
      const res = await userAPI.updateContactConsent(contactId, { consentGiven: !currentConsent });
      setContacts(res.data);
    } catch (err) {
      setError('Failed to update consent');
    }
  };

  const handleDeleteContact = async (contactId) => {
    try {
      const res = await userAPI.removeTrustedContact(contactId);
      setContacts(res.data);
    } catch (err) {
      setError('Failed to remove contact');
    }
  };

  if (loading) return <div className="p-8"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500 mx-auto"></div></div>;

  return (
    <div className="p-8 max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Patient Settings</h1>
        <p className="text-slate-500 dark:text-slate-400">Manage your profile, preferences, and emergency contacts.</p>
      </div>

      {error && (
        <div className="p-4 bg-red-50 text-red-600 rounded-lg flex items-center gap-2">
          <AlertTriangle className="w-5 h-5" />
          {error}
        </div>
      )}

      {/* Trusted Contacts Section */}
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
        <div className="p-6 border-b border-slate-200 dark:border-slate-700">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-rose-100 dark:bg-rose-900/30 text-rose-500 rounded-lg">
              <Shield className="w-5 h-5" />
            </div>
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Family / Guardian Mode</h2>
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Add trusted contacts who can be notified in case our AI detects extreme distress or a crisis.
            You must explicitly grant consent for each contact.
          </p>
        </div>

        <div className="p-6 space-y-6">
          <form onSubmit={handleAddContact} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <input
              type="text"
              placeholder="Name"
              className="input-field lg:col-span-1"
              value={formData.name}
              onChange={e => setFormData({ ...formData, name: e.target.value })}
              required
            />
            <input
              type="text"
              placeholder="Phone (e.g. +1 123...)"
              className="input-field lg:col-span-1"
              value={formData.phone}
              onChange={e => setFormData({ ...formData, phone: e.target.value })}
              required
            />
            <input
              type="email"
              placeholder="Email (optional)"
              className="input-field lg:col-span-1"
              value={formData.email}
              onChange={e => setFormData({ ...formData, email: e.target.value })}
            />
            <select
              className="input-field lg:col-span-1"
              value={formData.relation}
              onChange={e => setFormData({ ...formData, relation: e.target.value })}
            >
              <option value="Family">Family</option>
              <option value="Guardian">Guardian</option>
              <option value="Friend">Friend</option>
              <option value="Partner">Partner</option>
            </select>
            <button type="submit" className="btn-primary lg:col-span-1 flex items-center justify-center gap-2">
              <Plus className="w-4 h-4" /> Add
            </button>
          </form>

          <div className="space-y-3">
            <AnimatePresence>
              {contacts.map(contact => (
                <motion.div
                  key={contact._id}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="flex items-center justify-between p-4 rounded-xl border border-slate-100 dark:border-slate-700/50 bg-slate-50 dark:bg-slate-800/50"
                >
                  <div>
                    <h3 className="font-semibold text-slate-800 dark:text-slate-200">{contact.name} <span className="text-xs font-normal text-slate-500">({contact.relation})</span></h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      {contact.phone} {contact.email && `• ${contact.email}`}
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => handleToggleConsent(contact._id, contact.consentGiven)}
                      className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                        contact.consentGiven 
                        ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                        : 'bg-slate-200 text-slate-600 dark:bg-slate-700 dark:text-slate-400'
                      }`}
                    >
                      {contact.consentGiven ? <Check className="w-4 h-4" /> : <X className="w-4 h-4" />}
                      {contact.consentGiven ? 'Consent Given' : 'Requires Consent'}
                    </button>
                    <button
                      onClick={() => handleDeleteContact(contact._id)}
                      className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                      title="Remove contact"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </motion.div>
              ))}
              {contacts.length === 0 && (
                <div className="text-center p-6 text-slate-500 dark:text-slate-400">
                  No trusted contacts added yet.
                </div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;

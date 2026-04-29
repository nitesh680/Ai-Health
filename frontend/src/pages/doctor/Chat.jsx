import { useState } from 'react';
import { motion } from 'framer-motion';
import { MessageSquare, Send, User } from 'lucide-react';

const DoctorChat = () => {
  const [selectedChat, setSelectedChat] = useState(null);
  const [message, setMessage] = useState('');
  const [chatMessages, setChatMessages] = useState({});

  const patients = [
    { _id: '1', name: 'Alice Johnson', lastMsg: 'Thank you for the session', time: '2:30 PM', unread: 2, online: true },
    { _id: '2', name: 'Bob Chen', lastMsg: 'I\'m feeling better today', time: '1:15 PM', unread: 0, online: true },
    { _id: '3', name: 'Carol White', lastMsg: 'Can we talk?', time: '12:00 PM', unread: 1, online: false },
    { _id: '4', name: 'David Park', lastMsg: 'See you tomorrow', time: 'Yesterday', unread: 0, online: false },
  ];

  const handleSend = () => {
    if (!message.trim() || !selectedChat) return;
    const newMsg = { id: Date.now(), content: message, type: 'doctor', timestamp: new Date() };
    setChatMessages(prev => ({
      ...prev,
      [selectedChat._id]: [...(prev[selectedChat._id] || []), newMsg]
    }));
    setMessage('');
  };

  return (
    <div className="flex h-[calc(100vh-2rem)] p-4 gap-4">
      {/* Contacts */}
      <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
        className="w-80 glass-card flex flex-col overflow-hidden">
        <div className="p-4 border-b border-slate-200 dark:border-slate-700">
          <h2 className="font-bold text-slate-800 dark:text-white flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-primary-500" /> Patient Chats
          </h2>
        </div>
        <div className="flex-1 overflow-y-auto">
          {patients.map(p => (
            <button key={p._id} onClick={() => setSelectedChat(p)}
              className={`w-full p-4 flex items-center gap-3 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors border-b border-slate-100 dark:border-slate-700/50 ${
                selectedChat?._id === p._id ? 'bg-primary-50 dark:bg-primary-900/20' : ''
              }`}>
              <div className="relative">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-400 to-calm-400 flex items-center justify-center text-white font-bold text-sm">
                  {p.name.charAt(0)}
                </div>
                {p.online && <div className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-green-500 border-2 border-white dark:border-slate-800" />}
              </div>
              <div className="flex-1 text-left min-w-0">
                <p className="font-semibold text-sm text-slate-800 dark:text-white truncate">{p.name}</p>
                <p className="text-xs text-slate-500 truncate">{p.lastMsg}</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-slate-400">{p.time}</p>
                {p.unread > 0 && (
                  <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-primary-500 text-white text-xs font-bold mt-1">{p.unread}</span>
                )}
              </div>
            </button>
          ))}
        </div>
      </motion.div>

      {/* Chat Area */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex-1 glass-card flex flex-col overflow-hidden">
        {selectedChat ? (
          <>
            <div className="p-4 border-b border-slate-200 dark:border-slate-700 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-400 to-calm-400 flex items-center justify-center text-white font-bold text-sm">
                {selectedChat.name.charAt(0)}
              </div>
              <div>
                <p className="font-semibold text-slate-800 dark:text-white">{selectedChat.name}</p>
                <p className="text-xs text-green-500">{selectedChat.online ? 'Online' : 'Offline'}</p>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {(chatMessages[selectedChat._id] || []).map(msg => (
                <div key={msg.id} className={`flex ${msg.type === 'doctor' ? 'justify-end' : 'justify-start'}`}>
                  <div className={msg.type === 'doctor' ? 'chat-bubble-user' : 'chat-bubble-ai'}>
                    <p className="text-sm">{msg.content}</p>
                  </div>
                </div>
              ))}
              {(chatMessages[selectedChat._id] || []).length === 0 && (
                <div className="text-center py-12 text-slate-400">Start a conversation with {selectedChat.name}</div>
              )}
            </div>
            <div className="p-3 border-t border-slate-200 dark:border-slate-700 flex gap-2">
              <input type="text" value={message} onChange={e => setMessage(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSend()}
                className="flex-1 input-field" placeholder="Type a message..." />
              <button onClick={handleSend} className="p-3 rounded-xl gradient-bg text-white shadow-lg">
                <Send className="w-5 h-5" />
              </button>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <MessageSquare className="w-16 h-16 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
              <p className="text-slate-500 dark:text-slate-400">Select a patient to start chatting</p>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default DoctorChat;

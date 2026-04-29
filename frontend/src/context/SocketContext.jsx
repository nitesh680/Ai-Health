import { createContext, useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { useAuth } from './AuthContext';

const SocketContext = createContext(null);

export const useSocket = () => useContext(SocketContext);

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const { user, isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated && user) {
      const newSocket = io('http://localhost:5000', {
        transports: ['websocket', 'polling']
      });

      newSocket.on('connect', () => {
        newSocket.emit('join', {
          userId: user._id,
          role: user.role,
          name: user.name
        });
      });

      newSocket.on('online-users', (users) => {
        setOnlineUsers(users);
      });

      newSocket.on('new-message', (message) => {
        setNotifications(prev => [...prev, {
          id: Date.now(),
          type: 'message',
          data: message,
          read: false,
          timestamp: new Date()
        }]);
      });

      newSocket.on('crisis-alert', (alert) => {
        setNotifications(prev => [...prev, {
          id: Date.now(),
          type: 'crisis',
          data: alert,
          read: false,
          timestamp: new Date()
        }]);
      });

      newSocket.on('new-appointment', (appointment) => {
        setNotifications(prev => [...prev, {
          id: Date.now(),
          type: 'appointment',
          data: appointment,
          read: false,
          timestamp: new Date()
        }]);
      });

      setSocket(newSocket);

      return () => {
        newSocket.close();
      };
    }
  }, [isAuthenticated, user]);

  const clearNotification = (id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const clearAllNotifications = () => setNotifications([]);

  return (
    <SocketContext.Provider value={{
      socket, onlineUsers, notifications,
      clearNotification, clearAllNotifications
    }}>
      {children}
    </SocketContext.Provider>
  );
};

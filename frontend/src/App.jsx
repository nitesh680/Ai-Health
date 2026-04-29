import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { SocketProvider } from './context/SocketContext';
import ProtectedRoute from './components/ProtectedRoute';
import Sidebar from './components/Sidebar';

// Auth pages
import Login from './pages/Login';
import Register from './pages/Register';

// Patient pages
import PatientDashboard from './pages/patient/Dashboard';
import PatientChat from './pages/patient/Chat';
import MoodTracker from './pages/patient/MoodTracker';
import Journal from './pages/patient/Journal';
import PatientAppointments from './pages/patient/Appointments';
import PatientSettings from './pages/patient/Settings';
import PatientGames from './pages/patient/Games';

// Doctor pages
import DoctorDashboard from './pages/doctor/Dashboard';
import DoctorPatients from './pages/doctor/Patients';
import DoctorChat from './pages/doctor/Chat';
import DoctorAvailability from './pages/doctor/Availability';

// Admin pages
import AdminDashboard from './pages/admin/Dashboard';
import ManageUsers from './pages/admin/Users';
import CrisisAlerts from './pages/admin/CrisisAlerts';
import AuditLogs from './pages/admin/AuditLogs';
import AdminAnalytics from './pages/admin/Analytics';

// Layout wrapper with sidebar
const DashboardLayout = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-slate-900 transition-colors">
      <Sidebar collapsed={sidebarCollapsed} onToggle={() => setSidebarCollapsed(!sidebarCollapsed)} />
      <main className={`flex-1 transition-all duration-300 ${sidebarCollapsed ? 'ml-20' : 'ml-72'}`}>
        <Outlet />
      </main>
    </div>
  );
};

// Redirect based on role
const RoleRedirect = () => {
  const { user } = useAuth();
  if (user?.role === 'admin') return <Navigate to="/admin/dashboard" replace />;
  if (user?.role === 'doctor') return <Navigate to="/doctor/dashboard" replace />;
  return <Navigate to="/patient/dashboard" replace />;
};

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <SocketProvider>
          <Router>
            <Routes>
              {/* Public routes */}
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />

              {/* Protected routes with sidebar layout */}
              <Route element={
                <ProtectedRoute>
                  <DashboardLayout />
                </ProtectedRoute>
              }>
                {/* Patient Routes */}
                <Route path="/patient/dashboard" element={<ProtectedRoute roles={['patient']}><PatientDashboard /></ProtectedRoute>} />
                <Route path="/patient/chat" element={<ProtectedRoute roles={['patient']}><PatientChat /></ProtectedRoute>} />
                <Route path="/patient/mood" element={<ProtectedRoute roles={['patient']}><MoodTracker /></ProtectedRoute>} />
                <Route path="/patient/journal" element={<ProtectedRoute roles={['patient']}><Journal /></ProtectedRoute>} />
                <Route path="/patient/appointments" element={<ProtectedRoute roles={['patient']}><PatientAppointments /></ProtectedRoute>} />
                <Route path="/patient/settings" element={<ProtectedRoute roles={['patient']}><PatientSettings /></ProtectedRoute>} />
                <Route path="/patient/games" element={<ProtectedRoute roles={['patient']}><PatientGames /></ProtectedRoute>} />

                {/* Doctor Routes */}
                <Route path="/doctor/dashboard" element={<ProtectedRoute roles={['doctor']}><DoctorDashboard /></ProtectedRoute>} />
                <Route path="/doctor/patients" element={<ProtectedRoute roles={['doctor']}><DoctorPatients /></ProtectedRoute>} />
                <Route path="/doctor/chat" element={<ProtectedRoute roles={['doctor']}><DoctorChat /></ProtectedRoute>} />
                <Route path="/doctor/appointments" element={<ProtectedRoute roles={['doctor']}><DoctorDashboard /></ProtectedRoute>} />
                <Route path="/doctor/availability" element={<ProtectedRoute roles={['doctor']}><DoctorAvailability /></ProtectedRoute>} />

                {/* Admin Routes */}
                <Route path="/admin/dashboard" element={<ProtectedRoute roles={['admin']}><AdminDashboard /></ProtectedRoute>} />
                <Route path="/admin/users" element={<ProtectedRoute roles={['admin']}><ManageUsers /></ProtectedRoute>} />
                <Route path="/admin/crisis" element={<ProtectedRoute roles={['admin']}><CrisisAlerts /></ProtectedRoute>} />
                <Route path="/admin/audit" element={<ProtectedRoute roles={['admin']}><AuditLogs /></ProtectedRoute>} />
                <Route path="/admin/analytics" element={<ProtectedRoute roles={['admin']}><AdminAnalytics /></ProtectedRoute>} />
              </Route>

              {/* Root redirect */}
              <Route path="/" element={
                <ProtectedRoute>
                  <RoleRedirect />
                </ProtectedRoute>
              } />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Router>
        </SocketProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;

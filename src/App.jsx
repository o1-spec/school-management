import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'sonner';

// Layout Components
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';

// Auth Pages
import Login from './pages/Login';
import Register from './pages/Register';

// Main Pages
import Dashboard from './pages/Dashboard';
import Students from './pages/Students';
import StudentDetails from './pages/StudentDetails';
import AddStudent from './pages/AddStudent';
import Grades from './pages/Grades';
import Attendance from './pages/Attendance';
import Fees from './pages/Fees';
import Reports from './pages/Reports';
import Profile from './pages/Profile';
import Help from './pages/Help';
import Notifications from './pages/Notifications';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('schoolManagementAuthToken');
    const userData = localStorage.getItem('user');
    
    if (token && userData) {
      setIsAuthenticated(true);
      setUser(JSON.parse(userData));
    }
    setLoading(false);
  }, []);

  const handleLogin = (token, userData) => {
    localStorage.setItem('schoolManagementAuthToken', token);
    localStorage.setItem('user', JSON.stringify(userData));
    setIsAuthenticated(true);
    setUser(userData);
  };

  const handleLogout = () => {
    localStorage.removeItem('schoolManagementAuthToken');
    localStorage.removeItem('user');
    setIsAuthenticated(false);
    setUser(null);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        <p className="mt-4 text-gray-600">Loading...</p>
      </div>
    );
  }

  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Toaster position="top-right" richColors closeButton />
        {isAuthenticated ? (
          <>
            <Navbar user={user} onLogout={handleLogout} />
            <div className="flex">
              <Sidebar />
              <main className="flex-1 ml-64 p-8 mt-16">
                <Routes>
                  <Route path="/" element={<Dashboard />} />
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/students" element={<Students />} />
                  <Route path="/students/add" element={<AddStudent />} />
                  <Route path="/students/:id" element={<StudentDetails />} />
                  <Route path="/grades" element={<Grades />} />
                  <Route path="/attendance" element={<Attendance />} />
                  <Route path="/fees" element={<Fees />} />
                  <Route path="/reports" element={<Reports />} />
                  <Route path="/help" element={<Help />} />
                  <Route path="/notifications" element={<Notifications />} />
                  <Route path="/profile" element={<Profile user={user} />} />
                  <Route path="*" element={<Navigate to="/dashboard" replace />} />
                </Routes>
              </main>
            </div>
          </>
        ) : (
          <Routes>
            <Route path="/login" element={<Login onLogin={handleLogin} />} />
            <Route path="/register" element={<Register onLogin={handleLogin} />} />
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        )}
      </div>
    </Router>
  );
}

export default App;
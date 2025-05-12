import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Web3Provider } from './contexts/Web3Context';
import { AuthProvider } from './contexts/AuthContext';

// Pages
import LandingPage from './pages/LandingPage';
import AdminLogin from './pages/AdminLogin';
import DonorLogin from './pages/DonorLogin';
import PatientLogin from './pages/PatientLogin';
import AdminDashboard from './pages/AdminDashboard';
import DonorDashboard from './pages/DonorDashboard';
import PatientDashboard from './pages/PatientDashboard';
import DonorRegistration from './pages/DonorRegistration';
import PatientRegistration from './pages/PatientRegistration';

// Components
import PrivateRoute from './components/PrivateRoute';

function App() {
  return (
    <Web3Provider>
      <AuthProvider>
        <Router>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/donor/login" element={<DonorLogin />} />
            <Route path="/patient/login" element={<PatientLogin />} />
            <Route path="/donor/register" element={<DonorRegistration />} />
            <Route path="/patient/register" element={<PatientRegistration />} />

            {/* Protected Routes */}
            <Route
              path="/admin/dashboard"
              element={
                <PrivateRoute role="admin">
                  <AdminDashboard />
                </PrivateRoute>
              }
            />
            <Route
              path="/donor/dashboard"
              element={
                <PrivateRoute role="donor">
                  <DonorDashboard />
                </PrivateRoute>
              }
            />
            <Route
              path="/patient/dashboard"
              element={
                <PrivateRoute role="patient">
                  <PatientDashboard />
                </PrivateRoute>
              }
            />

            {/* Fallback Route */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Router>
      </AuthProvider>
    </Web3Provider>
  );
}

export default App;

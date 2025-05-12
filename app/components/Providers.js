'use client';

import { NotificationProvider } from '../contexts/NotificationContext';
import { Web3Provider } from '../contexts/Web3Context';
import { AuthProvider } from '../contexts/AuthContext';
import { ToastContainer } from 'react-toastify';
import Navigation from './Navigation';
import 'react-toastify/dist/ReactToastify.css';

export default function Providers({ children }) {
  return (
    <NotificationProvider>
      <Web3Provider>
        <AuthProvider>
          <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
            <Navigation />
            <main>
              {children}
            </main>
            <ToastContainer
              position="top-right"
              autoClose={5000}
              hideProgressBar={false}
              newestOnTop
              closeOnClick
              rtl={false}
              pauseOnFocusLoss
              draggable
              pauseOnHover
              theme="light"
            />
          </div>
        </AuthProvider>
      </Web3Provider>
    </NotificationProvider>
  );
} 
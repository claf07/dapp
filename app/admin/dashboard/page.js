'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNotification } from '../../contexts/NotificationContext';
import DonorDeathConfirmation from '../../components/DonorDeathConfirmation';
import VerificationPanel from '../../components/VerificationPanel';
import MatchingPanel from '../../components/MatchingPanel';
import AnalyticsPanel from '../../components/AnalyticsPanel';

export default function AdminDashboard() {
  const { user } = useAuth();
  const { showNotification } = useNotification();
  const [activeTab, setActiveTab] = useState('overview');
  const [stats, setStats] = useState({
    totalUsers: 0,
    pendingVerifications: 0,
    activeDonations: 0,
    pendingRequests: 0,
    matchSuccessRate: 0,
    totalTransplants: 0
  });

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      // Load stats from blockchain
      // Assuming contractService is available and correctly configured
      // and getDashboardStats() returns the expected data structure
      // const dashboardStats = await contractService.getDashboardStats();
      // setStats(dashboardStats);

      // Mock data for local development
      setStats({
        totalUsers: 150,
        pendingVerifications: 15,
        activeDonations: 60,
        pendingRequests: 5,
        matchSuccessRate: 85,
        totalTransplants: 42
      });

    } catch (error) {
      showNotification('Error loading dashboard data', 'error');
    }
  };

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'verification', label: 'User Verification' },
    { id: 'death-confirmation', label: 'Death Confirmation' },
    { id: 'matching', label: 'Organ Matching' },
    { id: 'analytics', label: 'Analytics' },
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-5 sm:px-6">
          <h1 className="text-2xl font-bold text-gray-900">
            Admin Command Center
          </h1>
        </div>

        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8 px-4">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm
                  ${activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        <div className="mt-6">
          {activeTab === 'overview' && (
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
              <div className="bg-white overflow-hidden shadow rounded-lg p-5">
                <h3 className="text-lg font-medium">Registration Stats</h3>
                <div className="mt-4 grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-2xl font-bold">{stats.totalUsers}</p>
                    <p className="text-sm text-gray-500">Total Users</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{stats.pendingVerifications}</p>
                    <p className="text-sm text-gray-500">Pending Verifications</p>
                  </div>
                </div>
              </div>

              <div className="bg-white overflow-hidden shadow rounded-lg p-5">
                <h3 className="text-lg font-medium">Matching Stats</h3>
                <div className="mt-4 grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-2xl font-bold">{stats.matchSuccessRate}%</p>
                    <p className="text-sm text-gray-500">Success Rate</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{stats.totalTransplants}</p>
                    <p className="text-sm text-gray-500">Total Transplants</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'verification' && <VerificationPanel />}
          {activeTab === 'death-confirmation' && <DonorDeathConfirmation />}
          {activeTab === 'matching' && <MatchingPanel />}
          {activeTab === 'analytics' && <AnalyticsPanel />}
        </div>
      </div>
    </div>
  );
}
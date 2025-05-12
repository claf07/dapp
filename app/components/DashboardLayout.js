'use client';

import React from 'react';
import Link from 'next/link';
import { useAuth } from '../contexts/AuthContext';
import { useNotification } from '../contexts/NotificationContext';

const DashboardLayout = ({ title, children }) => {
  const { user } = useAuth();
  const { showNotification } = useNotification();

  const commonLinks = [
    { name: 'Overview', href: `/${user?.role}/dashboard` },
    { name: 'Profile', href: `/${user?.role}/profile` },
    { name: 'Notifications', href: `/${user?.role}/notifications` },
    { name: 'Help / FAQ', href: '/faq' },
    { name: 'Logout', href: '/' },
  ];

  const adminLinks = [
    { name: 'Verify Users', href: '/admin/dashboard/verify-users' },
    { name: 'View All Donations', href: '/admin/dashboard/donations' },
    { name: 'Manage Requests', href: '/admin/dashboard/requests' },
    { name: 'Governance (DAO)', href: '/admin/dashboard/governance' },
    { name: 'Analytics', href: '/admin/dashboard/analytics' },
  ];

  const donorLinks = [
    { name: 'Register Organ', href: '/donor/dashboard/register-organ' },
    { name: 'Donation History', href: '/donor/dashboard/donation-history' },
    { name: 'My Organs', href: '/donor/dashboard/my-organs' },
    { name: 'Legacy NFT Badge', href: '/donor/dashboard/legacy-nft' },
  ];

  const patientLinks = [
    { name: 'Request Organ', href: '/patient/dashboard/request-organ' },
    { name: 'My Requests', href: '/patient/dashboard/my-requests' },
    { name: 'View Matches', href: '/patient/dashboard/matches' },
    { name: 'Medical Records', href: '/patient/dashboard/medical-records' },
  ];

  const getLinks = () => {
    if (!user) return [];
    if (user.role === 'admin') return [...commonLinks, ...adminLinks];
    if (user.role === 'donor') return [...commonLinks, ...donorLinks];
    if (user.role === 'patient') return [...commonLinks, ...patientLinks];
    return commonLinks;
  };

  return (
    <div className="min-h-screen flex bg-gray-100 dark:bg-gray-900">
      {/* Sidebar */}
      <aside className="w-64 bg-white dark:bg-gray-800 shadow-md">
        <div className="p-4 text-xl font-bold text-blue-600 border-b border-gray-200 dark:border-gray-700">
          Dashboard
        </div>
        <nav className="p-4 space-y-2">
          {getLinks().map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className="block px-3 py-2 rounded-md text-gray-700 dark:text-gray-300 hover:bg-blue-100 dark:hover:bg-blue-700"
            >
              {link.name}
            </Link>
          ))}
        </nav>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-6">
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">{title}</h1>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          {children}
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;

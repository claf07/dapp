'use client';

import { useAuth } from '../contexts/AuthContext';
import { useWeb3 } from '../contexts/Web3Context';

export default function Dashboard() {
  const { user } = useAuth();
  const { account } = useWeb3();

  const stats = {
    admin: [
      { name: 'Total Users', value: '1,234' },
      { name: 'Active Donations', value: '567' },
      { name: 'Pending Requests', value: '89' },
      { name: 'Successful Matches', value: '123' },
    ],
    donor: [
      { name: 'My Donations', value: '3' },
      { name: 'Active Requests', value: '45' },
      { name: 'Matches Found', value: '2' },
      { name: 'Legacy NFTs', value: '1' },
    ],
    patient: [
      { name: 'My Requests', value: '2' },
      { name: 'Available Matches', value: '5' },
      { name: 'Active Matches', value: '1' },
      { name: 'Medical Records', value: '3' },
    ],
  };

  const quickActions = {
    admin: [
      { name: 'Verify Users', href: '/dashboard/verify-users' },
      { name: 'View Donations', href: '/dashboard/donations' },
      { name: 'Manage Requests', href: '/dashboard/requests' },
      { name: 'DAO Governance', href: '/dashboard/governance' },
    ],
    donor: [
      { name: 'Register Organ', href: '/dashboard/register-organ' },
      { name: 'View Matches', href: '/dashboard/matches' },
      { name: 'Update Profile', href: '/dashboard/profile' },
      { name: 'View Legacy NFT', href: '/dashboard/legacy-nft' },
    ],
    patient: [
      { name: 'Request Organ', href: '/dashboard/request-organ' },
      { name: 'View Matches', href: '/dashboard/matches' },
      { name: 'Upload Records', href: '/dashboard/medical-records' },
      { name: 'Update Profile', href: '/dashboard/profile' },
    ],
  };

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Welcome back, {user?.name || 'User'}!
        </h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Here's what's happening with your {user?.role} account.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {stats[user?.role]?.map((stat) => (
          <div
            key={stat.name}
            className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg"
          >
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-1">
                  <div className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                    {stat.name}
                  </div>
                  <div className="mt-1 text-3xl font-semibold text-gray-900 dark:text-white">
                    {stat.value}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg">
        <div className="px-4 py-5 sm:px-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">
            Quick Actions
          </h3>
        </div>
        <div className="border-t border-gray-200 dark:border-gray-700">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 p-4">
            {quickActions[user?.role]?.map((action) => (
              <a
                key={action.name}
                href={action.href}
                className="relative rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-6 py-5 shadow-sm flex items-center space-x-3 hover:border-gray-400 dark:hover:border-gray-500 focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500"
              >
                <div className="flex-1 min-w-0">
                  <span className="absolute inset-0" aria-hidden="true" />
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {action.name}
                  </p>
                </div>
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg">
        <div className="px-4 py-5 sm:px-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">
            Recent Activity
          </h3>
        </div>
        <div className="border-t border-gray-200 dark:border-gray-700">
          <div className="px-4 py-5 sm:p-6">
            <div className="flow-root">
              <ul className="-mb-8">
                <li>
                  <div className="relative pb-8">
                    <span
                      className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200 dark:bg-gray-700"
                      aria-hidden="true"
                    />
                    <div className="relative flex space-x-3">
                      <div>
                        <span className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center ring-8 ring-white dark:ring-gray-800">
                          <svg
                            className="h-5 w-5 text-white"
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path
                              fillRule="evenodd"
                              d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </span>
                      </div>
                      <div className="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
                        <div>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            New match found for your{' '}
                            <span className="font-medium text-gray-900 dark:text-white">
                              organ donation request
                            </span>
                          </p>
                        </div>
                        <div className="text-right text-sm whitespace-nowrap text-gray-500 dark:text-gray-400">
                          <time dateTime="2023-01-23">1h ago</time>
                        </div>
                      </div>
                    </div>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 
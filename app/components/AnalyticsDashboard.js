'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { storageService } from '../services/storageService';
import { matchingService } from '../services/matchingService';
import { governanceService } from '../services/governanceService';

export default function AnalyticsDashboard() {
  const { user } = useAuth();
  const [timeRange, setTimeRange] = useState('30d');
  const [analytics, setAnalytics] = useState({
    donationTrends: [],
    matchSuccess: [],
    hospitalReputation: [],
    requestHeatmap: []
  });

  useEffect(() => {
    if (user?.role === 'admin') {
      loadAnalytics();
    }
  }, [user, timeRange]);

  const loadAnalytics = async () => {
    try {
      // In a real implementation, this would fetch from your backend
      // For now, we'll use mock data
      const mockData = {
        donationTrends: [
          { date: '2024-03-01', count: 5 },
          { date: '2024-03-02', count: 7 },
          { date: '2024-03-03', count: 4 },
          // Add more mock data
        ],
        matchSuccess: [
          { organType: 'kidney', successRate: 0.85 },
          { organType: 'liver', successRate: 0.75 },
          { organType: 'heart', successRate: 0.65 },
          // Add more mock data
        ],
        hospitalReputation: [
          { name: 'Hospital A', score: 4.5, verifiedDonations: 25 },
          { name: 'Hospital B', score: 4.2, verifiedDonations: 18 },
          { name: 'Hospital C', score: 4.0, verifiedDonations: 15 },
          // Add more mock data
        ],
        requestHeatmap: [
          { location: 'New York', count: 15 },
          { location: 'Los Angeles', count: 12 },
          { location: 'Chicago', count: 8 },
          // Add more mock data
        ]
      };

      setAnalytics(mockData);
    } catch (error) {
      console.error('Error loading analytics:', error);
    }
  };

  const renderDonationTrends = () => (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold mb-4">Donation Trends</h3>
      <div className="h-64">
        {/* In a real implementation, use a charting library like Chart.js or D3.js */}
        <div className="flex items-end h-48 space-x-2">
          {analytics.donationTrends.map((trend, index) => (
            <div
              key={index}
              className="flex-1 bg-blue-500"
              style={{
                height: `${(trend.count / 10) * 100}%`,
                minHeight: '4px'
              }}
              title={`${trend.date}: ${trend.count} donations`}
            />
          ))}
        </div>
        <div className="flex justify-between mt-2 text-sm text-gray-500">
          <span>Start</span>
          <span>End</span>
        </div>
      </div>
    </div>
  );

  const renderMatchSuccess = () => (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold mb-4">Match Success Rates</h3>
      <div className="space-y-4">
        {analytics.matchSuccess.map((match, index) => (
          <div key={index} className="flex items-center">
            <div className="w-24 text-sm text-gray-600">{match.organType}</div>
            <div className="flex-1 h-4 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-green-500"
                style={{ width: `${match.successRate * 100}%` }}
              />
            </div>
            <div className="w-16 text-right text-sm text-gray-600">
              {Math.round(match.successRate * 100)}%
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderHospitalReputation = () => (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold mb-4">Hospital Reputation</h3>
      <div className="space-y-4">
        {analytics.hospitalReputation.map((hospital, index) => (
          <div key={index} className="flex items-center justify-between">
            <div className="flex-1">
              <div className="font-medium">{hospital.name}</div>
              <div className="text-sm text-gray-500">
                {hospital.verifiedDonations} verified donations
              </div>
            </div>
            <div className="flex items-center">
              <div className="text-lg font-semibold text-blue-600">
                {hospital.score}
              </div>
              <div className="ml-2 text-yellow-500">★</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderRequestHeatmap = () => (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold mb-4">Request Distribution</h3>
      <div className="grid grid-cols-3 gap-4">
        {analytics.requestHeatmap.map((location, index) => (
          <div
            key={index}
            className="p-4 rounded-lg"
            style={{
              backgroundColor: `rgba(59, 130, 246, ${location.count / 20})`
            }}
          >
            <div className="font-medium text-white">{location.location}</div>
            <div className="text-sm text-white opacity-75">
              {location.count} requests
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  if (user?.role !== 'admin') {
    return (
      <div className="p-6 text-center text-gray-500">
        Access denied. Admin privileges required.
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Analytics Dashboard</h2>
        <select
          value={timeRange}
          onChange={(e) => setTimeRange(e.target.value)}
          className="px-4 py-2 border rounded-md"
        >
          <option value="7d">Last 7 days</option>
          <option value="30d">Last 30 days</option>
          <option value="90d">Last 90 days</option>
          <option value="1y">Last year</option>
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {renderDonationTrends()}
        {renderMatchSuccess()}
        {renderHospitalReputation()}
        {renderRequestHeatmap()}
      </div>
    </div>
  );
} 
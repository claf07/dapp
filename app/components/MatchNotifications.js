'use client';

import { useState, useEffect } from 'react';
import { useWeb3 } from '../contexts/Web3Context';
import { useNotification } from '../contexts/NotificationContext';
import MatchService from '../services/matchService';

export default function MatchNotifications() {
  const [matches, setMatches] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { contract, provider, account } = useWeb3();
  const { showNotification } = useNotification();
  const matchService = new MatchService(contract, provider);

  useEffect(() => {
    loadMatches();
  }, [account]);

  const loadMatches = async () => {
    if (!account) return;

    try {
      setIsLoading(true);
      const patientMatches = await matchService.getPatientMatches(account);
      setMatches(patientMatches);
    } catch (error) {
      showNotification(
        'Error loading matches: ' + error.message,
        'error'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleAcceptMatch = async (matchId) => {
    try {
      setIsLoading(true);
      await matchService.acceptMatch(matchId);
      showNotification('Match accepted successfully', 'success');
      loadMatches(); // Reload matches after accepting
    } catch (error) {
      showNotification(
        'Error accepting match: ' + error.message,
        'error'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleRejectMatch = async (matchId) => {
    try {
      setIsLoading(true);
      await matchService.rejectMatch(matchId);
      showNotification('Match rejected', 'info');
      loadMatches(); // Reload matches after rejecting
    } catch (error) {
      showNotification(
        'Error rejecting match: ' + error.message,
        'error'
      );
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (matches.length === 0) {
    return (
      <div className="text-center p-8">
        <p className="text-gray-500">No matches found</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {matches.map((match) => (
        <div
          key={match.id}
          className="bg-white shadow rounded-lg p-6"
        >
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-lg font-medium text-gray-900">
                {match.organType} Match
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                Match ID: {match.id}
              </p>
            </div>
            <span
              className={`px-2 py-1 text-xs font-medium rounded-full ${
                match.status === 'pending'
                  ? 'bg-yellow-100 text-yellow-800'
                  : match.status === 'accepted'
                  ? 'bg-green-100 text-green-800'
                  : 'bg-red-100 text-red-800'
              }`}
            >
              {match.status}
            </span>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-gray-500">
                Donor Information
              </p>
              <p className="mt-1 text-sm text-gray-900">
                Blood Type: {match.donorBloodType}
              </p>
              <p className="text-sm text-gray-900">
                Age: {match.donorAge}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">
                Hospital Information
              </p>
              <p className="mt-1 text-sm text-gray-900">
                {match.hospitalName}
              </p>
              <p className="text-sm text-gray-900">
                {match.hospitalLocation}
              </p>
            </div>
          </div>

          {match.status === 'pending' && (
            <div className="mt-4 flex space-x-4">
              <button
                onClick={() => handleAcceptMatch(match.id)}
                disabled={isLoading}
                className="flex-1 bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
              >
                Accept Match
              </button>
              <button
                onClick={() => handleRejectMatch(match.id)}
                disabled={isLoading}
                className="flex-1 bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50"
              >
                Reject Match
              </button>
            </div>
          )}

          {match.status === 'accepted' && (
            <div className="mt-4">
              <p className="text-sm text-gray-500">
                Next Steps:
              </p>
              <ul className="mt-2 text-sm text-gray-900 list-disc list-inside">
                <li>Contact your hospital immediately</li>
                <li>Prepare for the transplantation procedure</li>
                <li>Complete any required pre-surgery tests</li>
              </ul>
            </div>
          )}
        </div>
      ))}
    </div>
  );
} 
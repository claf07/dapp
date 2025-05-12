
'use client';

import { useState, useEffect } from 'react';
import { contractService } from '../services/contractService';

export default function MatchingPanel() {
  const [matches, setMatches] = useState([]);
  const [matchCriteria, setMatchCriteria] = useState({
    organType: '',
    bloodGroup: '',
    urgencyLevel: 'normal'
  });

  useEffect(() => {
    loadMatches();
  }, []);

  const loadMatches = async () => {
    const matchData = await contractService.findMatches();
    setMatches(matchData);
  };

  const handleFindMatches = async () => {
    const newMatches = await contractService.findMatchesWithCriteria(matchCriteria);
    setMatches(newMatches);
  };

  const handleConfirmMatch = async (matchId) => {
    await contractService.acceptMatch(matchId);
    loadMatches();
  };

  return (
    <div className="bg-white shadow sm:rounded-lg">
      <div className="px-4 py-5 sm:p-6">
        <h3 className="text-lg font-medium text-gray-900">Organ Matching</h3>
        
        <div className="mt-4 grid grid-cols-3 gap-4">
          <select
            value={matchCriteria.organType}
            onChange={(e) => setMatchCriteria({...matchCriteria, organType: e.target.value})}
            className="border rounded p-2"
          >
            <option value="">Select Organ</option>
            <option value="kidney">Kidney</option>
            <option value="liver">Liver</option>
            <option value="heart">Heart</option>
          </select>

          <select
            value={matchCriteria.bloodGroup}
            onChange={(e) => setMatchCriteria({...matchCriteria, bloodGroup: e.target.value})}
            className="border rounded p-2"
          >
            <option value="">Select Blood Group</option>
            <option value="A+">A+</option>
            <option value="B+">B+</option>
            <option value="O+">O+</option>
            <option value="AB+">AB+</option>
          </select>

          <button
            onClick={handleFindMatches}
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            Find Matches
          </button>
        </div>

        <div className="mt-6">
          {matches.map((match) => (
            <div key={match.id} className="border-t py-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Match #{match.id}</p>
                  <p className="text-sm text-gray-500">
                    Donor: {match.donorAddress.slice(0, 6)}...
                    Recipient: {match.recipientAddress.slice(0, 6)}...
                  </p>
                  <p className="text-sm text-gray-500">
                    Organ: {match.organ} | Compatibility: {match.compatibilityScore}%
                  </p>
                </div>
                <button
                  onClick={() => handleConfirmMatch(match.id)}
                  className="bg-green-500 text-white px-4 py-2 rounded"
                >
                  Confirm Match
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

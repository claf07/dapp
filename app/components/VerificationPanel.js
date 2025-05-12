
'use client';

import { useState, useEffect } from 'react';
import { contractService } from '../services/contractService';
import { ipfsService } from '../services/ipfsService';

export default function VerificationPanel() {
  const [pendingUsers, setPendingUsers] = useState([]);

  useEffect(() => {
    loadPendingUsers();
  }, []);

  const loadPendingUsers = async () => {
    const users = await contractService.getPendingUsers();
    const enrichedUsers = await Promise.all(
      users.map(async (user) => {
        const metadata = await ipfsService.getMetadata(user.ipfsHash);
        return { ...user, metadata };
      })
    );
    setPendingUsers(enrichedUsers);
  };

  const handleVerify = async (address) => {
    await contractService.verifyUser(address);
    loadPendingUsers();
  };

  const handleReject = async (address) => {
    await contractService.rejectUser(address);
    loadPendingUsers();
  };

  return (
    <div className="bg-white shadow sm:rounded-lg">
      <div className="px-4 py-5 sm:p-6">
        <h3 className="text-lg font-medium text-gray-900">Pending Verifications</h3>
        <div className="mt-4 divide-y divide-gray-200">
          {pendingUsers.map((user) => (
            <div key={user.address} className="py-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-medium">{user.metadata.name}</h4>
                  <p className="text-sm text-gray-500">{user.metadata.role}</p>
                  <a 
                    href={`https://ipfs.io/ipfs/${user.ipfsHash}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-blue-600 hover:text-blue-800"
                  >
                    View Documents
                  </a>
                </div>
                <div className="space-x-3">
                  <button
                    onClick={() => handleVerify(user.address)}
                    className="bg-green-500 text-white px-4 py-2 rounded"
                  >
                    Verify
                  </button>
                  <button
                    onClick={() => handleReject(user.address)}
                    className="bg-red-500 text-white px-4 py-2 rounded"
                  >
                    Reject
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

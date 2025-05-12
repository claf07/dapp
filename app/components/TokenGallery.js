'use client';

import { useState, useEffect } from 'react';
import { useWeb3 } from '../contexts/Web3Context';
import { useNotification } from '../contexts/NotificationContext';
import { contractService } from '../services/contractService';

export default function TokenGallery() {
  const { signer } = useWeb3();
  const { showNotification } = useNotification();
  const [tokens, setTokens] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedToken, setSelectedToken] = useState(null);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    async function fetchTokens() {
      if (!signer) return;
      
      try {
        const tokenData = await contractService.getAllTokens(signer);
        setTokens(tokenData);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching tokens:', error);
        showNotification('Failed to load tokens', 'error');
        setLoading(false);
      }
    }

    fetchTokens();
  }, [signer, showNotification]);

  const filteredTokens = tokens.filter(token => {
    if (filter === 'all') return true;
    return token.status === filter;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'available':
        return 'bg-green-100 text-green-800';
      case 'matched':
        return 'bg-blue-100 text-blue-800';
      case 'transplanted':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getOrganIcon = (organType) => {
    switch (organType.toLowerCase()) {
      case 'kidney':
        return (
          <svg className="h-8 w-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
        );
      case 'liver':
        return (
          <svg className="h-8 w-8 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
          </svg>
        );
      case 'heart':
        return (
          <svg className="h-8 w-8 text-pink-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
        );
      default:
        return (
          <svg className="h-8 w-8 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
        );
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="flex space-x-4">
        <button
          onClick={() => setFilter('all')}
          className={`px-4 py-2 rounded-md ${
            filter === 'all' ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-700'
          }`}
        >
          All
        </button>
        <button
          onClick={() => setFilter('available')}
          className={`px-4 py-2 rounded-md ${
            filter === 'available' ? 'bg-green-500 text-white' : 'bg-gray-100 text-gray-700'
          }`}
        >
          Available
        </button>
        <button
          onClick={() => setFilter('matched')}
          className={`px-4 py-2 rounded-md ${
            filter === 'matched' ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-700'
          }`}
        >
          Matched
        </button>
        <button
          onClick={() => setFilter('transplanted')}
          className={`px-4 py-2 rounded-md ${
            filter === 'transplanted' ? 'bg-purple-500 text-white' : 'bg-gray-100 text-gray-700'
          }`}
        >
          Transplanted
        </button>
      </div>

      {/* Token Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTokens.map((token) => (
          <div
            key={token.id}
            className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  {getOrganIcon(token.organType)}
                  <h3 className="text-lg font-semibold text-gray-900">{token.organType}</h3>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(token.status)}`}>
                  {token.status}
                </span>
              </div>
              
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Donor ID</span>
                  <span className="text-gray-900 font-medium">{token.donorId}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Blood Type</span>
                  <span className="text-gray-900 font-medium">{token.bloodType}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Age</span>
                  <span className="text-gray-900 font-medium">{token.age}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Location</span>
                  <span className="text-gray-900 font-medium">{token.location}</span>
                </div>
              </div>

              <div className="mt-6 flex justify-end space-x-3">
                <button
                  onClick={() => setSelectedToken(token)}
                  className="px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-800"
                >
                  View Details
                </button>
                {token.status === 'available' && (
                  <button
                    onClick={() => handleMatch(token.id)}
                    className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
                  >
                    Match
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Token Details Modal */}
      {selectedToken && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full p-6">
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-2xl font-semibold text-gray-900">Token Details</h2>
              <button
                onClick={() => setSelectedToken(null)}
                className="text-gray-400 hover:text-gray-500"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Organ Type</p>
                  <p className="text-lg font-medium text-gray-900">{selectedToken.organType}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Status</p>
                  <p className="text-lg font-medium text-gray-900">{selectedToken.status}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Blood Type</p>
                  <p className="text-lg font-medium text-gray-900">{selectedToken.bloodType}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Age</p>
                  <p className="text-lg font-medium text-gray-900">{selectedToken.age}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Location</p>
                  <p className="text-lg font-medium text-gray-900">{selectedToken.location}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Donor ID</p>
                  <p className="text-lg font-medium text-gray-900">{selectedToken.donorId}</p>
                </div>
              </div>

              <div className="mt-6 flex justify-end space-x-3">
                <button
                  onClick={() => setSelectedToken(null)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                >
                  Close
                </button>
                {selectedToken.status === 'available' && (
                  <button
                    onClick={() => handleMatch(selectedToken.id)}
                    className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
                  >
                    Match
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useWeb3 } from '../contexts/Web3Context';
import LoadingSpinner from '../components/LoadingSpinner';

function DonorDashboard() {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const { contract, account } = useWeb3();

  const [userData, setUserData] = useState(null);
  const [matches, setMatches] = useState([]);
  const [rewards, setRewards] = useState(0);
  const [medicalRecords, setMedicalRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [newMedicalRecord, setNewMedicalRecord] = useState('');

  useEffect(() => {
    loadData();
  }, [contract, account]);

  const loadData = async () => {
    try {
      setLoading(true);
      const user = await contract.methods.users(account).call();
      const records = await contract.methods.getUserMedicalRecords(account).call();
      const rewardBalance = await contract.methods.userRewards(account).call();

      setUserData(user);
      setMedicalRecords(records);
      setRewards(rewardBalance);
    } catch (error) {
      setError('Error loading data. Please try again.');
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAnnounceAvailability = async () => {
    try {
      setLoading(true);
      await contract.methods.announceDonor().send({ from: account });
      await loadData();
    } catch (error) {
      setError('Error announcing availability. Please try again.');
      console.error('Error announcing availability:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateMedicalRecord = async () => {
    try {
      setLoading(true);
      await contract.methods.updateMedicalRecords(newMedicalRecord).send({ from: account });
      setNewMedicalRecord('');
      await loadData();
    } catch (error) {
      setError('Error updating medical record. Please try again.');
      console.error('Error updating medical record:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleClaimReward = async () => {
    try {
      setLoading(true);
      await contract.methods.claimReward().send({ from: account });
      await loadData();
    } catch (error) {
      setError('Error claiming reward. Please try again.');
      console.error('Error claiming reward:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <LoadingSpinner size="large" color="blue" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-green-600 text-white p-4">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">Donor Dashboard</h1>
          <button
            onClick={handleLogout}
            className="bg-green-700 hover:bg-green-800 px-4 py-2 rounded"
          >
            Logout
          </button>
        </div>
      </nav>

      <div className="container mx-auto p-4">
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {/* User Profile Section */}
        <section className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-2xl font-bold mb-4">Profile Information</h2>
          {userData && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p><span className="font-semibold">Name:</span> {userData.name}</p>
                <p><span className="font-semibold">Age:</span> {userData.age}</p>
                <p><span className="font-semibold">Sex:</span> {userData.sex}</p>
                <p><span className="font-semibold">Blood Group:</span> {userData.bloodGroup}</p>
              </div>
              <div>
                <p><span className="font-semibold">Height:</span> {userData.height} cm</p>
                <p><span className="font-semibold">Weight:</span> {userData.weight} kg</p>
                <p><span className="font-semibold">Status:</span> {userData.status}</p>
                <p><span className="font-semibold">Reputation:</span> {userData.reputation}</p>
              </div>
            </div>
          )}
        </section>

        {/* Organs Section */}
        <section className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-2xl font-bold mb-4">Available Organs</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {userData?.organs.map((organ, index) => (
              <div key={index} className="bg-green-50 p-4 rounded-lg">
                <p className="font-semibold">{organ}</p>
              </div>
            ))}
          </div>
          <button
            onClick={handleAnnounceAvailability}
            disabled={userData?.status === 'Available'}
            className={`mt-4 px-4 py-2 rounded text-white ${
              userData?.status === 'Available'
                ? 'bg-green-400 cursor-not-allowed'
                : 'bg-green-600 hover:bg-green-700'
            }`}
          >
            Announce Availability
          </button>
        </section>

        {/* Rewards Section */}
        <section className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-2xl font-bold mb-4">Rewards</h2>
          <div className="flex items-center justify-between">
            <p className="text-xl">Available Rewards: {rewards} points</p>
            <button
              onClick={handleClaimReward}
              disabled={rewards === 0}
              className={`px-4 py-2 rounded text-white ${
                rewards === 0
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-green-600 hover:bg-green-700'
              }`}
            >
              Claim Rewards
            </button>
          </div>
        </section>

        {/* Medical Records Section */}
        <section className="bg-white rounded-lg shadow p-6">
          <h2 className="text-2xl font-bold mb-4">Medical Records</h2>
          <div className="mb-4">
            <input
              type="text"
              value={newMedicalRecord}
              onChange={(e) => setNewMedicalRecord(e.target.value)}
              placeholder="Enter new medical record hash"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            <button
              onClick={handleUpdateMedicalRecord}
              disabled={!newMedicalRecord}
              className={`mt-2 px-4 py-2 rounded text-white ${
                !newMedicalRecord
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-green-600 hover:bg-green-700'
              }`}
            >
              Update Medical Record
            </button>
          </div>
          <div className="space-y-2">
            {medicalRecords.map((record, index) => (
              <div key={index} className="bg-gray-50 p-3 rounded">
                <p className="text-sm text-gray-600">{record}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

export default DonorDashboard; 
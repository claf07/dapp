import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useWeb3 } from '../contexts/Web3Context';
import LoadingSpinner from '../components/LoadingSpinner';

function PatientDashboard() {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const { contract, account } = useWeb3();

  const [userData, setUserData] = useState(null);
  const [matches, setMatches] = useState([]);
  const [medicalRecords, setMedicalRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [newMedicalRecord, setNewMedicalRecord] = useState('');
  const [emergencyLevel, setEmergencyLevel] = useState('0');

  useEffect(() => {
    loadData();
  }, [contract, account]);

  const loadData = async () => {
    try {
      setLoading(true);
      const user = await contract.methods.users(account).call();
      const records = await contract.methods.getUserMedicalRecords(account).call();

      setUserData(user);
      setMedicalRecords(records);
    } catch (error) {
      setError('Error loading data. Please try again.');
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateEmergencyRequest = async (organ) => {
    try {
      setLoading(true);
      await contract.methods.createEmergencyRequest(organ, emergencyLevel).send({ from: account });
      await loadData();
    } catch (error) {
      setError('Error creating emergency request. Please try again.');
      console.error('Error creating emergency request:', error);
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

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <LoadingSpinner size="large" color="purple" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-purple-600 text-white p-4">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">Patient Dashboard</h1>
          <button
            onClick={handleLogout}
            className="bg-purple-700 hover:bg-purple-800 px-4 py-2 rounded"
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
              </div>
            </div>
          )}
        </section>

        {/* Organs Needed Section */}
        <section className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-2xl font-bold mb-4">Organs Needed</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {userData?.organs.map((organ, index) => (
              <div key={index} className="bg-purple-50 p-4 rounded-lg">
                <p className="font-semibold">{organ}</p>
                <div className="mt-2">
                  <select
                    value={emergencyLevel}
                    onChange={(e) => setEmergencyLevel(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="0">No Emergency</option>
                    <option value="1">Low Emergency</option>
                    <option value="2">Medium Emergency</option>
                    <option value="3">High Emergency</option>
                  </select>
                  <button
                    onClick={() => handleCreateEmergencyRequest(organ)}
                    className="mt-2 w-full px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
                  >
                    Create Emergency Request
                  </button>
                </div>
              </div>
            ))}
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
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            <button
              onClick={handleUpdateMedicalRecord}
              disabled={!newMedicalRecord}
              className={`mt-2 px-4 py-2 rounded text-white ${
                !newMedicalRecord
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-purple-600 hover:bg-purple-700'
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

export default PatientDashboard; 
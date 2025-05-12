import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useWeb3 } from '../contexts/Web3Context';

function AdminDashboard() {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const { contract, account } = useWeb3();

  const [pendingUsers, setPendingUsers] = useState([]);
  const [verifiedDonors, setVerifiedDonors] = useState([]);
  const [verifiedPatients, setVerifiedPatients] = useState([]);
  const [availableDonors, setAvailableDonors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadData();
  }, [contract, account]);

  const loadData = async () => {
    try {
      setLoading(true);
      const pending = await contract.methods.getPendingUsers().call();
      const verifiedDonorsList = await contract.methods.getVerifiedDonors().call();
      const verifiedPatientsList = await contract.methods.getVerifiedPatients().call();
      const availableDonorsList = await contract.methods.getAvailableDonors().call();

      const pendingUsersData = await Promise.all(
        pending.map(async (address) => {
          const user = await contract.methods.users(address).call();
          return { address, ...user };
        })
      );

      const verifiedDonorsData = await Promise.all(
        verifiedDonorsList.map(async (address) => {
          const user = await contract.methods.users(address).call();
          return { address, ...user };
        })
      );

      const verifiedPatientsData = await Promise.all(
        verifiedPatientsList.map(async (address) => {
          const user = await contract.methods.users(address).call();
          return { address, ...user };
        })
      );

      const availableDonorsData = await Promise.all(
        availableDonorsList.map(async (address) => {
          const user = await contract.methods.users(address).call();
          return { address, ...user };
        })
      );

      setPendingUsers(pendingUsersData);
      setVerifiedDonors(verifiedDonorsData);
      setVerifiedPatients(verifiedPatientsData);
      setAvailableDonors(availableDonorsData);
    } catch (error) {
      setError('Error loading data. Please try again.');
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (address) => {
    try {
      await contract.methods.verifyUser(address).send({ from: account });
      await loadData();
    } catch (error) {
      setError('Error verifying user. Please try again.');
      console.error('Error verifying user:', error);
    }
  };

  const handleReject = async (address) => {
    try {
      await contract.methods.rejectUser(address).send({ from: account });
      await loadData();
    } catch (error) {
      setError('Error rejecting user. Please try again.');
      console.error('Error rejecting user:', error);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-xl text-gray-600">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-blue-600 text-white p-4">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">Admin Dashboard</h1>
          <button
            onClick={handleLogout}
            className="bg-blue-700 hover:bg-blue-800 px-4 py-2 rounded"
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

        {/* Pending Users Section */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4">Pending Verifications</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {pendingUsers.map((user) => (
              <div key={user.address} className="bg-white rounded-lg shadow p-4">
                <h3 className="font-bold mb-2">{user.name}</h3>
                <p>Age: {user.age}</p>
                <p>Sex: {user.sex}</p>
                <p>Blood Group: {user.bloodGroup}</p>
                <p>Organ: {user.organ}</p>
                <p className="text-sm text-gray-500 mb-4">Address: {user.address}</p>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleVerify(user.address)}
                    className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                  >
                    Verify
                  </button>
                  <button
                    onClick={() => handleReject(user.address)}
                    className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                  >
                    Reject
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Available Donors Section */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4">Available Donors</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {availableDonors.map((donor) => (
              <div key={donor.address} className="bg-white rounded-lg shadow p-4">
                <h3 className="font-bold mb-2">{donor.name}</h3>
                <p>Age: {donor.age}</p>
                <p>Sex: {donor.sex}</p>
                <p>Blood Group: {donor.bloodGroup}</p>
                <p>Organ: {donor.organ}</p>
                <p className="text-sm text-gray-500">Address: {donor.address}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Verified Donors Section */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4">Verified Donors</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {verifiedDonors.map((donor) => (
              <div key={donor.address} className="bg-white rounded-lg shadow p-4">
                <h3 className="font-bold mb-2">{donor.name}</h3>
                <p>Age: {donor.age}</p>
                <p>Sex: {donor.sex}</p>
                <p>Blood Group: {donor.bloodGroup}</p>
                <p>Organ: {donor.organ}</p>
                <p className="text-sm text-gray-500">Address: {donor.address}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Verified Patients Section */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4">Verified Patients</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {verifiedPatients.map((patient) => (
              <div key={patient.address} className="bg-white rounded-lg shadow p-4">
                <h3 className="font-bold mb-2">{patient.name}</h3>
                <p>Age: {patient.age}</p>
                <p>Sex: {patient.sex}</p>
                <p>Blood Group: {patient.bloodGroup}</p>
                <p>Organ Needed: {patient.organ}</p>
                <p className="text-sm text-gray-500">Address: {patient.address}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

export default AdminDashboard; 
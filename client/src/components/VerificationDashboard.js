import React, { useEffect, useState } from 'react';

const VerificationDashboard = ({ account, web3, role }) => {
  const [pendingDonors, setPendingDonors] = useState([]);
  const [pendingPatients, setPendingPatients] = useState([]);

  useEffect(() => {
    // TODO: Fetch pending donors and patients from contract or off-chain
  }, [web3]);

  const handleVerifyDonor = (donorAddress) => {
    // TODO: Call contract to verify donor
    alert(`Verify donor ${donorAddress} (functionality to be implemented)`);
  };

  const handleRejectDonor = (donorAddress) => {
    // TODO: Call contract to reject donor
    alert(`Reject donor ${donorAddress} (functionality to be implemented)`);
  };

  const handleVerifyPatient = (patientAddress) => {
    // TODO: Call contract to verify patient
    alert(`Verify patient ${patientAddress} (functionality to be implemented)`);
  };

  const handleRejectPatient = (patientAddress) => {
    // TODO: Call contract to reject patient
    alert(`Reject patient ${patientAddress} (functionality to be implemented)`);
  };

  if (role !== 'admin' && role !== 'medicalPro') {
    return <p>Access denied. Only admins and medical professionals can access this dashboard.</p>;
  }

  return (
    <div>
      <h2>Verification Dashboard</h2>
      <h3>Pending Donors</h3>
      {pendingDonors.length === 0 && <p>No pending donors.</p>}
      <ul>
        {pendingDonors.map(donor => (
          <li key={donor.donorAddress}>
            {donor.medicalID} - {donor.donorAddress}
            <button onClick={() => handleVerifyDonor(donor.donorAddress)}>Verify</button>
            <button onClick={() => handleRejectDonor(donor.donorAddress)}>Reject</button>
          </li>
        ))}
      </ul>
      <h3>Pending Patients</h3>
      {pendingPatients.length === 0 && <p>No pending patients.</p>}
      <ul>
        {pendingPatients.map(patient => (
          <li key={patient.patientAddress}>
            {patient.medicalID} - {patient.patientAddress}
            <button onClick={() => handleVerifyPatient(patient.patientAddress)}>Verify</button>
            <button onClick={() => handleRejectPatient(patient.patientAddress)}>Reject</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default VerificationDashboard;

import React, { useState } from 'react';

const AdminPanel = ({ account, web3, role }) => {
  const [medicalProAddress, setMedicalProAddress] = useState('');
  const [medicalProName, setMedicalProName] = useState('');

  if (role !== 'admin') {
    return <p>Access denied. Only admins can access this panel.</p>;
  }

  const handleAddMedicalPro = () => {
    // TODO: Call contract to add medical professional
    alert(`Add medical professional ${medicalProName} at ${medicalProAddress} (functionality to be implemented)`);
  };

  const handleRemoveMedicalPro = () => {
    // TODO: Call contract to remove medical professional
    alert(`Remove medical professional at ${medicalProAddress} (functionality to be implemented)`);
  };

  const handleSimulateMatch = () => {
    // TODO: Call contract to simulate match
    alert('Simulate match (functionality to be implemented)');
  };

  return (
    <div>
      <h2>Admin Control Panel</h2>
      <div>
        <h3>Manage Medical Professionals</h3>
        <input
          type="text"
          placeholder="Medical Professional Address"
          value={medicalProAddress}
          onChange={e => setMedicalProAddress(e.target.value)}
        />
        <input
          type="text"
          placeholder="Medical Professional Name"
          value={medicalProName}
          onChange={e => setMedicalProName(e.target.value)}
        />
        <button onClick={handleAddMedicalPro}>Add Medical Professional</button>
        <button onClick={handleRemoveMedicalPro}>Remove Medical Professional</button>
      </div>
      <div>
        <h3>Match Simulation</h3>
        <button onClick={handleSimulateMatch}>Simulate Match</button>
      </div>
    </div>
  );
};

export default AdminPanel;

import React, { useState } from 'react';

const Registration = ({ account, web3 }) => {
  const [formType, setFormType] = useState('donor'); // donor or patient
  const [formData, setFormData] = useState({
    medicalID: '',
    organ: '',
    city: '',
    region: '',
    country: '',
    urgency: 'Low', // for patient only
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!web3) {
      alert('Web3 not loaded');
      return;
    }
    // TODO: Interact with smart contract to register donor or patient
    alert(`Submitting ${formType} registration (functionality to be implemented)`);
  };

  return (
    <div>
      <h2>Register as {formType === 'donor' ? 'Donor' : 'Patient'}</h2>
      <button onClick={() => setFormType('donor')}>Donor</button>
      <button onClick={() => setFormType('patient')}>Patient</button>
      <form onSubmit={handleSubmit}>
        <label>
          Medical ID:
          <input type="text" name="medicalID" value={formData.medicalID} onChange={handleChange} required />
        </label>
        <br />
        <label>
          {formType === 'donor' ? 'Organ to Donate:' : 'Organ Needed:'}
          <input type="text" name="organ" value={formData.organ} onChange={handleChange} required />
        </label>
        <br />
        <label>
          City:
          <input type="text" name="city" value={formData.city} onChange={handleChange} required />
        </label>
        <br />
        <label>
          Region:
          <input type="text" name="region" value={formData.region} onChange={handleChange} required />
        </label>
        <br />
        <label>
          Country:
          <input type="text" name="country" value={formData.country} onChange={handleChange} required />
        </label>
        <br />
        {formType === 'patient' && (
          <>
            <label>
              Urgency Level:
              <select name="urgency" value={formData.urgency} onChange={handleChange}>
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
                <option value="Critical">Critical</option>
              </select>
            </label>
            <br />
          </>
        )}
        <button type="submit">Register</button>
      </form>
    </div>
  );
};

export default Registration;

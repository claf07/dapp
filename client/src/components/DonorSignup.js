import React, { useState } from 'react';

const DonorSignup = () => {
  const [formData, setFormData] = useState({
    name: '',
    dob: '',
    sex: '',
    familyContactNumbers: ['', ''],
    familyPersonName: '',
    address: '',
    organsToDonate: '',
    bloodGroup: '',
    aadharNumber: '',
    password: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'familyContact1') {
      const newContacts = [...formData.familyContactNumbers];
      newContacts[0] = value;
      setFormData({ ...formData, familyContactNumbers: newContacts });
    } else if (name === 'familyContact2') {
      const newContacts = [...formData.familyContactNumbers];
      newContacts[1] = value;
      setFormData({ ...formData, familyContactNumbers: newContacts });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: Add blockchain interaction to register donor
    alert('Registered successfully');
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Donor Signup</h2>
      <label>Name:</label>
      <input type="text" name="name" value={formData.name} onChange={handleChange} required />

      <label>Date of Birth:</label>
      <input type="date" name="dob" value={formData.dob} onChange={handleChange} required />

      <label>Sex:</label>
      <select name="sex" value={formData.sex} onChange={handleChange} required>
        <option value="">Select</option>
        <option value="Male">Male</option>
        <option value="Female">Female</option>
        <option value="Other">Other</option>
      </select>

      <label>Family Contact Number 1:</label>
      <input type="tel" name="familyContact1" value={formData.familyContactNumbers[0]} onChange={handleChange} required />

      <label>Family Contact Number 2:</label>
      <input type="tel" name="familyContact2" value={formData.familyContactNumbers[1]} onChange={handleChange} required />

      <label>Family Person Name:</label>
      <input type="text" name="familyPersonName" value={formData.familyPersonName} onChange={handleChange} required />

      <label>Address:</label>
      <textarea name="address" value={formData.address} onChange={handleChange} required />

      <label>Organs to Donate (comma separated):</label>
      <input type="text" name="organsToDonate" value={formData.organsToDonate} onChange={handleChange} required />

      <label>Blood Group:</label>
      <input type="text" name="bloodGroup" value={formData.bloodGroup} onChange={handleChange} required />

      <label>Aadhar Number:</label>
      <input type="text" name="aadharNumber" value={formData.aadharNumber} onChange={handleChange} required />

      <label>Password:</label>
      <input type="password" name="password" value={formData.password} onChange={handleChange} required />

      <button type="submit">Register</button>
    </form>
  );
};

export default DonorSignup;

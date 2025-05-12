import React, { useState } from 'react';

const PatientSignup = () => {
  const [formData, setFormData] = useState({
    name: '',
    dob: '',
    sex: '',
    familyContactNumbers: ['', ''],
    familyPersonName: '',
    address: '',
    bloodGroup: '',
    aadharNumber: '',
    medicalReport: null,
    hospitalName: '',
    password: '',
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'familyContact1') {
      const newContacts = [...formData.familyContactNumbers];
      newContacts[0] = value;
      setFormData({ ...formData, familyContactNumbers: newContacts });
    } else if (name === 'familyContact2') {
      const newContacts = [...formData.familyContactNumbers];
      newContacts[1] = value;
      setFormData({ ...formData, familyContactNumbers: newContacts });
    } else if (name === 'medicalReport') {
      setFormData({ ...formData, medicalReport: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: Add blockchain interaction to register patient and upload medical report
    alert('Registered successfully');
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Patient Signup</h2>
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

      <label>Blood Group:</label>
      <input type="text" name="bloodGroup" value={formData.bloodGroup} onChange={handleChange} required />

      <label>Aadhar Number:</label>
      <input type="text" name="aadharNumber" value={formData.aadharNumber} onChange={handleChange} required />

      <label>Medical Report:</label>
      <input type="file" name="medicalReport" onChange={handleChange} required />

      <label>Hospital Name:</label>
      <input type="text" name="hospitalName" value={formData.hospitalName} onChange={handleChange} required />

      <label>Password:</label>
      <input type="password" name="password" value={formData.password} onChange={handleChange} required />

      <button type="submit">Register</button>
    </form>
  );
};

export default PatientSignup;

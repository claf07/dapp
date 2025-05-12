import React, { useState } from 'react';

const AdminSignup = () => {
  const [formData, setFormData] = useState({
    name: '',
    mobileNumber: '',
    post: '',
    password: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: Add blockchain interaction to register admin
    alert('Registration successful');
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Admin Signup</h2>
      <label>Name:</label>
      <input type="text" name="name" value={formData.name} onChange={handleChange} required />

      <label>Mobile Number:</label>
      <input type="tel" name="mobileNumber" value={formData.mobileNumber} onChange={handleChange} required />

      <label>Post:</label>
      <select name="post" value={formData.post} onChange={handleChange} required>
        <option value="">Select</option>
        <option value="Doctor">Doctor</option>
        <option value="Admin">Admin</option>
        <option value="Others">Others</option>
      </select>

      <label>Password:</label>
      <input type="password" name="password" value={formData.password} onChange={handleChange} required />

      <button type="submit">Register</button>
    </form>
  );
};

export default AdminSignup;

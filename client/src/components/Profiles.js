import React, { useState } from 'react';

const Profiles = ({ account, web3 }) => {
  const [address, setAddress] = useState(account);
  const [profile, setProfile] = useState(null);
  const [profileType, setProfileType] = useState('donor'); // donor or patient

  const handleChange = (e) => {
    setAddress(e.target.value);
  };

  const fetchProfile = async () => {
    if (!web3) {
      alert('Web3 not loaded');
      return;
    }
    // TODO: Fetch profile from contract
    alert(`Fetch ${profileType} profile for address ${address} (functionality to be implemented)`);
  };

  return (
    <div>
      <h2>View Profiles</h2>
      <label>
        Profile Type:
        <select value={profileType} onChange={e => setProfileType(e.target.value)}>
          <option value="donor">Donor</option>
          <option value="patient">Patient</option>
        </select>
      </label>
      <br />
      <label>
        Address:
        <input type="text" value={address} onChange={handleChange} />
      </label>
      <button onClick={fetchProfile}>Fetch Profile</button>
      {profile && (
        <div>
          <h3>{profileType.charAt(0).toUpperCase() + profileType.slice(1)} Profile</h3>
          {/* Display profile details */}
        </div>
      )}
    </div>
  );
};

export default Profiles;

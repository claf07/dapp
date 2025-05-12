import React from 'react';

const Home = ({ account }) => {
  return (
    <div>
      <h2>Welcome to the Organ Donation dApp</h2>
      <p>This decentralized application helps manage organ donation and matching on the Ethereum blockchain.</p>
      <p>Your connected wallet address: {account}</p>
    </div>
  );
};

export default Home;

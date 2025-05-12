import React, { useEffect, useState } from 'react';

const TokenGallery = ({ account, web3 }) => {
  const [badges, setBadges] = useState([]);

  useEffect(() => {
    // TODO: Fetch badges owned by the user from DonorBadge contract
  }, [account, web3]);

  return (
    <div>
      <h2>Donor Badges</h2>
      {badges.length === 0 ? (
        <p>No badges earned yet.</p>
      ) : (
        <ul>
          {badges.map((badge, index) => (
            <li key={index}>{badge}</li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default TokenGallery;

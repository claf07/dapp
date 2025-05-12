# Decentralized Organ Donation Platform

A blockchain-based platform for organ donation and transplantation management, built with Solidity, React, and Web3 technologies.

## Features

- **Smart Contract System**
  - Organ Donation Registry
  - Matching Algorithm
  - Emergency Request System
  - Donor Legacy NFT Badges
  - Reputation System

- **Advanced Features**
  - AI-Powered Matching
  - Real-time Analytics
  - Security Monitoring
  - Decentralized Identity
  - IPFS Storage

## Prerequisites

- Node.js >= 16.0.0
- Ganache or local Ethereum network
- MetaMask or Web3 wallet
- IPFS node (optional)

## Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/organ-donation-dapp.git
cd organ-donation-dapp
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
```
Edit `.env` with your configuration.

4. Start local blockchain:
```bash
npm run start:ganache
```

5. Deploy contracts:
```bash
npm run deploy:ganache
```

6. Start development server:
```bash
npm run dev
```

## Smart Contracts

### OrganDonationRegistry.sol
Main contract managing organ donations, matches, and emergency requests.

### DonorLegacyNFT.sol
NFT contract for donor legacy badges and achievements.

## Services

### Contract Service
Handles Web3 interactions and contract calls.

### Analytics Service
Provides insights and reporting on platform usage.

### Security Service
Monitors transactions and prevents abuse.

## Testing

Run tests:
```bash
npm test
```

## Deployment

1. Configure network in `hardhat.config.js`
2. Set environment variables
3. Run deployment script:
```bash
npx hardhat run scripts/deploy.js --network <network>
```

## Security

- Rate limiting
- Transaction monitoring
- Suspicious activity detection
- Access control
- Emergency pause functionality

## Contributing

1. Fork the repository
2. Create feature branch
3. Commit changes
4. Push to branch
5. Create Pull Request

## License

MIT License

## Support

For support, email support@organ-donation-dapp.com or open an issue.

## Acknowledgments

- OpenZeppelin
- Ceramic Network
- SpruceID
- IPFS
- TensorFlow.js 
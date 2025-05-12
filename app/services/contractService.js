import { ethers } from 'ethers';
import OrganDonationSystemABI from '../../contracts/OrganDonationSystem.json';

class ContractService {
  constructor() {
    this.contract = null;
    this.provider = null;
    this.signer = null;
  }

  async init() {
    if (!window.ethereum) throw new Error('Please install MetaMask');
    this.provider = new ethers.providers.Web3Provider(window.ethereum);
    this.signer = this.provider.getSigner();
    this.contract = new ethers.Contract(
      process.env.NEXT_PUBLIC_CONTRACT_ADDRESS,
      OrganDonationSystemABI.abi,
      this.signer
    );
  }

  // Donor Functions
  async registerDonor(donorData) {
    await this.init();
    const tx = await this.contract.registerUser(
      donorData.ipfsHash,
      0, // role = donor
      donorData.organs
    );
    return tx.wait();
  }

  async updateDonorStatus(status) {
    await this.init();
    const tx = await this.contract.updateDonorStatus(status);
    return tx.wait();
  }

  // Recipient Functions
  async registerRecipient(recipientData) {
    await this.init();
    const tx = await this.contract.registerUser(
      recipientData.ipfsHash,
      1, // role = recipient
      recipientData.neededOrgans
    );
    return tx.wait();
  }

  async requestOrgan(organType) {
    await this.init();
    const tx = await this.contract.createRequest(organType);
    return tx.wait();
  }

  // Admin Functions
  async verifyUser(userAddress) {
    await this.init();
    const tx = await this.contract.verifyUser(userAddress);
    return tx.wait();
  }

  async rejectUser(userAddress) {
    await this.init();
    const tx = await this.contract.rejectUser(userAddress);
    return tx.wait();
  }

  // Match Functions
  async findMatches() {
    await this.init();
    const tx = await this.contract.findMatches();
    return tx.wait();
  }

  async acceptMatch(matchId) {
    await this.init();
    const tx = await this.contract.acceptMatch(matchId);
    return tx.wait();
  }

  // View Functions
  async getDashboardStats() {
    await this.init();
    const stats = await this.contract.getStats();
    return {
      totalDonors: stats.donors.toString(),
      totalRecipients: stats.recipients.toString(),
      totalMatches: stats.matches.toString(),
      successfulTransplants: stats.completed.toString()
    };
  }

  async getUserRole(address) {
    await this.init();
    const user = await this.contract.users(address);
    return user.role;
  }

  async getOrganAvailability() {
    await this.init();
    return this.contract.getAvailableOrgans();
  }
}

export const contractService = new ContractService();
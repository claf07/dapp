import { ethers } from 'ethers';
import { storageService } from './storageService';

class GovernanceService {
  constructor() {
    this.provider = null;
    this.contract = null;
    this.snapshot = null;
  }

  async init() {
    if (typeof window.ethereum !== 'undefined') {
      this.provider = new ethers.providers.Web3Provider(window.ethereum);
      this.contract = new ethers.Contract(
        process.env.NEXT_PUBLIC_GOVERNANCE_CONTRACT,
        GovernanceABI,
        this.provider.getSigner()
      );
      this.snapshot = new ethers.Contract(
        process.env.NEXT_PUBLIC_SNAPSHOT_CONTRACT,
        SnapshotABI,
        this.provider.getSigner()
      );
    }
  }

  async createProposal(proposal) {
    try {
      await this.init();
      
      // Store proposal details on IPFS
      const proposalHash = await storageService.encryptAndStoreData(
        proposal,
        this.getAccessControlConditions()
      );

      // Create proposal on-chain
      const tx = await this.contract.createProposal(
        proposalHash.ipfsHash,
        proposal.type,
        proposal.emergencyLevel
      );

      await tx.wait();

      return {
        proposalId: tx.hash,
        ipfsHash: proposalHash.ipfsHash
      };
    } catch (error) {
      console.error('Error creating proposal:', error);
      throw error;
    }
  }

  async vote(proposalId, vote, reason) {
    try {
      await this.init();

      // Store vote reason on IPFS
      const voteHash = await storageService.encryptAndStoreData(
        { reason, timestamp: new Date().toISOString() },
        this.getAccessControlConditions()
      );

      // Submit vote on-chain
      const tx = await this.contract.vote(
        proposalId,
        vote,
        voteHash.ipfsHash
      );

      await tx.wait();

      return {
        voteId: tx.hash,
        ipfsHash: voteHash.ipfsHash
      };
    } catch (error) {
      console.error('Error voting:', error);
      throw error;
    }
  }

  async getProposalDetails(proposalId) {
    try {
      await this.init();

      const proposal = await this.contract.getProposal(proposalId);
      const details = await storageService.retrieveAndDecryptData(
        proposal.ipfsHash,
        this.getAccessControlConditions()
      );

      return {
        ...proposal,
        details
      };
    } catch (error) {
      console.error('Error getting proposal details:', error);
      throw error;
    }
  }

  async getVotingPower(address) {
    try {
      await this.init();
      return await this.contract.getVotingPower(address);
    } catch (error) {
      console.error('Error getting voting power:', error);
      throw error;
    }
  }

  async getProposalVotes(proposalId) {
    try {
      await this.init();

      const votes = await this.contract.getProposalVotes(proposalId);
      const voteDetails = await Promise.all(
        votes.map(async (vote) => {
          const details = await storageService.retrieveAndDecryptData(
            vote.ipfsHash,
            this.getAccessControlConditions()
          );
          return {
            ...vote,
            details
          };
        })
      );

      return voteDetails;
    } catch (error) {
      console.error('Error getting proposal votes:', error);
      throw error;
    }
  }

  async createEmergencyProposal(proposal) {
    try {
      await this.init();

      // Verify emergency level
      if (!this.isValidEmergencyLevel(proposal.emergencyLevel)) {
        throw new Error('Invalid emergency level');
      }

      // Create proposal with emergency flag
      return this.createProposal({
        ...proposal,
        emergency: true,
        emergencyLevel: proposal.emergencyLevel
      });
    } catch (error) {
      console.error('Error creating emergency proposal:', error);
      throw error;
    }
  }

  isValidEmergencyLevel(level) {
    return ['low', 'medium', 'high', 'critical'].includes(level);
  }

  getAccessControlConditions() {
    return [
      {
        contractAddress: process.env.NEXT_PUBLIC_ACCESS_CONTROL_CONTRACT,
        standardContractType: 'ERC721',
        chain: 'ethereum',
        method: 'balanceOf',
        parameters: [':userAddress'],
        returnValueTest: {
          comparator: '>',
          value: '0'
        }
      }
    ];
  }

  async getHospitalReputation(hospitalAddress) {
    try {
      await this.init();
      return await this.contract.getHospitalReputation(hospitalAddress);
    } catch (error) {
      console.error('Error getting hospital reputation:', error);
      throw error;
    }
  }

  async updateHospitalReputation(hospitalAddress, score) {
    try {
      await this.init();
      const tx = await this.contract.updateHospitalReputation(hospitalAddress, score);
      await tx.wait();
      return tx.hash;
    } catch (error) {
      console.error('Error updating hospital reputation:', error);
      throw error;
    }
  }
}

export const governanceService = new GovernanceService(); 
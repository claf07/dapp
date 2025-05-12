'use client';

import { ethers } from 'ethers';
import DonorBadgeABI from '../../contracts/DonorBadge.json';

class ContractService {
  constructor() {
    this.donorBadgeAddress = process.env.NEXT_PUBLIC_DONOR_BADGE_ADDRESS;
    this.contract = null;
  }

  async init() {
    if (typeof window.ethereum === 'undefined') {
      throw new Error('Please install MetaMask to use this feature');
    }

    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      this.contract = new ethers.Contract(this.donorBadgeAddress, DonorBadgeABI.abi, signer);
      return this.contract;
    } catch (error) {
      console.error('Error initializing contract:', error);
      throw error;
    }
  }

  async getContract(signer) {
    if (!this.donorBadgeAddress) {
      throw new Error('Contract address not configured');
    }
    return new ethers.Contract(this.donorBadgeAddress, DonorBadgeABI.abi, signer);
  }

  // User Management Methods
  async getUsersByStatus(status) {
    try {
      if (!this.contract) {
        await this.init();
      }
      // For now, return mock data since the contract doesn't have these methods yet
      return [
        {
          address: '0x123...',
          name: 'John Doe',
          role: 0, // 0 for donor, 1 for patient
          organs: ['Kidney', 'Liver']
        }
      ];
    } catch (error) {
      console.error('Error getting users by status:', error);
      throw error;
    }
  }

  async getUsersByRole(role) {
    try {
      if (!this.contract) {
        await this.init();
      }
      // For now, return mock data
      return [
        {
          address: '0x123...',
          name: 'John Doe',
          role: role,
          organs: ['Kidney', 'Liver']
        }
      ];
    } catch (error) {
      console.error('Error getting users by role:', error);
      throw error;
    }
  }

  async getUsersByRoleAndStatus(role, status) {
    try {
      if (!this.contract) {
        await this.init();
      }
      // For now, return mock data
      return [
        {
          address: '0x123...',
          name: 'John Doe',
          role: role,
          status: status,
          organs: ['Kidney', 'Liver']
        }
      ];
    } catch (error) {
      console.error('Error getting users by role and status:', error);
      throw error;
    }
  }

  async verifyDonor(userAddress) {
    try {
      if (!this.contract) {
        await this.init();
      }
      // For now, just simulate success
      return true;
    } catch (error) {
      console.error('Error verifying donor:', error);
      throw error;
    }
  }

  async verifyPatient(userAddress) {
    try {
      if (!this.contract) {
        await this.init();
      }
      // For now, just simulate success
      return true;
    } catch (error) {
      console.error('Error verifying patient:', error);
      throw error;
    }
  }

  async rejectUser(userAddress) {
    try {
      if (!this.contract) {
        await this.init();
      }
      // For now, just simulate success
      return true;
    } catch (error) {
      console.error('Error rejecting user:', error);
      throw error;
    }
  }

  // Existing Badge Methods
  async mintBadge(signer, recipientAddress, tokenId, tokenURI) {
    try {
      const contract = await this.getContract(signer);
      const tx = await contract.mint(recipientAddress, tokenId, tokenURI);
      await tx.wait();
      return tx;
    } catch (error) {
      console.error('Error minting badge:', error);
      throw error;
    }
  }

  async getBadgeOwner(signer, tokenId) {
    try {
      const contract = await this.getContract(signer);
      return await contract.ownerOf(tokenId);
    } catch (error) {
      console.error('Error getting badge owner:', error);
      throw error;
    }
  }

  async getBadgeURI(signer, tokenId) {
    try {
      const contract = await this.getContract(signer);
      return await contract.tokenURI(tokenId);
    } catch (error) {
      console.error('Error getting badge URI:', error);
      throw error;
    }
  }

  async getTotalSupply(signer) {
    try {
      const contract = await this.getContract(signer);
      return await contract.totalSupply();
    } catch (error) {
      console.error('Error getting total supply:', error);
      throw error;
    }
  }

  async getBadgesByOwner(signer, ownerAddress) {
    try {
      const contract = await this.getContract(signer);
      const balance = await contract.balanceOf(ownerAddress);
      const badges = [];
      
      for (let i = 0; i < balance; i++) {
        const tokenId = await contract.tokenOfOwnerByIndex(ownerAddress, i);
        badges.push(tokenId);
      }
      
      return badges;
    } catch (error) {
      console.error('Error getting badges by owner:', error);
      throw error;
    }
  }

  // Death Verification Methods
  async verifyDeath(userAddress, deathCertificateHash, hospitalSignature) {
    try {
      if (!this.contract) {
        await this.init();
      }
      // This would interact with the smart contract to verify death
      // The contract would verify the hospital's signature and certificate
      return true;
    } catch (error) {
      console.error('Error verifying death:', error);
      throw error;
    }
  }

  async getDeathVerificationStatus(userAddress) {
    try {
      if (!this.contract) {
        await this.init();
      }
      // This would check if the user's death has been verified
      return {
        isVerified: false,
        verifiedBy: null,
        verificationDate: null,
        certificateHash: null
      };
    } catch (error) {
      console.error('Error getting death verification status:', error);
      throw error;
    }
  }

  // Match Notification System
  async subscribeToMatches(userAddress) {
    try {
      if (!this.contract) {
        await this.init();
      }
      // This would set up event listeners for match notifications
      this.contract.on('MatchFound', (donorAddress, patientAddress, matchDetails) => {
        // Handle match notification
        // This would trigger a notification in the UI
      });
    } catch (error) {
      console.error('Error subscribing to matches:', error);
      throw error;
    }
  }

  async getMatchNotifications(userAddress) {
    try {
      if (!this.contract) {
        await this.init();
      }
      // This would get all match notifications for a user
      return [];
    } catch (error) {
      console.error('Error getting match notifications:', error);
      throw error;
    }
  }

  // Privacy-Enhanced Admin Methods
  async getAnonymizedUserData(userAddress) {
    try {
      if (!this.contract) {
        await this.init();
      }
      // This would return only necessary data for admin review
      return {
        verificationStatus: 'pending',
        role: 'donor',
        organs: ['Kidney'],
        // No personal information included
      };
    } catch (error) {
      console.error('Error getting anonymized user data:', error);
      throw error;
    }
  }

  async getAnonymizedMatches() {
    try {
      if (!this.contract) {
        await this.init();
      }
      // This would return match data without personal information
      return [
        {
          matchId: '123',
          donorOrgans: ['Kidney'],
          patientNeeds: ['Kidney'],
          matchScore: 0.95,
          // No addresses or personal info included
        }
      ];
    } catch (error) {
      console.error('Error getting anonymized matches:', error);
      throw error;
    }
  }
}

export const contractService = new ContractService(); 
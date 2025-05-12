'use client';

import { ethers } from 'ethers';
import OrganDonationSystemABI from '../../contracts/OrganDonationSystem.json';
import { storageService } from './storageService';

class MatchingService {
  constructor() {
    this.provider = null;
    this.contract = null;
    this.compatibilityScores = new Map();
  }

  async init() {
    if (typeof window.ethereum === 'undefined') {
      throw new Error('Please install MetaMask to use this feature');
    }

    try {
      this.provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await this.provider.getSigner();
      this.contract = new ethers.Contract(
        process.env.NEXT_PUBLIC_ORGAN_DONATION_ADDRESS,
        OrganDonationSystemABI.abi,
        signer
      );
    } catch (error) {
      console.error('Error initializing matching service:', error);
      throw error;
    }
  }

  async calculateCompatibilityScore(donor, recipient) {
    const baseScore = this.calculateBaseScore(donor, recipient);
    const urgencyScore = this.calculateUrgencyScore(recipient);
    const locationScore = this.calculateLocationScore(donor, recipient);
    const reputationScore = await this.calculateReputationScore(donor);

    return {
      totalScore: baseScore + urgencyScore + locationScore + reputationScore,
      breakdown: {
        baseScore,
        urgencyScore,
        locationScore,
        reputationScore
      }
    };
  }

  calculateBaseScore(donor, recipient) {
    let score = 0;
    
    // Blood type compatibility
    if (this.isBloodTypeCompatible(donor.bloodType, recipient.bloodType)) {
      score += 40;
    }

    // Age compatibility
    const ageDiff = Math.abs(donor.age - recipient.age);
    if (ageDiff <= 10) score += 20;
    else if (ageDiff <= 20) score += 10;

    // Organ type match
    if (donor.organType === recipient.requiredOrgan) {
      score += 30;
    }

    return score;
  }

  calculateUrgencyScore(recipient) {
    const urgencyLevels = {
      'critical': 50,
      'urgent': 30,
      'stable': 10
    };
    return urgencyLevels[recipient.urgencyLevel] || 0;
  }

  calculateLocationScore(donor, recipient) {
    // Calculate distance between donor and recipient
    const distance = this.calculateDistance(
      donor.location,
      recipient.location
    );

    // Score based on distance (closer is better)
    if (distance <= 100) return 30;
    if (distance <= 300) return 20;
    if (distance <= 500) return 10;
    return 0;
  }

  async calculateReputationScore(donor) {
    // Get donor's history from IPFS
    const donorHistory = await storageService.retrieveMedicalRecords(
      donor.medicalRecordsHash,
      donor.address
    );

    // Calculate reputation based on past donations and verifications
    let score = 0;
    if (donorHistory.successfulDonations > 0) {
      score += Math.min(donorHistory.successfulDonations * 5, 20);
    }
    if (donorHistory.verifiedByHospitals > 0) {
      score += Math.min(donorHistory.verifiedByHospitals * 3, 15);
    }

    return score;
  }

  isBloodTypeCompatible(donorType, recipientType) {
    const compatibilityMatrix = {
      'O-': ['O-'],
      'O+': ['O+', 'O-'],
      'A-': ['A-', 'O-'],
      'A+': ['A+', 'A-', 'O+', 'O-'],
      'B-': ['B-', 'O-'],
      'B+': ['B+', 'B-', 'O+', 'O-'],
      'AB-': ['AB-', 'A-', 'B-', 'O-'],
      'AB+': ['AB+', 'AB-', 'A+', 'A-', 'B+', 'B-', 'O+', 'O-']
    };

    return compatibilityMatrix[donorType]?.includes(recipientType) || false;
  }

  calculateDistance(loc1, loc2) {
    // Haversine formula for calculating distance between two points
    const R = 6371; // Earth's radius in km
    const dLat = this.toRad(loc2.lat - loc1.lat);
    const dLon = this.toRad(loc2.lon - loc1.lon);
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(this.toRad(loc1.lat)) * Math.cos(this.toRad(loc2.lat)) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  }

  toRad(value) {
    return value * Math.PI / 180;
  }

  async findMatches(recipient) {
    const availableDonors = await this.getAvailableDonors();
    const matches = [];

    for (const donor of availableDonors) {
      const score = await this.calculateCompatibilityScore(donor, recipient);
      if (score.totalScore >= 70) { // Minimum threshold for matching
        matches.push({
          donor,
          score,
          timestamp: new Date().toISOString()
        });
      }
    }

    return matches.sort((a, b) => b.score.totalScore - a.score.totalScore);
  }

  async getAvailableDonors() {
    // This would typically fetch from your smart contract
    // For now, returning mock data
    return [
      {
        address: '0x123...',
        organType: 'kidney',
        bloodType: 'O+',
        age: 35,
        location: { lat: 40.7128, lon: -74.0060 },
        medicalRecordsHash: 'Qm...'
      }
      // Add more mock donors as needed
    ];
  }

  // Calculate match score based on various factors
  calculateMatchScore(donor, patient) {
    let score = 0;
    const weights = {
      bloodType: 0.3,
      tissueType: 0.3,
      urgency: 0.2,
      waitingTime: 0.1,
      location: 0.1
    };

    // Blood type compatibility
    if (this.isBloodTypeCompatible(donor.bloodType, patient.bloodType)) {
      score += weights.bloodType;
    }

    // Tissue type matching
    const tissueMatchScore = this.calculateTissueMatchScore(donor.tissueType, patient.tissueType);
    score += tissueMatchScore * weights.tissueType;

    // Urgency factor
    score += (patient.urgency / 10) * weights.urgency;

    // Waiting time factor
    const waitingTimeScore = Math.min(patient.waitingTime / 365, 1); // Normalize to 1 year
    score += waitingTimeScore * weights.waitingTime;

    // Location factor (closer is better)
    const locationScore = this.calculateLocationScore(donor.location, patient.location);
    score += locationScore * weights.location;

    return score;
  }

  calculateTissueMatchScore(donorTissue, patientTissue) {
    // Implement HLA matching algorithm
    // This is a simplified version - in reality, you'd need a more complex algorithm
    let matchCount = 0;
    const totalMarkers = Object.keys(donorTissue).length;

    for (const marker in donorTissue) {
      if (donorTissue[marker] === patientTissue[marker]) {
        matchCount++;
      }
    }

    return matchCount / totalMarkers;
  }

  isCompatible(donor, patient) {
    // Check basic compatibility
    return (
      this.isBloodTypeCompatible(donor.bloodType, patient.bloodType) &&
      this.hasMatchingOrgans(donor, patient) &&
      !this.isRejectedMatch(donor.address, patient.address)
    );
  }

  hasMatchingOrgans(donor, patient) {
    return donor.organs.some(organ => patient.neededOrgans.includes(organ));
  }

  findMatchingOrgans(donor, patient) {
    return donor.organs.filter(organ => patient.neededOrgans.includes(organ));
  }

  async isRejectedMatch(donorAddress, patientAddress) {
    try {
      if (!this.contract) {
        await this.init();
      }
      return await this.contract.isRejectedMatch(donorAddress, patientAddress);
    } catch (error) {
      console.error('Error checking rejected match:', error);
      return false;
    }
  }
}

export const matchingService = new MatchingService(); 
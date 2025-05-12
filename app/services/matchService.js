import { ethers } from 'ethers';
import { useNotification } from '../contexts/NotificationContext';

class MatchService {
  constructor(contract, provider) {
    this.contract = contract;
    this.provider = provider;
  }

  async confirmDonorDeath(donorAddress, deathCertificateHash, hospitalSignature) {
    try {
      // Verify the hospital signature
      const isValidSignature = await this.verifyHospitalSignature(
        deathCertificateHash,
        hospitalSignature
      );

      if (!isValidSignature) {
        throw new Error('Invalid hospital signature');
      }

      // Call smart contract to confirm donor death
      const tx = await this.contract.confirmDonorDeath(
        donorAddress,
        deathCertificateHash,
        hospitalSignature
      );
      await tx.wait();

      // Get all pending matches for the donor's organs
      const matches = await this.findMatchesForDonor(donorAddress);

      // Send notifications for each match
      for (const match of matches) {
        await this.sendMatchNotification(match);
      }

      return {
        success: true,
        matches: matches.length,
      };
    } catch (error) {
      console.error('Error confirming donor death:', error);
      throw error;
    }
  }

  async verifyHospitalSignature(deathCertificateHash, signature) {
    try {
      const messageHash = ethers.utils.hashMessage(deathCertificateHash);
      const recoveredAddress = ethers.utils.recoverAddress(messageHash, signature);
      
      // Check if the recovered address is a registered hospital
      const isRegisteredHospital = await this.contract.isRegisteredHospital(recoveredAddress);
      return isRegisteredHospital;
    } catch (error) {
      console.error('Error verifying hospital signature:', error);
      return false;
    }
  }

  async findMatchesForDonor(donorAddress) {
    try {
      // Get donor's registered organs
      const donorOrgans = await this.contract.getDonorOrgans(donorAddress);
      
      const matches = [];
      
      // For each organ, find matching patients
      for (const organ of donorOrgans) {
        const organMatches = await this.contract.findMatchesForOrgan(
          organ,
          donorAddress
        );
        
        matches.push(...organMatches);
      }

      return matches;
    } catch (error) {
      console.error('Error finding matches:', error);
      throw error;
    }
  }

  async sendMatchNotification(match) {
    try {
      // Get patient details
      const patient = await this.contract.getPatientDetails(match.patientAddress);
      
      // Get donor details
      const donor = await this.contract.getDonorDetails(match.donorAddress);

      // Prepare notification data
      const notificationData = {
        type: 'MATCH_FOUND',
        patientAddress: match.patientAddress,
        donorAddress: match.donorAddress,
        organ: match.organ,
        urgency: patient.urgency,
        bloodType: {
          donor: donor.bloodType,
          patient: patient.bloodType,
        },
        compatibility: match.compatibility,
        hospital: patient.hospital,
        timestamp: Date.now(),
      };

      // Send notification to patient
      await this.contract.sendMatchNotification(
        match.patientAddress,
        notificationData
      );

      // Send notification to patient's hospital
      await this.contract.sendHospitalNotification(
        patient.hospital,
        notificationData
      );

      // Emit match event
      await this.contract.emitMatchEvent(notificationData);

      return {
        success: true,
        notificationData,
      };
    } catch (error) {
      console.error('Error sending match notification:', error);
      throw error;
    }
  }

  async getMatchStatus(matchId) {
    try {
      const match = await this.contract.getMatchDetails(matchId);
      return {
        status: match.status,
        lastUpdated: match.lastUpdated,
        actions: match.requiredActions,
      };
    } catch (error) {
      console.error('Error getting match status:', error);
      throw error;
    }
  }
}

export default MatchService; 
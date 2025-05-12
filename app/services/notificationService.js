'use client';

import { ethers } from 'ethers';
import OrganDonationSystemABI from '../../contracts/OrganDonationSystem.json';

class NotificationService {
  constructor() {
    this.provider = null;
    this.contract = null;
    this.listeners = new Map();
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
      console.error('Error initializing notification service:', error);
      throw error;
    }
  }

  async subscribeToNotifications(userAddress, callback) {
    try {
      if (!this.contract) {
        await this.init();
      }

      // Subscribe to MatchFound event
      this.contract.on('MatchFound', (matchId, donor, patient, matchDetails) => {
        if (patient === userAddress || donor === userAddress) {
          callback({
            type: 'match',
            matchId,
            donor,
            patient,
            details: matchDetails
          });
        }
      });

      // Subscribe to DeathVerified event
      this.contract.on('DeathVerified', (userAddress, verifier) => {
        if (userAddress === userAddress) {
          callback({
            type: 'death_verification',
            userAddress,
            verifier
          });
        }
      });

      // Subscribe to MatchAccepted event
      this.contract.on('MatchAccepted', (matchId) => {
        callback({
          type: 'match_accepted',
          matchId
        });
      });

      // Subscribe to MatchCompleted event
      this.contract.on('MatchCompleted', (matchId) => {
        callback({
          type: 'match_completed',
          matchId
        });
      });

      // Store the callback for cleanup
      this.listeners.set(userAddress, callback);

    } catch (error) {
      console.error('Error subscribing to notifications:', error);
      throw error;
    }
  }

  async unsubscribeFromNotifications(userAddress) {
    try {
      if (!this.contract) {
        return;
      }

      // Remove all listeners for the user
      this.contract.removeAllListeners();
      this.listeners.delete(userAddress);

    } catch (error) {
      console.error('Error unsubscribing from notifications:', error);
      throw error;
    }
  }

  async getNotifications(userAddress) {
    try {
      if (!this.contract) {
        await this.init();
      }

      const notifications = await this.contract.getUserNotifications(userAddress);
      return notifications.map(notification => ({
        id: notification.notificationId,
        message: notification.message,
        isRead: notification.isRead,
        timestamp: new Date(notification.timestamp * 1000)
      }));

    } catch (error) {
      console.error('Error getting notifications:', error);
      throw error;
    }
  }

  async markNotificationAsRead(userAddress, notificationId) {
    try {
      if (!this.contract) {
        await this.init();
      }

      const tx = await this.contract.markNotificationAsRead(notificationId);
      await tx.wait();

    } catch (error) {
      console.error('Error marking notification as read:', error);
      throw error;
    }
  }

  // Push notification support
  async requestPushNotificationPermission() {
    try {
      const permission = await Notification.requestPermission();
      return permission === 'granted';
    } catch (error) {
      console.error('Error requesting push notification permission:', error);
      return false;
    }
  }

  async sendPushNotification(title, options) {
    try {
      if (Notification.permission === 'granted') {
        new Notification(title, options);
      }
    } catch (error) {
      console.error('Error sending push notification:', error);
    }
  }
}

export const notificationService = new NotificationService(); 
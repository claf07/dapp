import { authenticator } from 'otplib';
import QRCode from 'qrcode';
import { ipfsService } from './ipfsService';

class AuthService {
  constructor() {
    this.secret = null;
    this.isAuthenticated = false;
    this.mfaEnabled = false;
  }

  // Generate MFA secret and QR code
  async generateMFASecret(userId) {
    try {
      this.secret = authenticator.generateSecret();
      const otpauth = authenticator.keyuri(userId, 'OrganDonation', this.secret);
      const qrCode = await QRCode.toDataURL(otpauth);
      
      // Store secret in IPFS
      const secretData = {
        userId,
        secret: this.secret,
        timestamp: Date.now()
      };
      
      const hash = await ipfsService.uploadJSON(secretData);
      return { secret: this.secret, qrCode, hash };
    } catch (error) {
      console.error('Error generating MFA secret:', error);
      throw new Error('Failed to generate MFA secret');
    }
  }

  // Verify MFA token
  verifyMFAToken(token) {
    try {
      return authenticator.verify({
        token,
        secret: this.secret
      });
    } catch (error) {
      console.error('Error verifying MFA token:', error);
      return false;
    }
  }

  // Enable MFA for user
  async enableMFA(userId, token) {
    try {
      if (!this.verifyMFAToken(token)) {
        throw new Error('Invalid MFA token');
      }

      const { secret, qrCode, hash } = await this.generateMFASecret(userId);
      this.mfaEnabled = true;
      
      return { secret, qrCode, hash };
    } catch (error) {
      console.error('Error enabling MFA:', error);
      throw new Error('Failed to enable MFA');
    }
  }

  // Disable MFA for user
  async disableMFA(userId, token) {
    try {
      if (!this.verifyMFAToken(token)) {
        throw new Error('Invalid MFA token');
      }

      this.mfaEnabled = false;
      this.secret = null;
      
      // Remove secret from IPFS
      // Implementation depends on your IPFS storage strategy
      
      return true;
    } catch (error) {
      console.error('Error disabling MFA:', error);
      throw new Error('Failed to disable MFA');
    }
  }

  // Login with MFA
  async loginWithMFA(userId, password, token) {
    try {
      // First verify password (implement your password verification logic)
      const passwordValid = await this.verifyPassword(userId, password);
      if (!passwordValid) {
        throw new Error('Invalid password');
      }

      // Then verify MFA token if MFA is enabled
      if (this.mfaEnabled) {
        const tokenValid = this.verifyMFAToken(token);
        if (!tokenValid) {
          throw new Error('Invalid MFA token');
        }
      }

      this.isAuthenticated = true;
      return true;
    } catch (error) {
      console.error('Error during MFA login:', error);
      throw new Error('Login failed');
    }
  }

  // Verify password (implement your password verification logic)
  async verifyPassword(userId, password) {
    try {
      // Fetch user data from localStorage
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      const user = users.find(u => u.id === userId);
      
      if (!user) {
        throw new Error('User not found');
      }

      // Compare password (in a real app, use bcrypt or similar)
      return user.password === password;
    } catch (error) {
      console.error('Error verifying password:', error);
      return false;
    }
  }

  // Logout
  logout() {
    this.isAuthenticated = false;
    this.secret = null;
  }

  // Check if MFA is enabled
  isMFAEnabled() {
    return this.mfaEnabled;
  }

  // Check if user is authenticated
  isUserAuthenticated() {
    return this.isAuthenticated;
  }
}

export const authService = new AuthService(); 
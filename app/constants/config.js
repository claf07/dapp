export const CONFIG = {
  // Network Configuration
  NETWORK: {
    ID: process.env.NEXT_PUBLIC_NETWORK_ID || '1337',
    RPC_URL: process.env.NEXT_PUBLIC_RPC_URL || 'http://127.0.0.1:7545',
    CHAIN_ID: '0x539' // 1337 in hex
  },

  // Contract Addresses
  CONTRACTS: {
    ORGAN_DONATION: process.env.NEXT_PUBLIC_ORGAN_DONATION_ADDRESS,
    DONOR_BADGE: process.env.NEXT_PUBLIC_DONOR_BADGE_ADDRESS
  },

  // IPFS Configuration
  IPFS: {
    PROJECT_ID: process.env.NEXT_PUBLIC_INFURA_PROJECT_ID,
    PROJECT_SECRET: process.env.NEXT_PUBLIC_INFURA_PROJECT_SECRET,
    GATEWAY: process.env.NEXT_PUBLIC_IPFS_GATEWAY || 'https://ipfs.io/ipfs/'
  },

  // Authentication
  AUTH: {
    URL: process.env.NEXTAUTH_URL || 'http://localhost:3000',
    SECRET: process.env.NEXTAUTH_SECRET
  },

  // Hospital Configuration
  HOSPITAL: {
    REQUIRED_VERIFICATIONS: parseInt(process.env.NEXT_PUBLIC_REQUIRED_HOSPITAL_VERIFICATIONS || '3')
  },

  // Matching Algorithm Configuration
  MATCHING: {
    MIN_SCORE: parseFloat(process.env.NEXT_PUBLIC_MIN_MATCH_SCORE || '0.7'),
    MAX_DISTANCE: parseInt(process.env.NEXT_PUBLIC_MAX_MATCH_DISTANCE || '1000')
  },

  // Notification Configuration
  NOTIFICATION: {
    DURATION: parseInt(process.env.NEXT_PUBLIC_NOTIFICATION_DURATION || '5000'),
    PUSH_ENABLED: process.env.NEXT_PUBLIC_PUSH_NOTIFICATION_ENABLED === 'true'
  },

  // Privacy Configuration
  PRIVACY: {
    ENCRYPTION_KEY: process.env.NEXT_PUBLIC_ENCRYPTION_KEY
  },

  // UI Configuration
  UI: {
    THEME: {
      PRIMARY: '#4F46E5',
      SECONDARY: '#10B981',
      ERROR: '#EF4444',
      WARNING: '#F59E0B',
      SUCCESS: '#10B981',
      INFO: '#3B82F6'
    },
    BREAKPOINTS: {
      SM: '640px',
      MD: '768px',
      LG: '1024px',
      XL: '1280px',
      '2XL': '1536px'
    }
  },

  // API Endpoints
  API: {
    BASE_URL: '/api',
    ENDPOINTS: {
      AUTH: '/auth',
      USERS: '/users',
      HOSPITALS: '/hospitals',
      DONORS: '/donors',
      PATIENTS: '/patients',
      MATCHES: '/matches',
      NOTIFICATIONS: '/notifications'
    }
  },

  // Validation Rules
  VALIDATION: {
    PASSWORD: {
      MIN_LENGTH: 8,
      REQUIRE_UPPERCASE: true,
      REQUIRE_LOWERCASE: true,
      REQUIRE_NUMBER: true,
      REQUIRE_SPECIAL: false
    },
    USERNAME: {
      MIN_LENGTH: 3,
      MAX_LENGTH: 20,
      ALLOW_SPECIAL: false
    }
  },

  // File Upload
  UPLOAD: {
    MAX_SIZE: 5 * 1024 * 1024, // 5MB
    ALLOWED_TYPES: ['image/jpeg', 'image/png', 'application/pdf'],
    MAX_FILES: 5
  },

  // Cache Configuration
  CACHE: {
    TTL: 3600, // 1 hour in seconds
    PREFIX: 'organ_donation_'
  }
};

export const ROLES = {
  ADMIN: 'ADMIN',
  HOSPITAL: 'HOSPITAL',
  DONOR: 'DONOR',
  PATIENT: 'PATIENT'
};

export const STATUS = {
  ACTIVE: 'ACTIVE',
  INACTIVE: 'INACTIVE',
  PENDING: 'PENDING',
  VERIFIED: 'VERIFIED',
  REJECTED: 'REJECTED'
};

export const ORGAN_TYPES = [
  'kidney',
  'liver',
  'heart',
  'lung',
  'pancreas',
  'intestine',
  'cornea',
  'bone_marrow'
];

export const BLOOD_TYPES = [
  'A+',
  'A-',
  'B+',
  'B-',
  'AB+',
  'AB-',
  'O+',
  'O-'
];

export const URGENCY_LEVELS = {
  CRITICAL: 'CRITICAL',
  HIGH: 'HIGH',
  MEDIUM: 'MEDIUM',
  LOW: 'LOW'
};

export const NOTIFICATION_TYPES = {
  MATCH_FOUND: 'MATCH_FOUND',
  VERIFICATION_REQUIRED: 'VERIFICATION_REQUIRED',
  VERIFICATION_COMPLETE: 'VERIFICATION_COMPLETE',
  DONATION_APPROVED: 'DONATION_APPROVED',
  DONATION_REJECTED: 'DONATION_REJECTED',
  SYSTEM_UPDATE: 'SYSTEM_UPDATE'
}; 
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../contexts/AuthContext';
import { useWeb3 } from '../contexts/Web3Context';
import { useNotification } from '../contexts/NotificationContext';
import LoadingSpinner from '../components/LoadingSpinner';

export default function Register() {
  const router = useRouter();
  const { login, register } = useAuth();
  const { account } = useWeb3();
  const { showNotification } = useNotification();
  const [isLogin, setIsLogin] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'donor',
    bloodGroup: '',
    organs: [],
    medicalHistory: '',
    address: '',
    phoneNumber: '',
    age: '',
    gender: '',
    weight: '',
    height: '',
    allergies: '',
    currentMedications: '',
    emergencyContact: {
      name: '',
      relationship: '',
      phone: ''
    }
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith('emergencyContact.')) {
      const field = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        emergencyContact: {
          ...prev.emergencyContact,
          [field]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const validateForm = () => {
    // Basic validation for both login and registration
    if (!formData.email || !formData.password) {
      showNotification('Please enter your email and password', 'error');
      return false;
    }

    // Additional validation for registration only
    if (!isLogin) {
      const requiredFields = {
        name: 'Full Name',
        role: 'Role',
        bloodGroup: 'Blood Group',
        medicalHistory: 'Medical History',
        address: 'Address',
        phoneNumber: 'Phone Number',
        age: 'Age',
        gender: 'Gender',
        weight: 'Weight',
        height: 'Height'
      };

      for (const [field, label] of Object.entries(requiredFields)) {
        if (!formData[field]) {
          showNotification(`Please enter your ${label}`, 'error');
          return false;
        }
      }

      // Validate emergency contact
      const emergencyFields = {
        name: 'Emergency Contact Name',
        relationship: 'Relationship',
        phone: 'Emergency Contact Phone'
      };

      for (const [field, label] of Object.entries(emergencyFields)) {
        if (!formData.emergencyContact[field]) {
          showNotification(`Please enter ${label}`, 'error');
          return false;
        }
      }
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!account) {
      showNotification('Please connect your wallet first', 'error');
      return;
    }

    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);
      if (isLogin) {
        const userData = await login(formData.email, formData.password);
        showNotification('Login successful!', 'success');
        router.push(`/${userData.role}/dashboard`);
      } else {
        const userData = await register({
          ...formData,
          walletAddress: account
        });
        showNotification('Registration successful! Please wait for admin verification.', 'success');
        router.push('/');
      }
    } catch (error) {
      console.error(isLogin ? 'Login error:' : 'Registration error:', error);
      showNotification(error.message || (isLogin ? 'Login failed' : 'Registration failed'), 'error');
    } finally {
      setLoading(false);
    }
  };

  if (!account) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div>
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
              Please connect your wallet to continue
            </h2>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            {isLogin ? 'Sign in to your account' : 'Create your account'}
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            {isLogin ? (
              <>
                Don't have an account?{' '}
                <button
                  onClick={() => setIsLogin(false)}
                  className="font-medium text-blue-600 hover:text-blue-500"
                >
                  Register here
                </button>
              </>
            ) : (
              <>
                Already have an account?{' '}
                <button
                  onClick={() => setIsLogin(true)}
                  className="font-medium text-blue-600 hover:text-blue-500"
                >
                  Sign in here
                </button>
              </>
            )}
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">
            {!isLogin && (
              <>
                <div>
                  <label htmlFor="name" className="sr-only">Full Name</label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    required
                    className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                    placeholder="Full Name"
                    value={formData.name}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <label htmlFor="role" className="sr-only">Role</label>
                  <select
                    id="role"
                    name="role"
                    required
                    className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                    value={formData.role}
                    onChange={handleChange}
                  >
                    <option value="donor">Donor</option>
                    <option value="patient">Patient</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="bloodGroup" className="sr-only">Blood Group</label>
                  <select
                    id="bloodGroup"
                    name="bloodGroup"
                    required
                    className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                    value={formData.bloodGroup}
                    onChange={handleChange}
                  >
                    <option value="">Select Blood Group</option>
                    <option value="A+">A+</option>
                    <option value="A-">A-</option>
                    <option value="B+">B+</option>
                    <option value="B-">B-</option>
                    <option value="AB+">AB+</option>
                    <option value="AB-">AB-</option>
                    <option value="O+">O+</option>
                    <option value="O-">O-</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="medicalHistory" className="sr-only">Medical History</label>
                  <textarea
                    id="medicalHistory"
                    name="medicalHistory"
                    required
                    className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                    placeholder="Medical History"
                    value={formData.medicalHistory}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <label htmlFor="address" className="sr-only">Address</label>
                  <input
                    id="address"
                    name="address"
                    type="text"
                    required
                    className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                    placeholder="Address"
                    value={formData.address}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <label htmlFor="phoneNumber" className="sr-only">Phone Number</label>
                  <input
                    id="phoneNumber"
                    name="phoneNumber"
                    type="tel"
                    required
                    className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                    placeholder="Phone Number"
                    value={formData.phoneNumber}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <label htmlFor="age" className="sr-only">Age</label>
                  <input
                    id="age"
                    name="age"
                    type="number"
                    required
                    className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                    placeholder="Age"
                    value={formData.age}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <label htmlFor="gender" className="sr-only">Gender</label>
                  <select
                    id="gender"
                    name="gender"
                    required
                    className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                    value={formData.gender}
                    onChange={handleChange}
                  >
                    <option value="">Select Gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="weight" className="sr-only">Weight (kg)</label>
                  <input
                    id="weight"
                    name="weight"
                    type="number"
                    required
                    className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                    placeholder="Weight (kg)"
                    value={formData.weight}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <label htmlFor="height" className="sr-only">Height (cm)</label>
                  <input
                    id="height"
                    name="height"
                    type="number"
                    required
                    className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                    placeholder="Height (cm)"
                    value={formData.height}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <label htmlFor="allergies" className="sr-only">Allergies</label>
                  <input
                    id="allergies"
                    name="allergies"
                    type="text"
                    className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                    placeholder="Allergies (optional)"
                    value={formData.allergies}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <label htmlFor="currentMedications" className="sr-only">Current Medications</label>
                  <input
                    id="currentMedications"
                    name="currentMedications"
                    type="text"
                    className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                    placeholder="Current Medications (optional)"
                    value={formData.currentMedications}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <label htmlFor="emergencyContact.name" className="sr-only">Emergency Contact Name</label>
                  <input
                    id="emergencyContact.name"
                    name="emergencyContact.name"
                    type="text"
                    required
                    className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                    placeholder="Emergency Contact Name"
                    value={formData.emergencyContact.name}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <label htmlFor="emergencyContact.relationship" className="sr-only">Relationship</label>
                  <input
                    id="emergencyContact.relationship"
                    name="emergencyContact.relationship"
                    type="text"
                    required
                    className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                    placeholder="Relationship"
                    value={formData.emergencyContact.relationship}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <label htmlFor="emergencyContact.phone" className="sr-only">Emergency Contact Phone</label>
                  <input
                    id="emergencyContact.phone"
                    name="emergencyContact.phone"
                    type="tel"
                    required
                    className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                    placeholder="Emergency Contact Phone"
                    value={formData.emergencyContact.phone}
                    onChange={handleChange}
                  />
                </div>
              </>
            )}
            <div>
              <label htmlFor="email" className="sr-only">Email address</label>
              <input
                id="email"
                name="email"
                type="email"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="Email address"
                value={formData.email}
                onChange={handleChange}
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">Password</label>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              {loading ? (
                <LoadingSpinner />
              ) : (
                isLogin ? 'Sign in' : 'Register'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 
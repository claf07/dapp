'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useWeb3 } from '../../contexts/Web3Context';
import { useNotification } from '../../contexts/NotificationContext';
import { contractService } from '../../services/contractService';
import LoadingSpinner from '../../components/LoadingSpinner';

export default function PatientRegistration() {
  const router = useRouter();
  const { account } = useWeb3();
  const { addNotification } = useNotification();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    sex: '',
    height: '',
    weight: '',
    organ: '',
    bloodGroup: '',
    mobileNumber: '',
    emergencyLevel: 'normal',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!account) {
      addNotification('Please connect your wallet first', 'error');
      return;
    }

    // Validate form data
    if (!formData.name || !formData.age || !formData.sex || !formData.height || 
        !formData.weight || !formData.organ || !formData.bloodGroup || 
        !formData.mobileNumber || !formData.emergencyLevel) {
      addNotification('Please fill in all required fields', 'error');
      return;
    }

    // Validate age
    const age = parseInt(formData.age);
    if (isNaN(age) || age < 0 || age > 120) {
      addNotification('Please enter a valid age between 0 and 120', 'error');
      return;
    }

    // Validate height and weight
    const height = parseInt(formData.height);
    const weight = parseInt(formData.weight);
    if (isNaN(height) || height < 0 || height > 300) {
      addNotification('Please enter a valid height between 0 and 300 cm', 'error');
      return;
    }
    if (isNaN(weight) || weight < 0 || weight > 500) {
      addNotification('Please enter a valid weight between 0 and 500 kg', 'error');
      return;
    }

    // Validate mobile number
    if (!/^[0-9]{10}$/.test(formData.mobileNumber)) {
      addNotification('Please enter a valid 10-digit mobile number', 'error');
      return;
    }

    // Validate emergency level
    const validEmergencyLevels = ['normal', 'urgent', 'critical'];
    if (!validEmergencyLevels.includes(formData.emergencyLevel)) {
      addNotification('Please select a valid emergency level', 'error');
      return;
    }

    try {
      setLoading(true);
      await contractService.init();
      
      // Check if user is already registered
      try {
        const userData = await contractService.getPatientData(account);
        if (userData && userData.isRegistered) {
          addNotification('This wallet is already registered. Please use a different wallet or contact support.', 'error');
          return;
        }
      } catch (error) {
        console.log('User not registered yet, proceeding with registration');
      }
      
      // Prepare data for contract
      const processedData = {
        ...formData,
        age: age,
        height: height,
        weight: weight,
        // Ensure organ is a string
        organ: formData.organ.toString(),
        // Ensure blood group is uppercase
        bloodGroup: formData.bloodGroup.toUpperCase(),
        // Ensure mobile number is a string
        mobileNumber: formData.mobileNumber.toString()
      };

      console.log('Submitting data:', processedData);
      
      await contractService.registerPatient(processedData);
      addNotification('Patient registration successful!', 'success');
      router.push('/patient/dashboard');
    } catch (error) {
      console.error('Registration error:', error);
      let errorMessage = 'Registration failed. ';
      
      if (error.message.includes('already registered')) {
        errorMessage = 'This wallet is already registered. Please use a different wallet or contact support.';
      } else if (error.message.includes('gas required')) {
        errorMessage = 'Insufficient funds for gas. Please add more ETH to your wallet.';
      } else if (error.message.includes('reverted')) {
        errorMessage = 'Invalid data provided. Please check your input and try again.';
      } else {
        errorMessage += error.message || 'Please try again.';
      }
      
      addNotification(errorMessage, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!account) {
      addNotification('Please connect your wallet first', 'error');
      return;
    }

    try {
      setLoading(true);
      await contractService.init();
      const userData = await contractService.getPatientData(account);
      
      if (userData && userData.isRegistered) {
        addNotification('Login successful!', 'success');
        router.push('/patient/dashboard');
      } else {
        addNotification('Invalid credentials or not registered', 'error');
      }
    } catch (error) {
      console.error('Login error:', error);
      addNotification(error.message || 'Login failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  if (!account) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold mb-4">Please connect your wallet to continue</h1>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-16">
      <h1 className="text-3xl font-bold text-center mb-8">Patient Registration</h1>
      <form onSubmit={handleSubmit} className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-lg">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Age</label>
            <input
              type="number"
              name="age"
              value={formData.age}
              onChange={handleChange}
              required
              min="0"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Sex</label>
            <select
              name="sex"
              value={formData.sex}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="">Select</option>
              <option value="M">Male</option>
              <option value="F">Female</option>
              <option value="O">Other</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Height (cm)</label>
            <input
              type="number"
              name="height"
              value={formData.height}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Weight (kg)</label>
            <input
              type="number"
              name="weight"
              value={formData.weight}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Organ Needed</label>
            <select
              name="organ"
              value={formData.organ}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="">Select</option>
              <option value="kidney">Kidney</option>
              <option value="liver">Liver</option>
              <option value="heart">Heart</option>
              <option value="lung">Lung</option>
              <option value="pancreas">Pancreas</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Blood Group</label>
            <select
              name="bloodGroup"
              value={formData.bloodGroup}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="">Select</option>
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
            <label className="block text-sm font-medium text-gray-700 mb-2">Mobile Number</label>
            <input
              type="tel"
              name="mobileNumber"
              value={formData.mobileNumber}
              onChange={handleChange}
              required
              pattern="[0-9]{10}"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Emergency Level</label>
            <select
              name="emergencyLevel"
              value={formData.emergencyLevel}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="normal">Normal</option>
              <option value="urgent">Urgent</option>
              <option value="critical">Critical</option>
            </select>
          </div>
        </div>
        <div className="mt-8">
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary-600 text-white py-2 px-4 rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:opacity-50"
          >
            {loading ? <LoadingSpinner /> : 'Register as Patient'}
          </button>
        </div>
      </form>
    </div>
  );
} 
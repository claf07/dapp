'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useWeb3 } from '../../contexts/Web3Context';
import { useAuth } from '../../contexts/AuthContext';
import { useNotification } from '../../contexts/NotificationContext';

export default function PatientRegister() {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    age: '',
    bloodType: '',
    medicalHistory: '',
    requiredOrgans: {
      kidney: false,
      liver: false,
      heart: false,
      lungs: false,
      pancreas: false,
      intestines: false,
    },
    urgency: 'low', // low, medium, high
    hospitalName: '',
    doctorName: '',
    doctorContact: '',
  });

  const { account } = useWeb3();
  const { register } = useAuth();
  const { showNotification } = useNotification();
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!account) {
      showNotification('Please connect your wallet first', 'error');
      return;
    }

    // Validate required fields
    const requiredFields = [
      'name', 'email', 'password', 'bloodType', 'age',
      'hospitalName', 'doctorName', 'doctorContact'
    ];
    const missingFields = requiredFields.filter(field => !formData[field]);
    
    if (missingFields.length > 0) {
      showNotification(`Please fill in all required fields: ${missingFields.join(', ')}`, 'error');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      showNotification('Passwords do not match', 'error');
      return;
    }

    const requiredOrgans = Object.entries(formData.requiredOrgans)
      .filter(([_, selected]) => selected)
      .map(([organ]) => organ);

    if (requiredOrgans.length === 0) {
      showNotification('Please select at least one required organ', 'error');
      return;
    }

    setIsLoading(true);
    try {
      const requiredOrgans = Object.entries(formData.requiredOrgans)
        .filter(([_, selected]) => selected)
        .map(([organ]) => organ);

      if (requiredOrgans.length === 0) {
        showNotification('Please select at least one organ needed', 'error');
        setIsLoading(false);
        return;
      }

      const response = await register({
        ...formData,
        role: 'patient',
        walletAddress: account,
        requiredOrgans,
      });

      if (response.success) {
        showNotification('Registration successful!', 'success');
        router.push('/patient/dashboard');
      } else {
        showNotification(response.message || 'Registration failed', 'error');
      }
    } catch (error) {
      showNotification(error.message || 'An error occurred during registration', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (name.startsWith('organ-')) {
      const organ = name.replace('organ-', '');
      setFormData((prev) => ({
        ...prev,
        requiredOrgans: {
          ...prev.requiredOrgans,
          [organ]: checked,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const bloodTypes = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
  const urgencyLevels = [
    { value: 'low', label: 'Low - Can wait for a suitable match' },
    { value: 'medium', label: 'Medium - Need within 3-6 months' },
    { value: 'high', label: 'High - Need within 1-3 months' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-900">Register as a Patient</h2>
          <p className="mt-2 text-sm text-gray-600">
            Join our platform to find the organ you need
          </p>
        </div>

        <div className="mt-8 bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {!account ? (
            <div className="text-center">
              <p className="text-sm text-gray-600 mb-4">Please connect your wallet first</p>
              <button
                onClick={() => window.ethereum.request({ method: 'eth_requestAccounts' })}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Connect Wallet
              </button>
            </div>
          ) : (
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                    Full Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    id="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    id="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>

                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                    Password
                  </label>
                  <input
                    type="password"
                    name="password"
                    id="password"
                    required
                    value={formData.password}
                    onChange={handleChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>

                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                    Confirm Password
                  </label>
                  <input
                    type="password"
                    name="confirmPassword"
                    id="confirmPassword"
                    required
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>

                <div>
                  <label htmlFor="age" className="block text-sm font-medium text-gray-700">
                    Age
                  </label>
                  <input
                    type="number"
                    name="age"
                    id="age"
                    required
                    min="0"
                    max="100"
                    value={formData.age}
                    onChange={handleChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>

                <div>
                  <label htmlFor="bloodType" className="block text-sm font-medium text-gray-700">
                    Blood Type
                  </label>
                  <select
                    name="bloodType"
                    id="bloodType"
                    required
                    value={formData.bloodType}
                    onChange={handleChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  >
                    <option value="">Select blood type</option>
                    {bloodTypes.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="hospitalName" className="block text-sm font-medium text-gray-700">
                    Hospital Name
                  </label>
                  <input
                    type="text"
                    name="hospitalName"
                    id="hospitalName"
                    required
                    value={formData.hospitalName}
                    onChange={handleChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>

                <div>
                  <label htmlFor="doctorName" className="block text-sm font-medium text-gray-700">
                    Doctor's Name
                  </label>
                  <input
                    type="text"
                    name="doctorName"
                    id="doctorName"
                    required
                    value={formData.doctorName}
                    onChange={handleChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>

                <div>
                  <label htmlFor="doctorContact" className="block text-sm font-medium text-gray-700">
                    Doctor's Contact
                  </label>
                  <input
                    type="tel"
                    name="doctorContact"
                    id="doctorContact"
                    required
                    value={formData.doctorContact}
                    onChange={handleChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label htmlFor="urgency" className="block text-sm font-medium text-gray-700">
                    Urgency Level
                  </label>
                  <select
                    name="urgency"
                    id="urgency"
                    required
                    value={formData.urgency}
                    onChange={handleChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  >
                    {urgencyLevels.map((level) => (
                      <option key={level.value} value={level.value}>
                        {level.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label htmlFor="medicalHistory" className="block text-sm font-medium text-gray-700">
                  Medical History
                </label>
                <textarea
                  name="medicalHistory"
                  id="medicalHistory"
                  rows="4"
                  required
                  value={formData.medicalHistory}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="Please provide your medical history and current condition..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Organs Needed
                </label>
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
                  {Object.entries(formData.requiredOrgans).map(([organ, selected]) => (
                    <div key={organ} className="flex items-center">
                      <input
                        type="checkbox"
                        id={`organ-${organ}`}
                        name={`organ-${organ}`}
                        checked={selected}
                        onChange={handleChange}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <label
                        htmlFor={`organ-${organ}`}
                        className="ml-2 block text-sm text-gray-900 capitalize"
                      >
                        {organ}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? 'Registering...' : 'Register as Patient'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
} 
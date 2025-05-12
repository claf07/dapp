'use client';

import { useState, useEffect } from 'react';
import { useNotification } from '../contexts/NotificationContext';
import { storageService } from '../services/storageService';
import { matchingService } from '../services/matchingService';
import { governanceService } from '../services/governanceService';

export default function DemoMode() {
  const { showNotification } = useNotification();
  const [isActive, setIsActive] = useState(false);
  const [demoData, setDemoData] = useState({
    donors: [],
    patients: [],
    matches: [],
    proposals: []
  });
  const [currentScenario, setCurrentScenario] = useState(null);

  const demoScenarios = [
    {
      id: 'basic-matching',
      name: 'Basic Matching',
      description: 'Demonstrates basic organ matching functionality',
      steps: [
        {
          action: 'registerDonor',
          data: {
            name: 'John Doe',
            organType: 'kidney',
            bloodType: 'O+',
            age: 35
          }
        },
        {
          action: 'registerPatient',
          data: {
            name: 'Jane Smith',
            requiredOrgan: 'kidney',
            bloodType: 'O+',
            age: 40,
            urgencyLevel: 'urgent'
          }
        }
      ]
    },
    {
      id: 'emergency-proposal',
      name: 'Emergency Proposal',
      description: 'Shows how emergency cases are handled',
      steps: [
        {
          action: 'createEmergencyProposal',
          data: {
            type: 'emergency_allocation',
            description: 'Critical liver transplant needed',
            emergencyLevel: 'critical'
          }
        }
      ]
    },
    {
      id: 'multi-match',
      name: 'Multiple Matches',
      description: 'Demonstrates handling multiple potential matches',
      steps: [
        {
          action: 'registerMultipleDonors',
          data: {
            donors: [
              {
                name: 'Alice Johnson',
                organType: 'liver',
                bloodType: 'A+',
                age: 45
              },
              {
                name: 'Bob Wilson',
                organType: 'liver',
                bloodType: 'A+',
                age: 50
              }
            ]
          }
        },
        {
          action: 'registerPatient',
          data: {
            name: 'Charlie Brown',
            requiredOrgan: 'liver',
            bloodType: 'A+',
            age: 48,
            urgencyLevel: 'stable'
          }
        }
      ]
    }
  ];

  useEffect(() => {
    if (isActive) {
      loadDemoData();
    }
  }, [isActive]);

  const loadDemoData = async () => {
    try {
      // Load mock data for demo
      const mockData = {
        donors: [
          {
            id: 1,
            name: 'Demo Donor 1',
            organType: 'kidney',
            bloodType: 'O+',
            age: 35,
            status: 'available'
          }
        ],
        patients: [
          {
            id: 1,
            name: 'Demo Patient 1',
            requiredOrgan: 'kidney',
            bloodType: 'O+',
            age: 40,
            urgencyLevel: 'urgent'
          }
        ],
        matches: [],
        proposals: []
      };

      setDemoData(mockData);
      showNotification('Demo mode activated', 'success');
    } catch (error) {
      console.error('Error loading demo data:', error);
      showNotification('Failed to load demo data', 'error');
    }
  };

  const runScenario = async (scenario) => {
    setCurrentScenario(scenario);

    for (const step of scenario.steps) {
      try {
        await executeStep(step);
        await new Promise(resolve => setTimeout(resolve, 1000)); // Add delay between steps
      } catch (error) {
        console.error(`Error executing step: ${step.action}`, error);
        showNotification(`Failed to execute step: ${step.action}`, 'error');
      }
    }

    setCurrentScenario(null);
    showNotification('Scenario completed successfully', 'success');
  };

  const executeStep = async (step) => {
    switch (step.action) {
      case 'registerDonor':
        await handleDemoDonorRegistration(step.data);
        break;
      case 'registerPatient':
        await handleDemoPatientRegistration(step.data);
        break;
      case 'createEmergencyProposal':
        await handleDemoEmergencyProposal(step.data);
        break;
      case 'registerMultipleDonors':
        await handleDemoMultipleDonors(step.data.donors);
        break;
      default:
        throw new Error(`Unknown step action: ${step.action}`);
    }
  };

  const handleDemoDonorRegistration = async (donorData) => {
    // Simulate donor registration
    const newDonor = {
      id: demoData.donors.length + 1,
      ...donorData,
      status: 'available'
    };

    setDemoData(prev => ({
      ...prev,
      donors: [...prev.donors, newDonor]
    }));

    showNotification(`Demo donor registered: ${donorData.name}`, 'success');
  };

  const handleDemoPatientRegistration = async (patientData) => {
    // Simulate patient registration
    const newPatient = {
      id: demoData.patients.length + 1,
      ...patientData
    };

    setDemoData(prev => ({
      ...prev,
      patients: [...prev.patients, newPatient]
    }));

    // Simulate matching process
    const matches = await matchingService.findMatches(newPatient);

    setDemoData(prev => ({
      ...prev,
      matches: [...prev.matches, ...matches]
    }));

    showNotification(`Demo patient registered: ${patientData.name}`, 'success');
  };

  const handleDemoEmergencyProposal = async (proposalData) => {
    // Simulate emergency proposal creation
    const newProposal = {
      id: demoData.proposals.length + 1,
      ...proposalData,
      status: 'active',
      timestamp: new Date().toISOString()
    };

    setDemoData(prev => ({
      ...prev,
      proposals: [...prev.proposals, newProposal]
    }));

    showNotification('Demo emergency proposal created', 'success');
  };

  const handleDemoMultipleDonors = async (donors) => {
    // Simulate multiple donor registrations
    const newDonors = donors.map((donor, index) => ({
      id: demoData.donors.length + index + 1,
      ...donor,
      status: 'available'
    }));

    setDemoData(prev => ({
      ...prev,
      donors: [...prev.donors, ...newDonors]
    }));

    showNotification(`Registered ${donors.length} demo donors`, 'success');
  };

  const handleDemoLogin = async (role) => {
    try {
      const demoUsers = {
        admin: { email: 'admin@example.com', password: 'admin123' },
        donor: { email: 'demo.donor@example.com', password: 'demo123' },
        patient: { email: 'demo.patient@example.com', password: 'demo123' }
      };

      if (!demoUsers[role]) {
        throw new Error('Invalid role');
      }

      const result = await login(demoUsers[role].email, demoUsers[role].password);
      if (result) {
        router.push(`/${role}/dashboard`);
      }
    } catch (error) {
      console.error('Demo login failed:', error);
      showNotification('Demo login failed', 'error');
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <div className="bg-white rounded-lg shadow-lg p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Demo Mode</h3>
          <button
            onClick={() => setIsActive(!isActive)}
            className={`px-4 py-2 rounded-md ${
              isActive
                ? 'bg-red-600 text-white hover:bg-red-700'
                : 'bg-green-600 text-white hover:bg-green-700'
            }`}
          >
            {isActive ? 'Deactivate' : 'Activate'}
          </button>
        </div>

        {isActive && (
          <div className="space-y-4">
            <div className="space-y-2">
              <h4 className="font-medium">Available Scenarios</h4>
              {demoScenarios.map((scenario) => (
                <button
                  key={scenario.id}
                  onClick={() => runScenario(scenario)}
                  disabled={!!currentScenario}
                  className="w-full text-left px-4 py-2 bg-gray-100 rounded-md hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <div className="font-medium">{scenario.name}</div>
                  <div className="text-sm text-gray-600">{scenario.description}</div>
                </button>
              ))}
            </div>

            {currentScenario && (
              <div className="mt-4 p-3 bg-blue-50 rounded-md">
                <p className="text-sm text-blue-800">
                  Running scenario: {currentScenario.name}
                </p>
              </div>
            )}

            <div className="mt-4">
              <h4 className="font-medium mb-2">Demo Statistics</h4>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="bg-gray-50 p-2 rounded">
                  <span className="text-gray-600">Donors:</span>
                  <span className="ml-2 font-medium">{demoData.donors.length}</span>
                </div>
                <div className="bg-gray-50 p-2 rounded">
                  <span className="text-gray-600">Patients:</span>
                  <span className="ml-2 font-medium">{demoData.patients.length}</span>
                </div>
                <div className="bg-gray-50 p-2 rounded">
                  <span className="text-gray-600">Matches:</span>
                  <span className="ml-2 font-medium">{demoData.matches.length}</span>
                </div>
                <div className="bg-gray-50 p-2 rounded">
                  <span className="text-gray-600">Proposals:</span>
                  <span className="ml-2 font-medium">{demoData.proposals.length}</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
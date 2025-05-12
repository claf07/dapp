'use client';

import { useState } from 'react';
import { useNotification } from '../contexts/NotificationContext';

export default function MedicalRecords({ records, onUpdate, readOnly = false }) {
  const { showNotification } = useNotification();
  const [isEditing, setIsEditing] = useState(false);
  const [editedRecords, setEditedRecords] = useState(records);

  const handleEdit = () => {
    setIsEditing(true);
    setEditedRecords(records);
  };

  const handleSave = async () => {
    try {
      await onUpdate(editedRecords);
      setIsEditing(false);
      showNotification('Medical records updated successfully', 'success');
    } catch (error) {
      console.error('Error updating medical records:', error);
      showNotification('Failed to update medical records', 'error');
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditedRecords(records);
  };

  const handleChange = (field, value) => {
    setEditedRecords(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const renderField = (label, field, value) => (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      {isEditing ? (
        <input
          type="text"
          value={value}
          onChange={(e) => handleChange(field, e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      ) : (
        <p className="text-sm text-gray-900">{value || 'Not specified'}</p>
      )}
    </div>
  );

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-medium">Medical Records</h3>
        {!readOnly && (
          <div className="flex space-x-2">
            {isEditing ? (
              <>
                <button
                  onClick={handleSave}
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  Save
                </button>
                <button
                  onClick={handleCancel}
                  className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
                >
                  Cancel
                </button>
              </>
            ) : (
              <button
                onClick={handleEdit}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Edit
              </button>
            )}
          </div>
        )}
      </div>

      <div className="space-y-4">
        {renderField('Blood Group', 'bloodGroup', editedRecords.bloodGroup)}
        {renderField('Height (cm)', 'height', editedRecords.height)}
        {renderField('Weight (kg)', 'weight', editedRecords.weight)}
        {renderField('Allergies', 'allergies', editedRecords.allergies)}
        {renderField('Chronic Conditions', 'chronicConditions', editedRecords.chronicConditions)}
        {renderField('Current Medications', 'medications', editedRecords.medications)}
        {renderField('Previous Surgeries', 'surgeries', editedRecords.surgeries)}
        {renderField('Family Medical History', 'familyHistory', editedRecords.familyHistory)}
        {renderField('Last Check-up Date', 'lastCheckup', editedRecords.lastCheckup)}
        {renderField('Emergency Contact', 'emergencyContact', editedRecords.emergencyContact)}
      </div>

      {isEditing && (
        <div className="mt-6 p-4 bg-yellow-50 rounded-md">
          <p className="text-sm text-yellow-700">
            Please ensure all medical information is accurate and up-to-date. This information is crucial for matching and compatibility assessment.
          </p>
        </div>
      )}
    </div>
  );
} 
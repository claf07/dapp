
'use client';
import { useState } from 'react';
import { useNotification } from '../contexts/NotificationContext';
import { contractService } from '../services/contractService';

export default function DonorDeathConfirmation({ donorId }) {
  const [certificateHash, setCertificateHash] = useState('');
  const { showNotification } = useNotification();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleConfirmDeath = async () => {
    try {
      setIsSubmitting(true);
      const result = await contractService.confirmDonorDeath(
        donorId,
        certificateHash,
        window.localStorage.getItem('hospitalSignature')
      );
      
      showNotification({
        message: `Donor death confirmed. ${result.matches} potential matches found.`,
        type: 'success'
      });
    } catch (error) {
      showNotification({
        message: 'Error confirming donor death: ' + error.message,
        type: 'error'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-4 bg-yellow-100 border border-yellow-300 rounded">
      <h3 className="text-lg font-semibold mb-4">Confirm Donor Death</h3>
      <div className="space-y-4">
        <div>
          <label className="block mb-2">Death Certificate Hash</label>
          <input
            type="text"
            value={certificateHash}
            onChange={(e) => setCertificateHash(e.target.value)}
            className="w-full p-2 border rounded"
            placeholder="Enter certificate hash"
          />
        </div>
        <button
          onClick={handleConfirmDeath}
          disabled={isSubmitting || !certificateHash}
          className="w-full bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600 disabled:opacity-50"
        >
          {isSubmitting ? 'Confirming...' : 'Confirm Death'}
        </button>
      </div>
    </div>
  );
}

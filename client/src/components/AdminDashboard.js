import React, { useEffect, useState } from 'react';

const AdminDashboard = () => {
  const [pledges, setPledges] = useState([]);
  const [donors, setDonors] = useState([]);
  const [patients, setPatients] = useState([]);

  useEffect(() => {
    // TODO: Fetch pledges, donors, and patients from blockchain
  }, []);

  const handleVerifyDonor = (address) => {
    // TODO: Call smart contract to verify donor
    alert('Donor verified: ' + address);
  };

  const handleVerifyPatient = (address) => {
    // TODO: Call smart contract to verify patient
    alert('Patient verified: ' + address);
  };

  const handleMarkAsDonor = (address) => {
    // TODO: Move pledger to donor status in smart contract
    alert('Pledger marked as donor: ' + address);
  };

  return (
    <div>
      <h2>Admin Dashboard</h2>

      <section>
        <h3>Pledges</h3>
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Age</th>
              <th>Sex</th>
              <th>Organs</th>
              <th>Blood Group</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {pledges.map((pledge) => (
              <tr key={pledge.address}>
                <td>{pledge.name}</td>
                <td>{pledge.age}</td>
                <td>{pledge.sex}</td>
                <td>{pledge.organs.join(', ')}</td>
                <td>{pledge.bloodGroup}</td>
                <td>
                  <button onClick={() => handleMarkAsDonor(pledge.address)}>Donor</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section>
        <h3>Donors</h3>
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Age</th>
              <th>Sex</th>
              <th>Organs</th>
              <th>Blood Group</th>
              <th>Verified</th>
            </tr>
          </thead>
          <tbody>
            {donors.map((donor) => (
              <tr key={donor.address}>
                <td>{donor.name}</td>
                <td>{donor.age}</td>
                <td>{donor.sex}</td>
                <td>{donor.organs.join(', ')}</td>
                <td>{donor.bloodGroup}</td>
                <td>{donor.verified ? 'Yes' : 'No'}</td>
                <td>
                  {!donor.verified && (
                    <button onClick={() => handleVerifyDonor(donor.address)}>Verify</button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section>
        <h3>Patients</h3>
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Age</th>
              <th>Sex</th>
              <th>Organ Needed</th>
              <th>Blood Group</th>
              <th>Medical Report</th>
              <th>Verified</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {patients.map((patient) => (
              <tr key={patient.address}>
                <td>{patient.name}</td>
                <td>{patient.age}</td>
                <td>{patient.sex}</td>
                <td>{patient.organNeeded}</td>
                <td>{patient.bloodGroup}</td>
                <td>
                  <a href={patient.medicalReportUrl} target="_blank" rel="noopener noreferrer">
                    View
                  </a>
                </td>
                <td>{patient.verified ? 'Yes' : 'No'}</td>
                <td>
                  {!patient.verified && (
                    <button onClick={() => handleVerifyPatient(patient.address)}>Verify</button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
};

export default AdminDashboard;

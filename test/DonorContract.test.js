const DonorContract = artifacts.require("DonorContract");
const DonorBadge = artifacts.require("DonorBadge");

contract("DonorContract", accounts => {
  const admin = accounts[0];
  const medicalPro = accounts[1];
  const donor = accounts[2];
  const patient = accounts[3];

  let donorContractInstance;
  let donorBadgeInstance;

  before(async () => {
    donorContractInstance = await DonorContract.deployed();
    donorBadgeInstance = await DonorBadge.deployed();

    // Setup roles
    await donorContractInstance.addMedicalProfessional(medicalPro, "Dr. Smith", { from: admin });
  });

  it("should register a donor", async () => {
    await donorContractInstance.addDonor("D123", "Kidney", "CityA", "RegionA", "CountryA", { from: donor });
    const donorData = await donorContractInstance.getDonorByAddress(donor);
    assert.equal(donorData.medicalID, "D123", "Donor medical ID should match");
  });

  it("should register a patient", async () => {
    await donorContractInstance.addPatient("P123", "Kidney", "CityA", "RegionA", "CountryA", 2, { from: patient }); // UrgencyLevel.Medium = 2
    const patientData = await donorContractInstance.getPatientByAddress(patient);
    assert.equal(patientData.medicalID, "P123", "Patient medical ID should match");
  });

  it("should verify donor and patient", async () => {
    await donorContractInstance.verifyDonor(donor, { from: medicalPro });
    await donorContractInstance.verifyPatient(patient, { from: medicalPro });

    const donorData = await donorContractInstance.getDonorByAddress(donor);
    const patientData = await donorContractInstance.getPatientByAddress(patient);

    assert.equal(donorData.status.toNumber(), 1, "Donor should be verified");
    assert.equal(patientData.status.toNumber(), 1, "Patient should be verified");
  });

  it("should reject donor and patient", async () => {
    // Register new donor and patient for rejection test
    const donor2 = accounts[4];
    const patient2 = accounts[5];

    await donorContractInstance.addDonor("D124", "Liver", "CityB", "RegionB", "CountryB", { from: donor2 });
    await donorContractInstance.addPatient("P124", "Liver", "CityB", "RegionB", "CountryB", 1, { from: patient2 }); // UrgencyLevel.Low = 1

    await donorContractInstance.rejectDonor(donor2, { from: medicalPro });
    await donorContractInstance.rejectPatient(patient2, { from: medicalPro });

    const donorData = await donorContractInstance.getDonorByAddress(donor2);
    const patientData = await donorContractInstance.getPatientByAddress(patient2);

    assert.equal(donorData.status.toNumber(), 2, "Donor should be rejected");
    assert.equal(patientData.status.toNumber(), 2, "Patient should be rejected");
  });

  it("should mint donor badge", async () => {
    // Mint badge with tokenId 1 to donor
    await donorBadgeInstance.mintBadge(donor, 1, { from: admin });
    const owner = await donorBadgeInstance.ownerOf(1);
    assert.equal(owner, donor, "Donor should own the badge token");
  });
});

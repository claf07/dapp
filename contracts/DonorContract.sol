// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/AccessControl.sol";

contract DonorContract is AccessControl {
    bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");
    bytes32 public constant MEDICAL_PRO_ROLE = keccak256("MEDICAL_PRO_ROLE");

    enum VerificationStatus { Pending, Verified, Rejected }
    enum UrgencyLevel { Low, Medium, High, Critical }
    enum BadgeType { None, FirstTimeDonor, FamilyDonor }

    struct Location {
        string city;
        string region;
        string country;
    }

    struct Donor {
        address donorAddress;
        string medicalID;
        string organ;
        Location location;
        VerificationStatus status;
        uint256 registrationTime;
        BadgeType badge;
    }

    struct Patient {
        address patientAddress;
        string medicalID;
        string organNeeded;
        Location location;
        UrgencyLevel urgency;
        VerificationStatus status;
        uint256 registrationTime;
    }

    struct MedicalProfessional {
        address proAddress;
        string name;
        bool active;
    }

    mapping(address => Donor) private donorsByAddress;
    mapping(string => Donor) private donorsByMedicalID;

    mapping(address => Patient) private patientsByAddress;
    mapping(string => Patient) private patientsByMedicalID;

    mapping(address => MedicalProfessional) private medicalPros;

    // Organ viability times in seconds
    mapping(string => uint256) public organViabilityTimes;

    // Events
    event DonorRegistered(address indexed donorAddress, string medicalID);
    event PatientRegistered(address indexed patientAddress, string medicalID);
    event DonorVerified(address indexed donorAddress);
    event PatientVerified(address indexed patientAddress);
    event DonorRejected(address indexed donorAddress);
    event PatientRejected(address indexed patientAddress);
    event MatchFound(address indexed donorAddress, address indexed patientAddress, string organ);

    modifier onlyAdmin() {
        require(hasRole(ADMIN_ROLE, msg.sender), "Restricted to admins");
        _;
    }

    modifier onlyMedicalPro() {
        require(hasRole(MEDICAL_PRO_ROLE, msg.sender), "Restricted to medical professionals");
        _;
    }

    modifier onlyVerifiedDonor(address donorAddr) {
        require(donorsByAddress[donorAddr].status == VerificationStatus.Verified, "Donor not verified");
        _;
    }

    constructor() {
        _setupRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _setupRole(ADMIN_ROLE, msg.sender);
    }

    // Admin functions
    function addMedicalProfessional(address proAddress, string memory name) public onlyAdmin {
        medicalPros[proAddress] = MedicalProfessional(proAddress, name, true);
        _setupRole(MEDICAL_PRO_ROLE, proAddress);
    }

    function removeMedicalProfessional(address proAddress) public onlyAdmin {
        medicalPros[proAddress].active = false;
        revokeRole(MEDICAL_PRO_ROLE, proAddress);
    }

    // Registration functions
    function addDonor(
        string memory medicalID,
        string memory organ,
        string memory city,
        string memory region,
        string memory country
    ) public {
        require(donorsByAddress[msg.sender].donorAddress == address(0), "Donor already registered");
        Location memory loc = Location(city, region, country);
        Donor memory newDonor = Donor(msg.sender, medicalID, organ, loc, VerificationStatus.Pending, block.timestamp, BadgeType.None);
        donorsByAddress[msg.sender] = newDonor;
        donorsByMedicalID[medicalID] = newDonor;
        emit DonorRegistered(msg.sender, medicalID);
    }

    function addPatient(
        string memory medicalID,
        string memory organNeeded,
        string memory city,
        string memory region,
        string memory country,
        UrgencyLevel urgency
    ) public {
        require(patientsByAddress[msg.sender].patientAddress == address(0), "Patient already registered");
        Location memory loc = Location(city, region, country);
        Patient memory newPatient = Patient(msg.sender, medicalID, organNeeded, loc, urgency, VerificationStatus.Pending, block.timestamp);
        patientsByAddress[msg.sender] = newPatient;
        patientsByMedicalID[medicalID] = newPatient;
        emit PatientRegistered(msg.sender, medicalID);
    }

    // Verification functions
    function verifyDonor(address donorAddr) public onlyMedicalPro {
        require(donorsByAddress[donorAddr].donorAddress != address(0), "Donor not found");
        donorsByAddress[donorAddr].status = VerificationStatus.Verified;
        donorsByMedicalID[donorsByAddress[donorAddr].medicalID].status = VerificationStatus.Verified;
        emit DonorVerified(donorAddr);
    }

    function verifyPatient(address patientAddr) public onlyMedicalPro {
        require(patientsByAddress[patientAddr].patientAddress != address(0), "Patient not found");
        patientsByAddress[patientAddr].status = VerificationStatus.Verified;
        patientsByMedicalID[patientsByAddress[patientAddr].medicalID].status = VerificationStatus.Verified;
        emit PatientVerified(patientAddr);
    }

    // Rejection functions
    function rejectDonor(address donorAddr) public onlyMedicalPro {
        require(donorsByAddress[donorAddr].donorAddress != address(0), "Donor not found");
        donorsByAddress[donorAddr].status = VerificationStatus.Rejected;
        donorsByMedicalID[donorsByAddress[donorAddr].medicalID].status = VerificationStatus.Rejected;
        emit DonorRejected(donorAddr);
    }

    function rejectPatient(address patientAddr) public onlyMedicalPro {
        require(patientsByAddress[patientAddr].patientAddress != address(0), "Patient not found");
        patientsByAddress[patientAddr].status = VerificationStatus.Rejected;
        patientsByMedicalID[patientsByAddress[patientAddr].medicalID].status = VerificationStatus.Rejected;
        emit PatientRejected(patientAddr);
    }

    // Initialize organ viability times (in seconds)
    function initializeOrganViabilityTimes(string[] memory organs, uint256[] memory times) public onlyAdmin {
        require(organs.length == times.length, "Arrays length mismatch");
        for (uint256 i = 0; i < organs.length; i++) {
            organViabilityTimes[organs[i]] = times[i];
        }
    }

    // Getters
    function getDonorByAddress(address donorAddr) public view returns (Donor memory) {
        return donorsByAddress[donorAddr];
    }

    function getPatientByAddress(address patientAddr) public view returns (Patient memory) {
        return patientsByAddress[patientAddr];
    }

    // Matching algorithm (simplified for demonstration)
    function matchDonorsAndPatients() public onlyMedicalPro {
        // For simplicity, iterate over donors and patients and emit MatchFound if organ and location match and donor is verified
        // In practice, this should be optimized and off-chain for scalability
        // This is a placeholder implementation

        // Note: Solidity does not support iteration over mappings, so this function would require off-chain indexing or events to track donors/patients

        // Emit event for demonstration
        // emit MatchFound(donorAddress, patientAddress, organ);
    }

    // Additional getters for all donors/patients and verified donors/patients would require off-chain indexing or arrays to store keys

}

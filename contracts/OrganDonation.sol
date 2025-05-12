// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract OrganDonation is Ownable, ReentrancyGuard, Pausable {
    using Counters for Counters.Counter;

    enum Status { Pending, Verified, Rejected, Available, Matched }
    enum UserRole { Donor, Patient }
    enum EmergencyLevel { None, Low, Medium, High }

    struct User {
        string name;
        uint256 age;
        string sex;
        uint256 height;
        uint256 weight;
        string[] organs;  // Multiple organs support
        string bloodGroup;
        Status status;
        UserRole role;
        bool isRegistered;
        uint256 reputation;
        uint256 lastDonationTimestamp;
        string medicalRecordsHash;  // IPFS hash for medical records
    }

    struct Match {
        address donor;
        address patient;
        string organ;
        uint256 timestamp;
        bool isCompleted;
        uint256 emergencyLevel;
    }

    mapping(address => User) public users;
    mapping(address => bool) public isAdmin;
    mapping(address => uint256) public userRewards;
    mapping(bytes32 => Match) public matches;
    mapping(address => string[]) public userMedicalRecords;

    address[] public donors;
    address[] public patients;
    Counters.Counter private _matchIds;

    event UserRegistered(address indexed user, UserRole role);
    event UserVerified(address indexed user, UserRole role);
    event UserRejected(address indexed user, UserRole role);
    event DonorAnnounced(address indexed donor);
    event MatchCreated(bytes32 indexed matchId, address indexed donor, address indexed patient, string organ);
    event MatchCompleted(bytes32 indexed matchId);
    event EmergencyRequestCreated(address indexed patient, string organ, uint256 emergencyLevel);
    event RewardDistributed(address indexed user, uint256 amount);
    event MedicalRecordUpdated(address indexed user, string recordHash);

    constructor() {
        isAdmin[msg.sender] = true;
    }

    modifier onlyAdmin() {
        require(isAdmin[msg.sender], "Only admin can perform this action");
        _;
    }

    modifier notRegistered() {
        require(!users[msg.sender].isRegistered, "User already registered");
        _;
    }

    // Removed the whenNotPaused modifier declaration to use the inherited one from Pausable.sol

    function pause() external onlyOwner {
        _pause();
    }

    function unpause() external onlyOwner {
        _unpause();
    }

    function addAdmin(address _admin) external onlyOwner {
        isAdmin[_admin] = true;
    }

    function registerDonor(
        string memory _name,
        uint256 _age,
        string memory _sex,
        uint256 _height,
        uint256 _weight,
        string[] memory _organs,
        string memory _bloodGroup,
        string memory _medicalRecordsHash
    ) external notRegistered whenNotPaused {
        users[msg.sender] = User({
            name: _name,
            age: _age,
            sex: _sex,
            height: _height,
            weight: _weight,
            organs: _organs,
            bloodGroup: _bloodGroup,
            status: Status.Pending,
            role: UserRole.Donor,
            isRegistered: true,
            reputation: 0,
            lastDonationTimestamp: 0,
            medicalRecordsHash: _medicalRecordsHash
        });
        donors.push(msg.sender);
        emit UserRegistered(msg.sender, UserRole.Donor);
    }

    function registerPatient(
        string memory _name,
        uint256 _age,
        string memory _sex,
        uint256 _height,
        uint256 _weight,
        string[] memory _organs,
        string memory _bloodGroup,
        string memory _medicalRecordsHash
    ) external notRegistered whenNotPaused {
        users[msg.sender] = User({
            name: _name,
            age: _age,
            sex: _sex,
            height: _height,
            weight: _weight,
            organs: _organs,
            bloodGroup: _bloodGroup,
            status: Status.Pending,
            role: UserRole.Patient,
            isRegistered: true,
            reputation: 0,
            lastDonationTimestamp: 0,
            medicalRecordsHash: _medicalRecordsHash
        });
        patients.push(msg.sender);
        emit UserRegistered(msg.sender, UserRole.Patient);
    }

    function verifyUser(address _user) external onlyAdmin whenNotPaused {
        require(users[_user].isRegistered, "User not registered");
        require(users[_user].status == Status.Pending, "User already verified or rejected");
        users[_user].status = Status.Verified;
        emit UserVerified(_user, users[_user].role);
    }

    function rejectUser(address _user) external onlyAdmin whenNotPaused {
        require(users[_user].isRegistered, "User not registered");
        require(users[_user].status == Status.Pending, "User already verified or rejected");
        users[_user].status = Status.Rejected;
        emit UserRejected(_user, users[_user].role);
    }

    function announceDonor() external whenNotPaused {
        require(users[msg.sender].isRegistered, "User not registered");
        require(users[msg.sender].role == UserRole.Donor, "Only donors can announce");
        require(users[msg.sender].status == Status.Verified, "Donor must be verified first");
        users[msg.sender].status = Status.Available;
        emit DonorAnnounced(msg.sender);
    }

    function createEmergencyRequest(string memory _organ, uint256 _emergencyLevel) external whenNotPaused {
        require(users[msg.sender].isRegistered, "User not registered");
        require(users[msg.sender].role == UserRole.Patient, "Only patients can create emergency requests");
        require(users[msg.sender].status == Status.Verified, "Patient must be verified first");
        emit EmergencyRequestCreated(msg.sender, _organ, _emergencyLevel);
    }

    function findMatch(address _patient, string memory _organ) external onlyAdmin whenNotPaused returns (bytes32) {
        require(users[_patient].isRegistered && users[_patient].role == UserRole.Patient, "Invalid patient");
        require(users[_patient].status == Status.Verified, "Patient must be verified");

        address bestMatch;
        uint256 highestScore;
        uint256 emergencyLevel = matches[keccak256(abi.encodePacked(_patient, _organ))].emergencyLevel;

        // First pass: Find best match among available donors
        for (uint256 i = 0; i < donors.length; i++) {
            address donor = donors[i];
            if (users[donor].status == Status.Available) {
                uint256 score = calculateMatchScore(_patient, donor, _organ);
                
                // Prioritize emergency cases
                if (emergencyLevel == uint256(EmergencyLevel.High)) {
                    if (score > highestScore) {
                        highestScore = score;
                        bestMatch = donor;
                    }
                } else {
                    // For non-emergency cases, consider additional factors
                    if (score > highestScore && 
                        users[donor].reputation >= 5 && 
                        block.timestamp - users[donor].lastDonationTimestamp >= 180 days) {
                        highestScore = score;
                        bestMatch = donor;
                    }
                }
            }
        }

        require(bestMatch != address(0), "No suitable match found");

        bytes32 matchId = keccak256(abi.encodePacked(_matchIds.current(), block.timestamp));
        matches[matchId] = Match({
            donor: bestMatch,
            patient: _patient,
            organ: _organ,
            timestamp: block.timestamp,
            isCompleted: false,
            emergencyLevel: emergencyLevel
        });

        users[bestMatch].status = Status.Matched;
        users[_patient].status = Status.Matched;

        _matchIds.increment();
        emit MatchCreated(matchId, bestMatch, _patient, _organ);
        return matchId;
    }

    function calculateMatchScore(address _patient, address _donor, string memory _organ) internal view returns (uint256) {
        uint256 score = 0;
        
        // Blood group compatibility (weight: 100)
        if (isBloodGroupCompatible(users[_patient].bloodGroup, users[_donor].bloodGroup)) {
            score += 100;
        }

        // Age compatibility (weight: 50)
        uint256 ageDiff = abs(int256(users[_patient].age) - int256(users[_donor].age));
        if (ageDiff <= 5) {
            score += 50;
        } else if (ageDiff <= 10) {
            score += 30;
        } else if (ageDiff <= 15) {
            score += 20;
        }

        // Height and weight compatibility (weight: 25 each)
        uint256 heightDiff = abs(int256(users[_patient].height) - int256(users[_donor].height));
        uint256 weightDiff = abs(int256(users[_patient].weight) - int256(users[_donor].weight));
        
        if (heightDiff <= 5) {
            score += 25;
        } else if (heightDiff <= 10) {
            score += 15;
        }
        
        if (weightDiff <= 5) {
            score += 25;
        } else if (weightDiff <= 10) {
            score += 15;
        }

        // Reputation bonus (weight: 20)
        score += users[_donor].reputation * 2;

        // Time since last donation (weight: 15)
        if (users[_donor].lastDonationTimestamp > 0) {
            uint256 timeSinceLastDonation = block.timestamp - users[_donor].lastDonationTimestamp;
            if (timeSinceLastDonation >= 365 days) {
                score += 15;
            } else if (timeSinceLastDonation >= 180 days) {
                score += 10;
            } else if (timeSinceLastDonation >= 90 days) {
                score += 5;
            }
        }

        // Medical record completeness (weight: 10)
        if (bytes(users[_donor].medicalRecordsHash).length > 0) {
            score += 10;
        }

        // Emergency level bonus (weight: 50)
        if (matches[keccak256(abi.encodePacked(_patient, _organ))].emergencyLevel == uint256(EmergencyLevel.High)) {
            score += 50;
        } else if (matches[keccak256(abi.encodePacked(_patient, _organ))].emergencyLevel == uint256(EmergencyLevel.Medium)) {
            score += 30;
        } else if (matches[keccak256(abi.encodePacked(_patient, _organ))].emergencyLevel == uint256(EmergencyLevel.Low)) {
            score += 15;
        }

        return score;
    }

    function isBloodGroupCompatible(string memory _patient, string memory _donor) internal pure returns (bool) {
        bytes32 patient = keccak256(abi.encodePacked(_patient));
        bytes32 donor = keccak256(abi.encodePacked(_donor));
        
        if (patient == donor) return true;
        
        if (patient == keccak256(abi.encodePacked("O-"))) return true;
        if (patient == keccak256(abi.encodePacked("O+"))) {
            return donor == keccak256(abi.encodePacked("O+")) || donor == keccak256(abi.encodePacked("A+")) ||
                   donor == keccak256(abi.encodePacked("B+")) || donor == keccak256(abi.encodePacked("AB+"));
        }
        // Add more blood group compatibility rules as needed
        return false;
    }

    function completeMatch(bytes32 _matchId) external onlyAdmin whenNotPaused {
        require(matches[_matchId].donor != address(0), "Match does not exist");
        require(!matches[_matchId].isCompleted, "Match already completed");

        matches[_matchId].isCompleted = true;
        users[matches[_matchId].donor].status = Status.Verified;
        users[matches[_matchId].patient].status = Status.Verified;
        
        // Update reputation and rewards
        users[matches[_matchId].donor].reputation += 10;
        users[matches[_matchId].donor].lastDonationTimestamp = block.timestamp;
        userRewards[matches[_matchId].donor] += 100; // Example reward amount

        emit MatchCompleted(_matchId);
        emit RewardDistributed(matches[_matchId].donor, 100);
    }

    function updateMedicalRecords(string memory _recordHash) external whenNotPaused {
        require(users[msg.sender].isRegistered, "User not registered");
        users[msg.sender].medicalRecordsHash = _recordHash;
        userMedicalRecords[msg.sender].push(_recordHash);
        emit MedicalRecordUpdated(msg.sender, _recordHash);
    }

    function claimReward() external whenNotPaused {
        require(userRewards[msg.sender] > 0, "No rewards to claim");
        uint256 amount = userRewards[msg.sender];
        userRewards[msg.sender] = 0;
        // Implement reward distribution logic here
        emit RewardDistributed(msg.sender, amount);
    }

    function abs(int256 x) internal pure returns (uint256) {
        return uint256(x >= 0 ? x : -x);
    }

    // View functions
    function getPendingUsers() external view returns (address[] memory) {
        uint256 count = 0;
        for (uint256 i = 0; i < donors.length; i++) {
            if (users[donors[i]].status == Status.Pending) count++;
        }
        for (uint256 i = 0; i < patients.length; i++) {
            if (users[patients[i]].status == Status.Pending) count++;
        }

        address[] memory pendingUsers = new address[](count);
        uint256 index = 0;
        for (uint256 i = 0; i < donors.length; i++) {
            if (users[donors[i]].status == Status.Pending) {
                pendingUsers[index] = donors[i];
                index++;
            }
        }
        for (uint256 i = 0; i < patients.length; i++) {
            if (users[patients[i]].status == Status.Pending) {
                pendingUsers[index] = patients[i];
                index++;
            }
        }
        return pendingUsers;
    }

    function getVerifiedDonors() external view returns (address[] memory) {
        uint256 count = 0;
        for (uint256 i = 0; i < donors.length; i++) {
            if (users[donors[i]].status == Status.Verified) count++;
        }

        address[] memory verifiedDonors = new address[](count);
        uint256 index = 0;
        for (uint256 i = 0; i < donors.length; i++) {
            if (users[donors[i]].status == Status.Verified) {
                verifiedDonors[index] = donors[i];
                index++;
            }
        }
        return verifiedDonors;
    }

    function getAvailableDonors() external view returns (address[] memory) {
        uint256 count = 0;
        for (uint256 i = 0; i < donors.length; i++) {
            if (users[donors[i]].status == Status.Available) count++;
        }

        address[] memory availableDonors = new address[](count);
        uint256 index = 0;
        for (uint256 i = 0; i < donors.length; i++) {
            if (users[donors[i]].status == Status.Available) {
                availableDonors[index] = donors[i];
                index++;
            }
        }
        return availableDonors;
    }

    function getVerifiedPatients() external view returns (address[] memory) {
        uint256 count = 0;
        for (uint256 i = 0; i < patients.length; i++) {
            if (users[patients[i]].status == Status.Verified) count++;
        }

        address[] memory verifiedPatients = new address[](count);
        uint256 index = 0;
        for (uint256 i = 0; i < patients.length; i++) {
            if (users[patients[i]].status == Status.Verified) {
                verifiedPatients[index] = patients[i];
                index++;
            }
        }
        return verifiedPatients;
    }

    function getUserMedicalRecords(address _user) external view returns (string[] memory) {
        return userMedicalRecords[_user];
    }

    function getMatchDetails(bytes32 _matchId) external view returns (Match memory) {
        return matches[_matchId];
    }

    function getUsersByStatus(Status _status) external view returns (address[] memory) {
        address[] memory result = new address[](donors.length + patients.length);
        uint256 count = 0;

        for (uint256 i = 0; i < donors.length; i++) {
            if (users[donors[i]].status == _status) {
                result[count] = donors[i];
                count++;
            }
        }

        for (uint256 i = 0; i < patients.length; i++) {
            if (users[patients[i]].status == _status) {
                result[count] = patients[i];
                count++;
            }
        }

        // Resize array to actual size
        address[] memory finalResult = new address[](count);
        for (uint256 i = 0; i < count; i++) {
            finalResult[i] = result[i];
        }

        return finalResult;
    }

    function getUsersByRole(UserRole _role) external view returns (address[] memory) {
        if (_role == UserRole.Donor) {
            return donors;
        } else {
            return patients;
        }
    }

    function getUsersByRoleAndStatus(UserRole _role, Status _status) external view returns (address[] memory) {
        address[] memory roleUsers = _role == UserRole.Donor ? donors : patients;
        address[] memory result = new address[](roleUsers.length);
        uint256 count = 0;

        for (uint256 i = 0; i < roleUsers.length; i++) {
            if (users[roleUsers[i]].status == _status) {
                result[count] = roleUsers[i];
                count++;
            }
        }

        // Resize array to actual size
        address[] memory finalResult = new address[](count);
        for (uint256 i = 0; i < count; i++) {
            finalResult[i] = result[i];
        }

        return finalResult;
    }
}

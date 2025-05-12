// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract OrganDonationSystem is AccessControl, ReentrancyGuard {
    using Counters for Counters.Counter;

    bytes32 public constant HOSPITAL_ROLE = keccak256("HOSPITAL_ROLE");
    bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");
    
    Counters.Counter private _matchIds;
    Counters.Counter private _verificationIds;

    struct User {
        address userAddress;
        string ipfsHash; // Encrypted personal data
        uint8 role; // 0: Donor, 1: Patient
        bool isVerified;
        bool isActive;
        uint256[] organs; // For donors: available organs, For patients: needed organs
        uint256 lastUpdate;
    }

    struct DeathVerification {
        address userAddress;
        string certificateHash;
        address[] verifiers;
        uint256 requiredVerifications;
        uint256 verificationCount;
        bool isVerified;
        uint256 timestamp;
    }

    struct Match {
        uint256 matchId;
        address donorAddress;
        address patientAddress;
        uint256[] matchingOrgans;
        uint256 matchScore;
        bool isAccepted;
        bool isCompleted;
        uint256 timestamp;
    }

    struct Notification {
        uint256 notificationId;
        address recipient;
        string message;
        bool isRead;
        uint256 timestamp;
    }

    // Mappings
    mapping(address => User) public users;
    mapping(address => DeathVerification) public deathVerifications;
    mapping(uint256 => Match) public matches;
    mapping(address => uint256[]) public userMatches;
    mapping(address => Notification[]) public notifications;
    mapping(address => uint256) public userNotificationCount;

    // Events
    event UserRegistered(address indexed userAddress, uint8 role);
    event DeathVerified(address indexed userAddress, address indexed verifier);
    event MatchFound(uint256 indexed matchId, address indexed donor, address indexed patient);
    event MatchAccepted(uint256 indexed matchId);
    event MatchCompleted(uint256 indexed matchId);
    event NotificationSent(address indexed recipient, uint256 notificationId);

    constructor() {
        _setupRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _setupRole(ADMIN_ROLE, msg.sender);
    }

    // Modifiers
    modifier onlyVerifiedUser() {
        require(users[msg.sender].isVerified, "User not verified");
        _;
    }

    modifier onlyActiveUser() {
        require(users[msg.sender].isActive, "User not active");
        _;
    }

    // User Management
    function registerUser(string memory _ipfsHash, uint8 _role, uint256[] memory _organs) 
        external 
        nonReentrant 
    {
        require(_role <= 1, "Invalid role");
        require(users[msg.sender].userAddress == address(0), "User already registered");

        users[msg.sender] = User({
            userAddress: msg.sender,
            ipfsHash: _ipfsHash,
            role: _role,
            isVerified: false,
            isActive: true,
            organs: _organs,
            lastUpdate: block.timestamp
        });

        emit UserRegistered(msg.sender, _role);
    }

    // Death Verification
    function initiateDeathVerification(address _userAddress, string memory _certificateHash) 
        external 
        onlyRole(HOSPITAL_ROLE) 
    {
        require(users[_userAddress].isActive, "User not active");
        require(deathVerifications[_userAddress].userAddress == address(0), "Verification already initiated");

        address[] memory verifiers = new address[](3); // Require 3 hospital verifications
        deathVerifications[_userAddress] = DeathVerification({
            userAddress: _userAddress,
            certificateHash: _certificateHash,
            verifiers: verifiers,
            requiredVerifications: 3,
            verificationCount: 0,
            isVerified: false,
            timestamp: block.timestamp
        });
    }

    function verifyDeath(address _userAddress) 
        external 
        onlyRole(HOSPITAL_ROLE) 
    {
        DeathVerification storage verification = deathVerifications[_userAddress];
        require(verification.userAddress != address(0), "No verification initiated");
        require(!verification.isVerified, "Already verified");

        // Check if hospital already verified
        for(uint i = 0; i < verification.verifiers.length; i++) {
            require(verification.verifiers[i] != msg.sender, "Already verified by this hospital");
        }

        verification.verifiers[verification.verificationCount] = msg.sender;
        verification.verificationCount++;

        if(verification.verificationCount >= verification.requiredVerifications) {
            verification.isVerified = true;
            users[_userAddress].isActive = false;
        }

        emit DeathVerified(_userAddress, msg.sender);
    }

    // Matching System
    function findMatches() 
        external 
        onlyRole(ADMIN_ROLE) 
    {
        // Implementation of matching algorithm
        // This would compare donor organs with patient needs
        // and create matches based on compatibility
    }

    function acceptMatch(uint256 _matchId) 
        external 
        onlyVerifiedUser 
        onlyActiveUser 
    {
        Match storage matchData = matches[_matchId];
        require(matchData.matchId != 0, "Match not found");
        require(!matchData.isAccepted, "Match already accepted");
        require(msg.sender == matchData.patientAddress, "Not authorized");

        matchData.isAccepted = true;
        emit MatchAccepted(_matchId);
    }

    // Notification System
    function sendNotification(address _recipient, string memory _message) 
        internal 
    {
        uint256 notificationId = userNotificationCount[_recipient];
        notifications[_recipient].push(Notification({
            notificationId: notificationId,
            recipient: _recipient,
            message: _message,
            isRead: false,
            timestamp: block.timestamp
        }));
        userNotificationCount[_recipient]++;

        emit NotificationSent(_recipient, notificationId);
    }

    // View Functions
    function getUserData(address _userAddress) 
        external 
        view 
        returns (User memory) 
    {
        return users[_userAddress];
    }

    function getDeathVerification(address _userAddress) 
        external 
        view 
        returns (DeathVerification memory) 
    {
        return deathVerifications[_userAddress];
    }

    function getMatch(uint256 _matchId) 
        external 
        view 
        returns (Match memory) 
    {
        return matches[_matchId];
    }

    function getUserNotifications(address _userAddress) 
        external 
        view 
        returns (Notification[] memory) 
    {
        return notifications[_userAddress];
    }
} 
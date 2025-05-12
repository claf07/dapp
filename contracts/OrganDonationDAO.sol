// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract OrganDonationDAO is Ownable, ReentrancyGuard {
    using Counters for Counters.Counter;

    struct Proposal {
        uint256 id;
        address proposer;
        string description;
        uint256 startTime;
        uint256 endTime;
        uint256 forVotes;
        uint256 againstVotes;
        bool executed;
        mapping(address => bool) hasVoted;
    }

    struct Member {
        string name;
        string hospitalId;
        bool isActive;
        uint256 votingPower;
        uint256 lastVoteTimestamp;
    }

    Counters.Counter private _proposalIds;
    mapping(uint256 => Proposal) public proposals;
    mapping(address => Member) public members;
    address[] public memberAddresses;

    uint256 public constant VOTING_PERIOD = 3 days;
    uint256 public constant MIN_VOTING_POWER = 1;
    uint256 public constant PROPOSAL_THRESHOLD = 2;

    event MemberAdded(address indexed member, string name, string hospitalId);
    event MemberRemoved(address indexed member);
    event ProposalCreated(uint256 indexed proposalId, address proposer, string description);
    event VoteCast(address indexed voter, uint256 indexed proposalId, bool support);
    event ProposalExecuted(uint256 indexed proposalId);

    modifier onlyMember() {
        require(members[msg.sender].isActive, "Not an active member");
        _;
    }

    modifier onlyActiveProposal(uint256 proposalId) {
        require(proposals[proposalId].startTime > 0, "Proposal does not exist");
        require(block.timestamp <= proposals[proposalId].endTime, "Voting period ended");
        require(!proposals[proposalId].executed, "Proposal already executed");
        _;
    }

    constructor() {
        // Add contract deployer as first member
        members[msg.sender] = Member({
            name: "Initial Member",
            hospitalId: "HOSPITAL-001",
            isActive: true,
            votingPower: 1,
            lastVoteTimestamp: 0
        });
        memberAddresses.push(msg.sender);
    }

    function addMember(address _member, string memory _name, string memory _hospitalId) external onlyOwner {
        require(!members[_member].isActive, "Member already exists");
        members[_member] = Member({
            name: _name,
            hospitalId: _hospitalId,
            isActive: true,
            votingPower: 1,
            lastVoteTimestamp: 0
        });
        memberAddresses.push(_member);
        emit MemberAdded(_member, _name, _hospitalId);
    }

    function removeMember(address _member) external onlyOwner {
        require(members[_member].isActive, "Member not found");
        members[_member].isActive = false;
        emit MemberRemoved(_member);
    }

    function createProposal(string memory _description) external onlyMember returns (uint256) {
        require(getActiveMemberCount() >= PROPOSAL_THRESHOLD, "Insufficient active members");
        
        _proposalIds.increment();
        uint256 proposalId = _proposalIds.current();
        
        Proposal storage newProposal = proposals[proposalId];
        newProposal.id = proposalId;
        newProposal.proposer = msg.sender;
        newProposal.description = _description;
        newProposal.startTime = block.timestamp;
        newProposal.endTime = block.timestamp + VOTING_PERIOD;
        newProposal.forVotes = 0;
        newProposal.againstVotes = 0;
        newProposal.executed = false;

        emit ProposalCreated(proposalId, msg.sender, _description);
        return proposalId;
    }

    function castVote(uint256 _proposalId, bool _support) external onlyMember onlyActiveProposal(_proposalId) {
        Proposal storage proposal = proposals[_proposalId];
        require(!proposal.hasVoted[msg.sender], "Already voted");
        require(members[msg.sender].votingPower >= MIN_VOTING_POWER, "Insufficient voting power");

        proposal.hasVoted[msg.sender] = true;
        if (_support) {
            proposal.forVotes += members[msg.sender].votingPower;
        } else {
            proposal.againstVotes += members[msg.sender].votingPower;
        }

        members[msg.sender].lastVoteTimestamp = block.timestamp;
        emit VoteCast(msg.sender, _proposalId, _support);
    }

    function executeProposal(uint256 _proposalId) external onlyMember {
        Proposal storage proposal = proposals[_proposalId];
        require(block.timestamp > proposal.endTime, "Voting period not ended");
        require(!proposal.executed, "Proposal already executed");
        require(proposal.forVotes > proposal.againstVotes, "Proposal did not pass");

        proposal.executed = true;
        emit ProposalExecuted(_proposalId);
    }

    function getActiveMemberCount() public view returns (uint256) {
        uint256 count = 0;
        for (uint256 i = 0; i < memberAddresses.length; i++) {
            if (members[memberAddresses[i]].isActive) {
                count++;
            }
        }
        return count;
    }

    function getProposal(uint256 _proposalId) external view returns (
        uint256 id,
        address proposer,
        string memory description,
        uint256 startTime,
        uint256 endTime,
        uint256 forVotes,
        uint256 againstVotes,
        bool executed
    ) {
        Proposal storage proposal = proposals[_proposalId];
        return (
            proposal.id,
            proposal.proposer,
            proposal.description,
            proposal.startTime,
            proposal.endTime,
            proposal.forVotes,
            proposal.againstVotes,
            proposal.executed
        );
    }
} 
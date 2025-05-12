// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract DonorLegacyNFT is ERC721URIStorage, Ownable {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    struct DonorBadge {
        string name;
        string hospitalId;
        string organType;
        uint256 donationDate;
        string verificationCode;
        bool isVerified;
    }

    mapping(uint256 => DonorBadge) public donorBadges;
    mapping(address => uint256[]) public donorTokens;
    mapping(string => bool) public usedVerificationCodes;

    event BadgeMinted(address indexed donor, uint256 indexed tokenId, string organType);
    event BadgeVerified(uint256 indexed tokenId, string hospitalId);

    constructor() ERC721("Donor Legacy Badge", "DONOR") {}

    function mintBadge(
        address donor,
        string memory name,
        string memory hospitalId,
        string memory organType,
        string memory verificationCode,
        string memory tokenURI
    ) external onlyOwner returns (uint256) {
        require(!usedVerificationCodes[verificationCode], "Verification code already used");
        
        _tokenIds.increment();
        uint256 newTokenId = _tokenIds.current();

        _mint(donor, newTokenId);
        _setTokenURI(newTokenId, tokenURI);

        donorBadges[newTokenId] = DonorBadge({
            name: name,
            hospitalId: hospitalId,
            organType: organType,
            donationDate: block.timestamp,
            verificationCode: verificationCode,
            isVerified: true
        });

        donorTokens[donor].push(newTokenId);
        usedVerificationCodes[verificationCode] = true;

        emit BadgeMinted(donor, newTokenId, organType);
        emit BadgeVerified(newTokenId, hospitalId);

        return newTokenId;
    }

    function getDonorBadges(address donor) external view returns (uint256[] memory) {
        return donorTokens[donor];
    }

    function getBadgeDetails(uint256 tokenId) external view returns (
        string memory name,
        string memory hospitalId,
        string memory organType,
        uint256 donationDate,
        bool isVerified
    ) {
        DonorBadge memory badge = donorBadges[tokenId];
        return (
            badge.name,
            badge.hospitalId,
            badge.organType,
            badge.donationDate,
            badge.isVerified
        );
    }

    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 tokenId,
        uint256 batchSize
    ) internal virtual override {
        super._beforeTokenTransfer(from, to, tokenId, batchSize);
        require(from == address(0) || to == address(0), "Badges are non-transferable");
    }
} 
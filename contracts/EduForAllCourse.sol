
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
// https://github.com/OpenZeppelin/openzeppelin-contracts.git
// import "github.com/OpenZeppelin/openzeppelin-contracts/blob/243adff49ce1700e0ecb99fe522fb16cff1d1ddc/contracts/token/ERC721/ERC721.sol";
// import "@chainlink/contracts/src/v0.6/VRFConsumerBase.sol";
// import "github.com/OpenZeppelin/openzeppelin-contracts/contracts/access/Ownable.sol";
// import "github.com/OpenZeppelin/openzeppelin-contracts/contracts/utils/Strings.sol";
// import "github.com/OpenZeppelin/openzeppelin-contracts/contracts/token/ERC721/ERC721.sol";

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

// import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/243adff49ce1700e0ecb99fe522fb16cff1d1ddc/contracts/token/ERC721/ERC721.sol";
// import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/243adff49ce1700e0ecb99fe522fb16cff1d1ddc/contracts/access/Ownable.sol";

// import "@chainlink/contracts/src/v0.6/VRFConsumerBase.sol";
// import "github.com/OpenZeppelin/openzeppelin-contracts//contracts/access/Ownable.sol";
// import "github.com/OpenZeppelin/openzeppelin-contracts//contracts/utils/Strings.sol";
// VRFConsumerBase, Ownable {

contract EduForAllCourse is ERC721, Ownable { 
    using Strings for string;

    bytes32 internal keyHash;
    uint256 internal fee;
    uint256 public randomResult;
    address public VRFCoordinator;
    // rinkeby: 0xb3dCcb4Cf7a26f6cf6B120Cf5A73875B7BBc655B
    address public LinkToken;
    // rinkeby: 0x01BE23585060835E02B77ef475b0Cc51aA1e0709a

    struct CompletionCertificate {
        string code;
        string name;
        string difficulty;
        uint256 score;
        address owner;
    }

    CompletionCertificate[] public certificates;
    string private _baseURIextended;

    /**
     * Constructor inherits VRFConsumerBase
     *
     * Network: Rinkeby
     * Chainlink VRF Coordinator address: 0xb3dCcb4Cf7a26f6cf6B120Cf5A73875B7BBc655B
     * LINK token address:                0x01BE23585060835E02B77ef475b0Cc51aA1e0709
     * Key Hash: 0x2ed0feb3e7fd2022120aa84fab1945545a9f2ffc9076fd6156fa96eaff4c1311
     */
    constructor(bytes32 _keyhash)
        public
        // VRFConsumerBase(_VRFCoordinator, _LinkToken)
        ERC721("Edu4allCourse", "EDUC")
    {   
        // VRFCoordinator = _VRFCoordinator;
        // LinkToken = _LinkToken;
        keyHash = _keyhash;
        fee = 0.1 * 10**18; // 0.1 LINK
    }

    // function setBaseURI(string memory baseURI_) external onlyOwner() {
    //     _baseURIextended = baseURI_;
    // }
    

    // function _setTokenURI(uint256 tokenId, string memory _tokenURI) internal virtual {
    //     require(_exists(tokenId), "ERC721Metadata: URI set of nonexistent token");
    //     _tokenURIs[tokenId] = _tokenURI;
    // }
    
    // function _baseURI() internal view virtual override returns (string memory) {
    //     return _baseURIextended;
    // }
    
    // function tokenURI(uint256 tokenId) public view virtual override returns (string memory) {
    //     require(_exists(tokenId), "ERC721Metadata: URI query for nonexistent token");

    //     string memory _tokenURI = tokenId;
    //     string memory base = _baseURI();
        
    //     // If there is no base URI, return the token URI.
    //     if (bytes(base).length == 0) {
    //         return _tokenURI;
    //     }
    //     // If both are set, concatenate the baseURI and tokenURI (via abi.encodePacked).
    //     if (bytes(_tokenURI).length > 0) {
    //         return string(abi.encodePacked(base, _tokenURI));
    //     }
    //     // If there is a baseURI but no tokenURI, concatenate the tokenID to the baseURI.
    //     return string(abi.encodePacked(base, tokenId.toString()));
    // }





    
    function requestCertificate (
        string memory code,
        string memory name,
        string memory difficulty,
        uint256 score
    ) public returns (string memory) {
        
        // check if user already has certificate for this course
        for (uint i=0; i < certificates.length; i++) {
            if (certificates[i].owner == msg.sender && stringsEqual(certificates[i].code, code)) {
                return "ERR - already awarded";
            }
        }

        uint256 newId = certificates.length;
        
        certificates.push(
            CompletionCertificate(
                code,
                name,
                difficulty,
                score,
                msg.sender
            )
        );
        _safeMint(msg.sender, newId);
        
        return "SUCCESS";
    }


    function getName(uint256 tokenId) public view returns (string memory) {
        return certificates[tokenId].name;
    }

    function getDifficulty(uint256 tokenId) public view returns (string memory) {
        return certificates[tokenId].difficulty;
    }

    function getCourseOverView(uint256 tokenId)
        public
        view
        returns (
            string memory,
            string memory,
            string memory,
            uint256
        )
    {
        return (
            certificates[tokenId].code,
            certificates[tokenId].name,
            certificates[tokenId].difficulty,
            certificates[tokenId].score
        );
    }
    function checkCompletion(string memory courseCode) public view returns (bool) {
        // check if user already has certificate for this course
        for (uint i=0; i < certificates.length; i++) {
            if (certificates[i].owner == msg.sender && stringsEqual(certificates[i].code, courseCode)) {
                return true;
            }
        }    
        
        return false;

    }

    function stringsEqual(string memory a, string memory b) public view returns (bool) {
        return (keccak256(abi.encodePacked((a))) == keccak256(abi.encodePacked((b))));
    }

    function getTokenURI(uint256 tokenId) public view returns (string memory) {
        return tokenURI(tokenId);
    }

}
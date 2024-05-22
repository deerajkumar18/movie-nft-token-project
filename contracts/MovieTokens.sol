// SPDX-License-Identifier: MIT
// Compatible with OpenZeppelin Contracts ^5.0.0
pragma solidity ^0.8.20;

import '@openzeppelin/contracts/token/ERC721/ERC721.sol';
import '@openzeppelin/contracts/access/Ownable.sol';

contract MovieTokens is ERC721 , Ownable{
uint256 public totalSupply;
uint256 public maxSupply;
string internal baseTokenURI;
mapping (uint256 => bool) private ticketMintedBytheCinemaHallowner;

//create an event if the token transfer is successful
event successfulTicketTransfer(address indexed _to , uint256 indexed _tokenID);

//create a constructor to mint token to the specific address
constructor(uint256 _maxTokenSupply , string memory _baseTokenURI ) ERC721("MovieToken","MOVT") Ownable(msg.sender){
    maxSupply = _maxTokenSupply;
    baseTokenURI=_baseTokenURI;
}

function mintMovieTokens()external onlyOwner{
    require(msg.sender == owner() , "Only the owner can call the mint method");
    require(totalSupply == 0 , "Cannot mint new tickets until total supply is zero");

    for (totalSupply=0;totalSupply<maxSupply;totalSupply++){
        uint256 newTokenID = totalSupply+1;
        _safeMint(msg.sender,newTokenID);
        ticketMintedBytheCinemaHallowner[newTokenID]=true;
    }
}

//returns the token URI which holds all the metadata related to the tokens existing
function tokenURI(uint256 _tokenID) public view override returns(string memory){
    _requireOwned(_tokenID);
    return string(abi.encodePacked(baseTokenURI,Strings.toString(_tokenID),'.json'));
} 


function transferTicketNFT(address _to) external onlyOwner{
    require(msg.sender == owner() , "Only the ticket minter can call the transfer method");
    require(totalSupply>0, "No tickets left to sell");

    _transfer(owner(),_to,totalSupply);
    emit successfulTicketTransfer(_to, totalSupply);
    totalSupply--;
}

function verifyTicket(uint256 _tokenID) external view onlyOwner returns(bool){
    return ticketMintedBytheCinemaHallowner[_tokenID];
}



}


const {loadFixture, time} = require("@nomicfoundation/hardhat-toolbox/network-helpers");
const { expect } = require("chai");
const { any } = require("hardhat/internal/core/params/argumentTypes");

describe("MovieTicketNFTTest", function () {
  // We define a fixture to reuse the same setup in every test.
  // We use loadFixture to run this setup once, snapshot that state,
  // and reset Hardhat Network to that snapshot in every test.
  
  async function movieTicketNFTFixture() {
  let maxTokenSupply= 1;
  let baseTokenURI= "C:/Users/kkdee/Documents/movie-nft-token-project/token_metadata/";
  const Contract = await ethers.getContractFactory("MovieTokens");
  const contract = await Contract.deploy(maxTokenSupply,baseTokenURI);
  const [owner , user1 , user2 ,user3 ] = await ethers.getSigners();
    return { contract , maxTokenSupply, baseTokenURI, owner , user1 , user2,user3};
  }

  describe("Deployment", function () {
    it("Should set the deployer address as the owner", async function () {
        const { contract,owner } = await loadFixture(movieTicketNFTFixture);
  
        expect(await contract.owner()).to.equal(owner);
      });

    it("Should set the right max token supply value", async function () {
      const { contract,maxTokenSupply } = await loadFixture(movieTicketNFTFixture);

      expect(await contract.maxSupply()).to.equal(maxTokenSupply);
    });

  });

    describe("Minting tokens", function () {
      it("Contract should set the right token balance on the user1 account", async function () {
        const { contract,owner,maxTokenSupply } = await loadFixture(movieTicketNFTFixture);

      expect(await contract.mintMovieTokens()).to.changeTokenBalance(contract,owner,maxTokenSupply);
      expect(await contract.totalSupply()).to.equal(maxTokenSupply);
      expect(await contract.tokenURI(1)).to.equal("C:/Users/kkdee/Documents/movie-nft-token-project/token_metadata/1.json");

      });

    });

    describe("Token transfer" , function () {
      it("Owner should be able to transfer token to user1 , where user1 has a balance of 1 token while owner's token balance is reduced by 1 ", async function () {
        const { contract,owner,user1,maxTokenSupply } = await loadFixture(movieTicketNFTFixture);
        expect(await contract.mintMovieTokens()).to.changeTokenBalance(contract,owner,maxTokenSupply);
        expect(await contract.totalSupply()).to.equal(maxTokenSupply);
        expect(await contract.transferTicketNFT(user1)).to.changeTokenBalance(contract,[owner,user1],[0,1]);

        //verify ownership is now transfered to the user1
        expect(await contract.ownerOf(1)).to.equal(user1);

        //Verifying that the token was initially minted by the owner
        expect(await contract.verifyTicket(1)).to.equal(true);
      });

    });


});

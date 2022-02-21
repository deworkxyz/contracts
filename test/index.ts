import { expect } from "chai";
import { ethers, upgrades } from "hardhat";
import faker from "faker";
import { DeworkTasksV1, DeworkTasksV2 } from "../typechain";

describe("TaskNFTs", function () {
  async function deployV1(
    baseURI: string = faker.internet.url()
  ): Promise<DeworkTasksV1> {
    const ContractV1 = await ethers.getContractFactory("DeworkTasksV1");
    const contract = await upgrades.deployProxy(ContractV1, [baseURI + "/"]);
    return contract as DeworkTasksV1;
  }

  async function upgradeV2(address: string): Promise<DeworkTasksV2> {
    const ContractV2 = await ethers.getContractFactory("DeworkTasksV2");
    const contract = await upgrades.upgradeProxy(address, ContractV2);
    await contract.addMinter(await contract.owner());
    return contract as DeworkTasksV2;
  }

  async function deploy(baseURI: string = faker.internet.url()) {
    const v1 = await deployV1(baseURI);
    const v2 = await upgradeV2(v1.address);
    return v2;
  }

  describe("metadata", () => {
    it("should return correct tokenURI", async () => {
      const baseURI = faker.internet.url();
      const tokenId = faker.datatype.number();
      const contract = await deploy(baseURI);

      const [owner] = await ethers.getSigners();

      await contract.mint(await owner.getAddress(), tokenId, false);
      expect(await contract.name()).to.equal("Dework");
      expect(await contract.symbol()).to.equal("Dework");
      expect(await contract.tokenURI(tokenId)).to.equal(
        `${baseURI}/${tokenId}`
      );
    });

    it("should allow owner to update tokenURI", async () => {
      const tokenId = faker.datatype.number();
      const contract = await deploy();

      const updatedBaseURI = faker.internet.url();
      const [owner, other] = await ethers.getSigners();

      await expect(
        contract.connect(other).setBaseURI(updatedBaseURI + "/")
      ).to.be.revertedWith("Ownable: caller is not the owner");

      await expect(contract.setBaseURI(updatedBaseURI + "/")).not.to.be
        .reverted;

      await contract.mint(await owner.getAddress(), tokenId, false);
      expect(await contract.tokenURI(tokenId)).to.equal(
        `${updatedBaseURI}/${tokenId}`
      );
    });
  });

  describe("mint", () => {
    it("should only allow owner to mint", async () => {
      const tokenId = faker.datatype.number();
      const contract = await deploy();

      const [owner, other] = await ethers.getSigners();

      await expect(
        contract.connect(other).mint(await owner.getAddress(), tokenId, false)
      ).to.be.reverted;
      expect(await contract.balanceOf(await owner.getAddress())).to.equal(0);

      await expect(contract.mint(await owner.getAddress(), tokenId, false)).not
        .to.be.reverted;
      expect(await contract.balanceOf(await owner.getAddress())).to.equal(1);
    });

    it("should allow owner to add another address to mint", async () => {
      const tokenId = faker.datatype.number();
      const contract = await deploy();

      const [owner, other] = await ethers.getSigners();

      await expect(contract.connect(other).addMinter(await other.getAddress()))
        .to.be.reverted;

      await contract.addMinter(await other.getAddress());
      await expect(
        contract.connect(other).mint(await owner.getAddress(), tokenId, false)
      ).not.to.be.reverted;
      expect(await contract.balanceOf(await owner.getAddress())).to.equal(1);
    });
  });

  describe("transfer", () => {
    it("should not let contract owner or NFT holder to transfer", async () => {
      const tokenId = faker.datatype.number();
      const contract = await deploy();

      const [owner, other] = await ethers.getSigners();

      await contract.mint(await other.getAddress(), tokenId, false);
      await expect(
        contract
          .connect(other)
          .transferFrom(
            await other.getAddress(),
            await owner.getAddress(),
            tokenId
          )
      ).to.be.reverted;
      expect(await contract.balanceOf(await other.getAddress())).to.equal(1);
      expect(await contract.balanceOf(await owner.getAddress())).to.equal(0);

      await expect(
        contract
          .connect(owner)
          .transferFrom(
            await other.getAddress(),
            await owner.getAddress(),
            tokenId
          )
      ).to.be.revertedWith("ERC721: transfer caller is not owner nor approved");
      expect(await contract.balanceOf(await other.getAddress())).to.equal(1);
      expect(await contract.balanceOf(await owner.getAddress())).to.equal(0);
    });
  });

  describe("verified", () => {
    it("should return true or false depending on what was set when minting", async () => {
      const verifiedTokenId = faker.datatype.number();
      const unverifiedTokenId = faker.datatype.number();

      const contract = await deploy();
      const [owner] = await ethers.getSigners();

      await contract.mint(await owner.getAddress(), verifiedTokenId, true);
      await contract.mint(await owner.getAddress(), unverifiedTokenId, false);

      expect(await contract.verified(verifiedTokenId)).to.equal(true);
      expect(await contract.verified(unverifiedTokenId)).to.equal(false);
    });

    it("should be possible for owner to retroactively mark as verified", async () => {
      const tokenId = faker.datatype.number();
      const contract = await deploy();
      const [owner] = await ethers.getSigners();

      await contract.mint(await owner.getAddress(), tokenId, false);
      expect(await contract.verified(tokenId)).to.equal(false);

      await contract.connect(owner).setVerified(tokenId, true);
      expect(await contract.verified(tokenId)).to.equal(true);
    });
  });
});

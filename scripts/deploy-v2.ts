import { ethers, upgrades } from "hardhat";
import { getImplementationAddress } from "@openzeppelin/upgrades-core";

async function main() {
  const DeworkTasksV2 = await ethers.getContractFactory("DeworkTasksV2");
  const contract = await upgrades.deployProxy(DeworkTasksV2, [
    "https://dwrk.io/",
  ]);
  await contract.deployed();

  const proxyAddress = contract.address;
  const implementationAddress = await getImplementationAddress(
    ethers.provider,
    proxyAddress
  );
  console.log("DeworkTasksV2 deployed to:", {
    proxyAddress,
    implementationAddress,
  });
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

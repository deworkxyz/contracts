import { ethers, upgrades } from "hardhat";
import { getImplementationAddress } from "@openzeppelin/upgrades-core";

async function main() {
  const DeworkTasksV1 = await ethers.getContractFactory("DeworkTasksV1");
  const contract = await upgrades.deployProxy(DeworkTasksV1, [
    "https://dwrk.io/",
  ]);
  await contract.deployed();

  const proxyAddress = contract.address;
  const implementationAddress = await getImplementationAddress(
    ethers.provider,
    proxyAddress
  );
  console.log("DeworkTasksV1 deployed to:", {
    proxyAddress,
    implementationAddress,
  });
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

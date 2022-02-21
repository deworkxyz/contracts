// scripts/upgrade-box.js
const { ethers, upgrades } = require("hardhat");

async function main() {
  const address = "0x32983c2836A7eF235cc64088A3AE358b9C3E4b17";
  const DeworkTasksV2 = await ethers.getContractFactory("DeworkTasksV2");
  await upgrades.upgradeProxy(address, DeworkTasksV2);
  console.log("DeworkTasks upgraded to V2");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

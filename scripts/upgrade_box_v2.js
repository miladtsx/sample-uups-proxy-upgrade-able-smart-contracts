// const { ethers, upgrades } = require("hardhat");
// PROXY_CONTRACT_ADDRESS = "0xe7f1725e7734ce288f8367e1bb143e90bb3f0512";
async function main() {
  // const BoxV2 = await ethers.getContractFactory("BoxV2");
  // console.log("Upgrading ...");
  // const box = await upgrades.upgradeProxy(PROXY_CONTRACT_ADDRESS, BoxV2);
  // console.log("Box Upgraded!", box.address);
}

main().catch((error) => {
  console.log(error);
  process.exitCode = 1;
});

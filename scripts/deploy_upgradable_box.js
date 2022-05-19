// const { ethers, upgrades } = require("hardhat");
async function main() {
  // await hre.network.provider.send("hardhat_reset");
  // const Box = await ethers.getContractFactory("Box");
  // console.log("Deploying Box ...");
  // const proxy = await upgrades.deployProxy(Box, [200], { initializer: "set" }); //, kind: "uups", pollingInterval: 999999, timeout: 999999 });
  // await proxy.deployed();
  // console.log(`Proxy address ${proxy.address}`);
  // console.log("Box Value:", (await proxy.get()).toString());
}

main().catch((error) => {
  console.log(error);
  process.exitCode = 1;
});

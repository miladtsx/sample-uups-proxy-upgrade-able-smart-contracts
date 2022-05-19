async function main() {
  // const Box = await hre.ethers.getContractFactory("Box");
  // const box = await Box.deploy();
  // await box.deployed();
  // console.log("Greeter deployed to:", box.address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

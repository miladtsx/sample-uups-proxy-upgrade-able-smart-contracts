const { expect } = require("chai");
const { ethers, upgrades } = require("hardhat");
const { expectRevert } = require("@openzeppelin/test-helpers");

describe("Box", function (accounts) {
  let proxyContract;
  let deployProxy;
  let Box;
  let BoxV2;
  let BoxV3;

  before(async () => {
    Box = await ethers.getContractFactory("Box");
    BoxV2 = await ethers.getContractFactory("BoxV2");
    deployProxy = async () => {
      const _proxy = await upgrades.deployProxy(Box, [200], {
        initializer: "set",
        kind: "uups",
      });
      await _proxy.deployed();
      proxyContract = _proxy;
    };
  });

  it("should deploy correctly", async function () {
    const [admin, newAdmin, otherAccount] = await ethers.getSigners();

    await deployProxy();
    expect(await proxyContract.get()).be.equal(200);

    // Check the owner
    expect(await proxyContract.owner()).be.equal(admin.address);

    // Prevent reInitializations
    await expectRevert(
      proxyContract.set(200),
      "Initializable: contract is already initialized"
    );

    await expectRevert(
      proxyContract.connect(newAdmin).set(200),
      "Initializable: contract is already initialized"
    );

    // Prevent un-authorized access
    await expectRevert(
      upgrades.upgradeProxy(proxyContract.address, BoxV2.connect(newAdmin)),
      "Unauthorized access"
    );

    // Pause all operations
    // only admin or proxy admin
    await expectRevert(
      proxyContract.connect(newAdmin).pause(),
      "Ownable: caller is not the owner"
    );

    expect(await proxyContract.get()).be.equal(200);
    await proxyContract.pause();
    await expectRevert(proxyContract.get(), "Pausable: paused");

    await proxyContract.connect(admin).unpause();
    // UnPause all operations

    expect(await proxyContract.get()).to.be.equal(200);
    await proxyContract.increment();
    expect(await proxyContract.get()).to.be.equal(199); // Buggy value; the correct one is 201;

    // Upgrade - Fix the Bug
    proxyContract = await upgrades.upgradeProxy(proxyContract.address, BoxV2);

    //! TODO how to add a new initializer?
    // await expectRevert(
    //   proxyContract.newInitializer(),
    //   "Initializable: contract is already initialized"
    // );

    // State variables or Storage should be kept intact after the upgrade
    expect(await proxyContract.get()).be.equal(199);

    // the bug should be fixed
    await proxyContract.increment();
    expect(await proxyContract.get()).to.be.equal(200);

    //! TODO check event emitting
    // await upgradeResult.deployTransaction.wait();
    // let { hash, receipt } = upgradeResult.deployTransaction

    // let implementation_address = await upgrades.erc1967.getImplementationAddress(proxyContract.address)
    // let _box = await Box.attach(implementation_address)
    // await expectEvent.inTransaction(hash, _box, "Upgraded");

    // change the proxy admin
    await expect(proxyContract.transferOwnership(newAdmin.address))
      .to.emit(proxyContract, "OwnershipTransferred")
      .withArgs(admin.address, newAdmin.address);
    expect(await proxyContract.owner()).not.be.equal(admin.address);
    expect(await proxyContract.owner()).be.equal(newAdmin.address);

    // Confirm newAdmin access
    await expectRevert(
      proxyContract.connect(admin).pause(),
      "Ownable: caller is not the owner"
    );
    await proxyContract.connect(newAdmin).pause();
    await expectRevert(proxyContract.get(), "Pausable: paused");
    await expectRevert(
      proxyContract.connect(newAdmin).get(),
      "Pausable: paused"
    );
    await proxyContract.connect(newAdmin).unpause();
    expect(await proxyContract.get()).to.be.equal(200);

    // Upgrade by newAdmin - add new public variable (very simple Staking)
    BoxV3 = await ethers.getContractFactory("BoxV3", newAdmin);
    proxyContract = await upgrades.upgradeProxy(proxyContract.address, BoxV3);

    // Storage is intact
    expect(await proxyContract.get()).to.be.equal(200);

    // Stake and get the Event
    const otherAccountProxy = proxyContract.connect(otherAccount);
    expect(await otherAccountProxy.readStakedAmount()).be.equal(0);
    await expectRevert(otherAccountProxy.stake(0), "_amount > 0");
    await expect(otherAccountProxy.stake(1)).to.emit(proxyContract, "Staked");
    expect(await otherAccountProxy.readStakedAmount()).be.equal(1);

    // Pause
    await proxyContract.connect(newAdmin).pause();
    expect(await otherAccountProxy.readStakedAmount()).be.equal(1);
    await expectRevert(otherAccountProxy.stake(0), "Pausable: paused");
    await proxyContract.connect(newAdmin).unpause();
    await expectRevert(otherAccountProxy.stake(0), "_amount > 0");
  });
});

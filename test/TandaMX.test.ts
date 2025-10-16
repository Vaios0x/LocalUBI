import { expect } from "chai";
import { ethers } from "hardhat";

describe("TandaMX", function () {
  let tandaMX: any;
  let owner: any;
  let user1: any;
  let user2: any;
  let user3: any;

  beforeEach(async function () {
    [owner, user1, user2, user3] = await ethers.getSigners();

    const TandaMX = await ethers.getContractFactory("TandaMX");
    tandaMX = await TandaMX.deploy();
    await tandaMX.deployed();
  });

  it("Should create tanda correctly", async function () {
    const monthlyAmount = ethers.parseUnits("500", 18);
    const maxMembers = 5;
    const frequency = 30 * 24 * 60 * 60; // 30 days

    await tandaMX.createTanda(monthlyAmount, maxMembers, frequency);

    const tanda = await tandaMX.getTandaDetails(1);
    expect(tanda.monthlyAmount).to.equal(monthlyAmount);
    expect(tanda.maxMembers).to.equal(maxMembers);
    expect(tanda.currentMembers).to.equal(1);
    expect(tanda.creator).to.equal(owner.address);
  });

  it("Should allow users to join tanda", async function () {
    const monthlyAmount = ethers.parseUnits("500", 18);
    const maxMembers = 3;
    const frequency = 30 * 24 * 60 * 60;

    await tandaMX.createTanda(monthlyAmount, maxMembers, frequency);
    await tandaMX.connect(user1).joinTanda(1);
    await tandaMX.connect(user2).joinTanda(1);

    const tanda = await tandaMX.getTandaDetails(1);
    expect(tanda.currentMembers).to.equal(3);
    expect(tanda.isActive).to.be.true;
  });

  it("Should not allow joining full tanda", async function () {
    const monthlyAmount = ethers.parseUnits("500", 18);
    const maxMembers = 2;
    const frequency = 30 * 24 * 60 * 60;

    await tandaMX.createTanda(monthlyAmount, maxMembers, frequency);
    await tandaMX.connect(user1).joinTanda(1);

    await expect(tandaMX.connect(user2).joinTanda(1))
      .to.be.revertedWith("Tanda is full");
  });

  it("Should validate minimum amount", async function () {
    const monthlyAmount = ethers.parseUnits("50", 18); // Below minimum
    const maxMembers = 3;
    const frequency = 30 * 24 * 60 * 60;

    await expect(tandaMX.createTanda(monthlyAmount, maxMembers, frequency))
      .to.be.revertedWith("Amount too low");
  });

  it("Should validate member count", async function () {
    const monthlyAmount = ethers.parseUnits("500", 18);
    const maxMembers = 2; // Below minimum
    const frequency = 30 * 24 * 60 * 60;

    await expect(tandaMX.createTanda(monthlyAmount, maxMembers, frequency))
      .to.be.revertedWith("Invalid member count");
  });
});

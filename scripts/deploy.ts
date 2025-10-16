import { ethers } from "hardhat";

async function main() {
  console.log("Deploying TandaMX contract...");

  const [deployer] = await ethers.getSigners();
  console.log("Deploying with account:", deployer.address);

  // Celo Mainnet addresses
  const GDOLLAR_ADDRESS = "0x62B8B11039FcfE5aB0C56E502b1C372A3d2a9c7A";
  const CUSD_ADDRESS = "0x765DE816845861e75A25fCA122bb6898B8B1282a";

  const TandaMX = await ethers.getContractFactory("TandaMX");
  
  const tandaMX = await TandaMX.deploy(GDOLLAR_ADDRESS, CUSD_ADDRESS);
  await tandaMX.waitForDeployment();
  const address = await tandaMX.getAddress();

  console.log("TandaMX deployed to:", address);
  
  // Save deployment info
  const fs = require("fs");
  const deploymentInfo = {
    network: (await ethers.provider.getNetwork()).name,
    address: address,
    gDollar: GDOLLAR_ADDRESS,
    cUSD: CUSD_ADDRESS,
    deployer: deployer.address,
    timestamp: new Date().toISOString(),
  };
  
  fs.writeFileSync(
    `deployment-${deploymentInfo.network}.json`,
    JSON.stringify(deploymentInfo, null, 2)
  );
  
  console.log("Deployment info saved!");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
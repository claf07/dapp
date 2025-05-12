const hre = require("hardhat");

async function main() {
  console.log("Deploying contracts...");

  // Deploy OrganDonationSystem
  const OrganDonationSystem = await hre.ethers.getContractFactory("OrganDonationSystem");
  const organDonationSystem = await OrganDonationSystem.deploy();
  await organDonationSystem.deployed();
  console.log("OrganDonationSystem deployed to:", organDonationSystem.address);

  // Deploy DonorLegacyNFT
  const DonorLegacyNFT = await hre.ethers.getContractFactory("DonorLegacyNFT");
  const donorLegacyNFT = await DonorLegacyNFT.deploy();
  await donorLegacyNFT.deployed();
  console.log("DonorLegacyNFT deployed to:", donorLegacyNFT.address);

  // Get deployer account
  const [deployer] = await hre.ethers.getSigners();
  console.log("Deploying contracts with account:", deployer.address);

  // Grant roles to deployer
  await organDonationSystem.grantRole(await organDonationSystem.ADMIN_ROLE(), deployer.address);
  await organDonationSystem.grantRole(await organDonationSystem.HOSPITAL_ROLE(), deployer.address);
  console.log("Roles granted to deployer");

  // Grant hospital role to test accounts
  const testAccounts = [
    "0x70997970C51812dc3A010C7d01b50e0d17dc79C8",
    "0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC",
    "0x90F79bf6EB2c4f870365E785982E1f101E93b906"
  ];

  for (const account of testAccounts) {
    await organDonationSystem.grantRole(await organDonationSystem.HOSPITAL_ROLE(), account);
    console.log(`Hospital role granted to ${account}`);
  }

  console.log("Deployment completed successfully!");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  }); 
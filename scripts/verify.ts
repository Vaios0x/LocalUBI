import { run } from "hardhat";

async function main() {
  console.log("Verifying contracts...");

  try {
    // Verify TandaMX contract
    await run("verify:verify", {
      address: process.env.TANDA_ADDRESS,
      constructorArguments: [],
    });

    console.log("✅ TandaMX contract verified successfully!");
  } catch (error) {
    console.error("❌ Verification failed:", error);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

const { ethers } = require("hardhat");
const { contractService } = require("../services/contractService");
const { analyticsService } = require("../services/analytics/analyticsService");
const { securityService } = require("../services/security/securityService");
const { calculateCompatibilityScore, findBestMatches } = require("../services/ml/matchingService");

async function main() {
    console.log("🚀 Starting Organ Donation Platform Demo...\n");

    // Initialize services
    await contractService.init();
    await analyticsService.init();
    await securityService.init();

    // Demo users
    const users = {
        donor1: {
            name: "John Doe",
            bloodGroup: "O+",
            age: 35,
            height: 180,
            weight: 75,
            medicalHistory: {
                hasChronicDisease: false,
                hasSmokingHistory: false,
                hasAlcoholHistory: false
            }
        },
        patient1: {
            name: "Jane Smith",
            bloodGroup: "A+",
            age: 32,
            height: 165,
            weight: 60,
            urgency: "critical"
        }
    };

    console.log("👥 Demo Users Created:");
    console.log("Donor:", users.donor1);
    console.log("Patient:", users.patient1);
    console.log("\n");

    // Simulate matching
    console.log("🔍 Running Matching Algorithm...");
    const compatibilityScore = calculateCompatibilityScore(users.patient1, users.donor1);
    console.log(`Compatibility Score: ${compatibilityScore}/100\n`);

    // Simulate emergency request
    console.log("🚨 Creating Emergency Request...");
    const emergencyRequest = {
        patient: users.patient1,
        organ: "kidney",
        urgency: "critical",
        region: "North",
        timestamp: Date.now()
    };
    console.log("Emergency Request:", emergencyRequest);
    console.log("\n");

    // Simulate donor legacy NFT
    console.log("🏆 Minting Donor Legacy NFT...");
    const nftDetails = {
        name: users.donor1.name,
        hospitalId: "HOSPITAL-001",
        organType: "kidney",
        verificationCode: "VERIFY-123",
        tokenURI: "ipfs://QmExample"
    };
    console.log("NFT Details:", nftDetails);
    console.log("\n");

    // Simulate analytics
    console.log("📊 Generating Analytics Report...");
    const analyticsReport = await analyticsService.generateAnalyticsReport();
    console.log("Match Trends:", analyticsReport.matchTrends);
    console.log("Emergency Heatmap:", analyticsReport.emergencyHeatmap);
    console.log("\n");

    // Simulate security monitoring
    console.log("🔒 Running Security Checks...");
    const securityReport = await securityService.generateSecurityReport();
    console.log("Suspicious Activities:", securityReport.suspiciousActivities.length);
    console.log("Rate Limits:", securityReport.rateLimits.length);
    console.log("\n");

    // Simulate DAO governance
    console.log("🏛️ DAO Governance Simulation...");
    const proposal = {
        description: "Update matching algorithm parameters",
        proposer: "0x123...",
        startTime: Date.now(),
        endTime: Date.now() + 259200000 // 3 days
    };
    console.log("New Proposal:", proposal);
    console.log("\n");

    console.log("✅ Demo Completed Successfully!");
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    }); 
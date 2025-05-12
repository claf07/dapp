const Web3 = require('web3');
const { contractService } = require('../contractService');

class AnalyticsService {
    constructor() {
        this.web3 = null;
        this.contract = null;
    }

    async init() {
        if (this.web3 && this.contract) return;
        await contractService.init();
        this.web3 = contractService.web3;
        this.contract = contractService.contract;
    }

    async getMatchTrends() {
        await this.init();
        const events = await this.contract.getPastEvents('MatchCreated', {
            fromBlock: 0,
            toBlock: 'latest'
        });

        const trends = {
            daily: {},
            monthly: {},
            organTypes: {},
            successRate: 0
        };

        events.forEach(event => {
            const date = new Date(event.returnValues.timestamp * 1000);
            const dayKey = date.toISOString().split('T')[0];
            const monthKey = `${date.getFullYear()}-${date.getMonth() + 1}`;

            // Daily trends
            trends.daily[dayKey] = (trends.daily[dayKey] || 0) + 1;

            // Monthly trends
            trends.monthly[monthKey] = (trends.monthly[monthKey] || 0) + 1;

            // Organ type distribution
            const organType = event.returnValues.organ;
            trends.organTypes[organType] = (trends.organTypes[organType] || 0) + 1;
        });

        // Calculate success rate
        const totalMatches = events.length;
        const completedMatches = events.filter(e => e.returnValues.isCompleted).length;
        trends.successRate = totalMatches > 0 ? (completedMatches / totalMatches) * 100 : 0;

        return trends;
    }

    async getEmergencyRequestHeatmap() {
        await this.init();
        const events = await this.contract.getPastEvents('EmergencyRequestCreated', {
            fromBlock: 0,
            toBlock: 'latest'
        });

        const heatmap = {
            byRegion: {},
            byEmergencyLevel: {
                critical: 0,
                urgent: 0,
                normal: 0
            },
            byOrgan: {}
        };

        events.forEach(event => {
            const { region, emergencyLevel, organ } = event.returnValues;

            // Region distribution
            heatmap.byRegion[region] = (heatmap.byRegion[region] || 0) + 1;

            // Emergency level distribution
            heatmap.byEmergencyLevel[emergencyLevel]++;

            // Organ type distribution
            heatmap.byOrgan[organ] = (heatmap.byOrgan[organ] || 0) + 1;
        });

        return heatmap;
    }

    async getBlockchainActivityLogs() {
        await this.init();
        const events = await this.contract.getPastEvents('allEvents', {
            fromBlock: 0,
            toBlock: 'latest'
        });

        return events.map(event => ({
            event: event.event,
            blockNumber: event.blockNumber,
            timestamp: event.returnValues.timestamp,
            transactionHash: event.transactionHash,
            returnValues: event.returnValues
        }));
    }

    async getWalletReputationScore(address) {
        await this.init();
        const user = await this.contract.methods.users(address).call();
        
        let score = 0;
        
        // Base score from reputation
        score += parseInt(user.reputation) * 10;

        // Check for completed donations
        const matchEvents = await this.contract.getPastEvents('MatchCompleted', {
            fromBlock: 0,
            toBlock: 'latest',
            filter: { donor: address }
        });
        score += matchEvents.length * 20;

        // Check for emergency requests
        const emergencyEvents = await this.contract.getPastEvents('EmergencyRequestCreated', {
            fromBlock: 0,
            toBlock: 'latest',
            filter: { patient: address }
        });
        score += emergencyEvents.length * 5;

        // Penalties for failed matches
        const failedMatches = await this.contract.getPastEvents('MatchFailed', {
            fromBlock: 0,
            toBlock: 'latest',
            filter: { donor: address }
        });
        score -= failedMatches.length * 15;

        return Math.max(0, score);
    }

    async generateAnalyticsReport() {
        const [matchTrends, emergencyHeatmap, activityLogs] = await Promise.all([
            this.getMatchTrends(),
            this.getEmergencyRequestHeatmap(),
            this.getBlockchainActivityLogs()
        ]);

        return {
            matchTrends,
            emergencyHeatmap,
            activityLogs,
            generatedAt: new Date().toISOString()
        };
    }
}

module.exports = new AnalyticsService(); 
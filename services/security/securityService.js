const Web3 = require('web3');
const { contractService } = require('../contractService');

class SecurityService {
    constructor() {
        this.web3 = null;
        this.contract = null;
        this.rateLimits = new Map();
        this.suspiciousActivities = new Set();
    }

    async init() {
        if (this.web3 && this.contract) return;
        await contractService.init();
        this.web3 = contractService.web3;
        this.contract = contractService.contract;
    }

    // Rate limiting implementation
    checkRateLimit(address, action, limit = 5, window = 3600000) { // 1 hour window
        const key = `${address}-${action}`;
        const now = Date.now();
        
        if (!this.rateLimits.has(key)) {
            this.rateLimits.set(key, []);
        }

        const timestamps = this.rateLimits.get(key);
        const windowStart = now - window;

        // Remove old timestamps
        while (timestamps.length && timestamps[0] < windowStart) {
            timestamps.shift();
        }

        // Check if limit is exceeded
        if (timestamps.length >= limit) {
            return false;
        }

        // Add new timestamp
        timestamps.push(now);
        return true;
    }

    // Monitor for suspicious activities
    async monitorTransaction(txHash) {
        await this.init();
        const tx = await this.web3.eth.getTransaction(txHash);
        const receipt = await this.web3.eth.getTransactionReceipt(txHash);

        const suspiciousPatterns = [
            // High gas price
            tx.gasPrice > this.web3.utils.toWei('100', 'gwei'),
            // Unusual gas limit
            tx.gas > 1000000,
            // Contract creation
            !tx.to,
            // Failed transaction
            !receipt.status
        ];

        if (suspiciousPatterns.some(pattern => pattern)) {
            this.suspiciousActivities.add(txHash);
            return {
                isSuspicious: true,
                patterns: suspiciousPatterns,
                txHash,
                from: tx.from,
                to: tx.to,
                value: tx.value,
                gasPrice: tx.gasPrice,
                gas: tx.gas
            };
        }

        return { isSuspicious: false, txHash };
    }

    // Monitor contract events for potential abuse
    async monitorContractEvents() {
        await this.init();
        const events = await this.contract.getPastEvents('allEvents', {
            fromBlock: 'latest',
            toBlock: 'latest'
        });

        const suspiciousEvents = events.filter(event => {
            // Check for rapid succession of events
            const isRapid = this.checkRateLimit(
                event.returnValues.from || event.returnValues.sender,
                event.event,
                3,
                60000 // 1 minute window
            );

            // Check for unusual patterns
            const isUnusual = this.detectUnusualPatterns(event);

            return !isRapid || isUnusual;
        });

        return suspiciousEvents;
    }

    // Detect unusual patterns in events
    detectUnusualPatterns(event) {
        const patterns = {
            // Multiple matches in short time
            MatchCreated: (event) => {
                const matches = this.rateLimits.get(`${event.returnValues.donor}-MatchCreated`) || [];
                return matches.length > 2;
            },
            // Multiple emergency requests
            EmergencyRequestCreated: (event) => {
                const requests = this.rateLimits.get(`${event.returnValues.patient}-EmergencyRequestCreated`) || [];
                return requests.length > 1;
            },
            // Multiple verifications
            UserVerified: (event) => {
                const verifications = this.rateLimits.get(`${event.returnValues.verifier}-UserVerified`) || [];
                return verifications.length > 5;
            }
        };

        return patterns[event.event] ? patterns[event.event](event) : false;
    }

    // Generate security report
    async generateSecurityReport() {
        const [suspiciousEvents, recentTransactions] = await Promise.all([
            this.monitorContractEvents(),
            this.getRecentTransactions()
        ]);

        return {
            suspiciousEvents,
            recentTransactions,
            rateLimits: Array.from(this.rateLimits.entries()),
            suspiciousActivities: Array.from(this.suspiciousActivities),
            generatedAt: new Date().toISOString()
        };
    }

    // Get recent transactions
    async getRecentTransactions() {
        await this.init();
        const block = await this.web3.eth.getBlock('latest');
        const transactions = [];

        for (let i = 0; i < 10; i++) {
            const tx = await this.web3.eth.getTransaction(block.transactions[i]);
            if (tx) {
                transactions.push({
                    hash: tx.hash,
                    from: tx.from,
                    to: tx.to,
                    value: tx.value,
                    gasPrice: tx.gasPrice,
                    gas: tx.gas
                });
            }
        }

        return transactions;
    }
}

module.exports = new SecurityService(); 
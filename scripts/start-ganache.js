const { spawn } = require('child_process');
const path = require('path');

// Windows-specific command
const isWindows = process.platform === 'win32';
const ganacheCommand = isWindows ? 'npx.cmd' : 'npx';
const ganacheArgs = [
  'ganache',
  '--chain.chainId=1337',
  '--chain.networkId=1337',
  '--server.port=7545',
  '--database.dbPath=./ganache-db',
  '--wallet.mnemonic="test test test test test test test test test test test junk"',
  '--wallet.totalAccounts=20'
];

console.log('Starting Ganache...');
const ganacheProcess = spawn(ganacheCommand, ganacheArgs, {
  stdio: 'inherit',
  shell: true
});

// Handle process events
ganacheProcess.on('error', (error) => {
  console.error('Failed to start Ganache:', error);
  process.exit(1);
});

// Wait for Ganache to start
setTimeout(async () => {
  try {
    console.log('Deploying contracts...');
    const { execSync } = require('child_process');
    execSync('npx hardhat run scripts/deploy.js --network ganache', {
      stdio: 'inherit'
    });
  } catch (error) {
    console.error('Failed to deploy contracts:', error);
    ganacheProcess.kill();
    process.exit(1);
  }
}, 5000);

// Handle process termination
process.on('SIGINT', () => {
  console.log('Stopping Ganache...');
  ganacheProcess.kill();
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('Stopping Ganache...');
  ganacheProcess.kill();
  process.exit(0);
}); 
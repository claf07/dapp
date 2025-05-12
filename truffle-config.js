module.exports = {
  networks: {
    development: {
      host: "127.0.0.1",
      port: 8545, // Ganache default CLI port
      network_id: "*", // Match any network id
    },
  },
  compilers: {
    solc: {
      version: "0.8.20", // Match Solidity version used in contracts
      settings: {
        optimizer: {
          enabled: true,
          runs: 1 // Reduced runs to minimize contract size
        },
        viaIR: true // Enable the new IR-based codegen
      }
    },
  },
  settings: {
  optimizer: {
    enabled: true,
    runs: 200
  }
},
};

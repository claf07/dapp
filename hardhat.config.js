
require("@nomicfoundation/hardhat-toolbox");

module.exports = {
  solidity: "0.8.19",
  networks: {
    ganache: {
      url: "http://0.0.0.0:7545",
      chainId: 1337
    }
  }
};

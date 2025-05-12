const DonorContract = artifacts.require("DonorContract");
const DonorBadge = artifacts.require("DonorBadge");

module.exports = function (deployer) {
  deployer.deploy(DonorContract).then(function() {
    return deployer.deploy(DonorBadge);
  });
};

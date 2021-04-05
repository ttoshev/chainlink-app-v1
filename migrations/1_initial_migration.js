var Migrations = artifacts.require("./Migrations.sol");

module.exports = function(deployer, network) {
  if (!network.startsWith('rinkeby')) {
    deployer.deploy(Migrations);
  }
};

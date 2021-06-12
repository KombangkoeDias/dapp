const Migrations = artifacts.require("KBD");

module.exports = function (deployer) {
  deployer.deploy(Migrations);
};

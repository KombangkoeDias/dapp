const web3 = require("web3");

const { RPC, IPC } = require("../../configs");

const Web3 = new web3(RPC);

module.exports = Web3;

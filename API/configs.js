const web3 = require("web3");

var net = require("net");

const RPC = "http://localhost:7545";

// const deployedAddress = "0x0000000000000000000000000000000000001234";

const deployedAddress = "0x078a14C5555C052c668737Bdf793f24a250F77e0";

const IPC = new web3.providers.IpcProvider(
  "/Users/sakonthephamongkhol/Downloads/Intern/geth/concepts/test1/node1/geth.ipc",
  net
);

module.exports = { RPC, deployedAddress, IPC };

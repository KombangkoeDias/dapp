const web3 = require("web3");

var net = require("net");

const RPC = "http://localhost:7545";

// const RPC = "https://kovan.poa.network";

// const deployedAddress = "0x0000000000000000000000000000000000001234";

var deployedAddress = "0x8B809085D1691572550dE111578dA62082dCA21D";

// var deployedAddress = "0x99d774A66C2986107A86bc47b721AAC803a1C925";

const setDeployedAddress = (address) => {
  deployedAddress = address;
};

const IPC = new web3.providers.IpcProvider(
  "/Users/sakonthephamongkhol/Downloads/Intern/geth/concepts/test1/node1/geth.ipc",
  net
);

module.exports = { RPC, deployedAddress, IPC, setDeployedAddress };

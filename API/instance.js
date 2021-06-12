const WINcoin = require("./Functions/Contracts/Wincoin");
const Contracts = require("./Functions/Functions/Contracts");

const deployedAddress = "0x6400bE5392B82Aabd9845FBDB37C28A8703A553D";

async function loadContract(abi, address) {
  let contract = new Contracts.Contract({ abi: abi, address: address });
  return contract;
}

const loadContractMiddleware = async (req, res, next) => {
  req.instance = await loadContract(WINcoin.abi, deployedAddress);
  next();
};

module.exports = loadContractMiddleware;

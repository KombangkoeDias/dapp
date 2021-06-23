const WINcoin = require("./Functions/Contracts/Wincoin");
const WINcoinUp = require("./Functions/Contracts/WincoinUp");
const Contracts = require("./Functions/Functions/Contracts");

const { deployedAddress } = require("./configs");

async function loadContract(abi, address) {
  let contract = new Contracts.Contract({ abi: abi, address: address });
  return contract;
}

const loadContractMiddleware = async (req, res, next) => {
  req.instance = await loadContract(WINcoinUp.abi, deployedAddress);
  next();
};

module.exports = loadContractMiddleware;

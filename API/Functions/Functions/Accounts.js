const web3 = require("./Web3");

const createAccount = async () => {
  let account = await web3.eth.accounts.create();
  return account;
};

module.exports = { createAccount: createAccount };

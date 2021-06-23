const web3 = require("./Web3");

const createAccount = async (password) => {
  let account = await web3.eth.accounts.create();
  const privateKey = account.privateKey;
  const encryptedPrivateKey = web3.eth.accounts.encrypt(privateKey, password);
  account.encryptedPrivateKey = encryptedPrivateKey;
  delete account.privateKey;
  return account;
};

const decryptPrivateKey = (encryptedPrivatekey, password) => {
  const privateKey = web3.eth.accounts.decrypt(encryptedPrivatekey, password);
  return privateKey;
};

const createWallet = (account, password) => {
  const privateKey = decryptPrivateKey(account.encryptedPrivateKey, password);
  account.privateKey = privateKey.privateKey;
  delete account.encryptedPrivateKey;
  let wallet = web3.eth.accounts.wallet.add(account);
  return wallet;
};

module.exports = {
  createAccount: createAccount,
  decryptPrivateKey: decryptPrivateKey,
  createWallet: createWallet,
};

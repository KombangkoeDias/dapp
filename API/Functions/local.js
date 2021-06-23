const web3 = require("./Functions/Web3");

var transaction;

// get transaction data by transaction hash
web3.eth
  .getTransaction(
    "0x087df7dd0f39fa35105e54b97db067f0ba47f8e0c3feccf4161fa6fade140fe6"
  )
  .then((data) => {
    transaction = data;
    console.log(data);
  });

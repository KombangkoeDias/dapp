const Web3 = require("./Web3");
const EthereumTx = require("ethereumjs-tx").Transaction;
const chalk = require("chalk");
const colors = require("colors");

class Contract {
  constructor(obj) {
    if (obj.address !== undefined) {
      this.abi = obj.abi;
      this.address = obj.address;
      this.contract = new Web3.eth.Contract(obj.abi, obj.address);
    } else {
      this.abi = obj.abi;
      this.bytecode = obj.bytecode;
      this.account = obj.account;
    }
    this.decimalsValue = null;
  }

  toWei(amount) {
    return Web3.utils.toWei(amount.toString());
  }

  fromWei(amount) {
    return Web3.utils.fromWei(amount);
  }

  handleError(err) {
    //console.log(err);
    for (const key in err.data) {
      if (err.data[key].error === "revert") {
        console.log(colors.yellow("Error : " + err.data[key].reason + "\n"));
        throw "Error : " + err.data[key].reason;
      }
    }
    console.log(colors.red(err));
    throw err;
  }

  async deployContract() {
    let contract = new Web3.eth.Contract(this.abi);
    let payload = { data: this.bytecode };
    let parameter = {
      from: this.account,
      gas: Web3.utils.toHex(3000000),
      gasPrice: Web3.utils.toHex(Web3.utils.toWei("30", "gwei")),
    };
    this.contract = await contract
      .deploy(payload)
      .send(parameter, (err, transactionHash) => {
        //console.log("Transaction Hash :", transactionHash);
      });
    console.log(
      colors.green(
        "succesfully deploy contract by " +
          this.account +
          " at address " +
          this.contract.options.address
      )
    );
    this.address = this.contract.options.address;
  }

  async mint(address, amount, from) {
    try {
      console.log(
        colors.green("\nmint request from " + address + " at amount " + amount)
      );
      const res = await this.contract.methods
        .mint(address, amount)
        .send({ from: from });
      console.log(
        colors.green(
          "\nsuccesfully minted " +
            amount +
            " token to account " +
            address +
            "\n"
        )
      );
      return res.events.Transfer.transactionHash;
    } catch (err) {
      this.handleError(err);
    }
  }

  async burn(address, amount, from) {
    try {
      colors.green(
        console.log(
          colors.green(
            "\nburn request from " + address + " at amount " + amount
          )
        )
      );
      const res = await this.contract.methods
        .burn(address, amount)
        .send({ from: from });
      colors.green(
        console.log(
          colors.green(
            "successfully burned " +
              amount +
              " token from account " +
              address +
              "\n"
          )
        )
      );
      return res.events.Transfer.transactionHash;
    } catch (err) {
      this.handleError(err);
    }
  }

  async decimals() {
    try {
      if (!this.decimalsValue) {
        const decimals = await this.contract.methods.decimals().call();
        this.decimalsValue = decimals;
      }
    } catch (err) {
      this.handleError(err);
    }
  }

  async balanceOf(address) {
    try {
      const balanceOf = await this.contract.methods.balanceOf(address).call();
      return parseFloat(this.fromWei(balanceOf));
    } catch (err) {
      this.handleError(err);
    }
  }

  async approve(owner, spender, amount) {
    try {
      const res = await this.contract.methods
        .approve(spender, this.toWei(amount))
        .send({ from: owner });
      //console.log(res);
      console.log(
        colors.green(
          "\nsuccessfully grant approval to spender " +
            spender +
            " approval amount: " +
            amount +
            " token" +
            "\ngas used : " +
            res.gasUsed +
            " " +
            "\ntransaction hash : " +
            res.events.Approval.transactionHash +
            "\nspender : " +
            spender +
            " now have control over token (contract: " +
            res.to +
            ") of owner " +
            res.from +
            "\n"
        )
      );
      return res.events.Approval.transactionHash;
    } catch (err) {
      this.handleError(err);
    }
  }

  async transfer(owner, receiver, amount) {
    try {
      console.log(
        colors.green(
          "transfer requested from " +
            owner +
            " to " +
            receiver +
            " with amount " +
            amount
        )
      );
      const res = await this.contract.methods
        .transfer(receiver, this.toWei(amount))
        .send({ from: owner });
      const senderBalance = await this.balanceOf(res.from);
      const receiverBalance = await this.balanceOf(receiver);
      console.log(
        colors.green(
          "\nTransfer : successfully transferred from " +
            res.from +
            " to " +
            receiver +
            "\ngas used : " +
            res.gasUsed +
            " " +
            "\ntransaction hash : " +
            res.events.Transfer.transactionHash +
            "\nsender new balance: " +
            senderBalance +
            "\nreceiver new balance: " +
            receiverBalance +
            "\n"
        )
      );
      return res.events.Transfer.transactionHash;
    } catch (err) {
      this.handleError(err);
    }
  }

  async allowance(owner, spender) {
    let res = await this.contract.methods.allowance(owner, spender).call();
    res = parseFloat(this.fromWei(res));
    console.log(
      colors.green(
        "\nallowance from spender : " +
          spender +
          " of owner: " +
          owner +
          " is " +
          res +
          "\n"
      )
    );
    return res;
  }

  async name() {
    const name = await this.contract.methods.name().call();
    return name;
  }

  async symbol() {
    const symbol = await this.contract.methods.symbol().call();
    return symbol;
  }

  async transferFrom(from, to, amount) {
    try {
      console.log(
        colors.green(
          "transfer from requested from " +
            from +
            " to " +
            to +
            " with amount " +
            amount
        )
      );
      const res = await this.contract.methods
        .transferFrom(from, to, this.toWei(amount))
        .send({ from: to });
      const fromBalance = await this.balanceOf(from);
      const toBalance = await this.balanceOf(to);
      console.log(
        colors.green(
          "\nTransfer From : successfully transferred from " +
            res.from +
            " to " +
            to +
            "\ngas used : " +
            res.gasUsed +
            " " +
            "\ntransaction hash : " +
            res.events.Transfer.transactionHash +
            "\nnew from balance: " +
            fromBalance +
            "\nnew to balance: " +
            toBalance +
            "\n"
        )
      );
      return res.events.Transfer.transactionHash;
    } catch (err) {
      this.handleError(err);
    }
  }

  async increaseAllowance(owner, spender, amount) {
    try {
      console.log(
        colors.green(
          "\nincrease allowance requested from " +
            owner +
            " to " +
            spender +
            " for " +
            amount
        )
      );
      const res = await this.contract.methods
        .increaseAllowance(spender, this.toWei(amount))
        .send({ from: owner });
      console.log(
        colors.green(
          "successfully increase the allowance requested from " +
            owner +
            " to " +
            spender +
            " by " +
            amount
        )
      );
      return res.events.Approval.transactionHash;
    } catch (err) {
      this.handleError(err);
    }
  }

  async decreaseAllowance(owner, spender, amount) {
    try {
      console.log(
        colors.green(
          "\ndecrease allowance requested from " +
            owner +
            " to " +
            spender +
            " for " +
            amount
        )
      );
      const res = await this.contract.methods
        .decreaseAllowance(spender, this.toWei(amount))
        .send({ from: owner });
      console.log(
        colors.green(
          "successfully decrease the allowance requested from " +
            owner +
            " to " +
            spender +
            " by " +
            amount
        )
      );
      return res.events.Approval.transactionHash;
    } catch (err) {
      this.handleError(err);
    }
  }
}

module.exports = { Contract: Contract };

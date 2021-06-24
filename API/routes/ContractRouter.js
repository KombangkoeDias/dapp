const express = require("express");
const router = express.Router();
const LoadContractMiddleware = require("../instance");
const { setDeployedAddress } = require("../configs");
const WincoinUp = require("../Functions/Contracts/WincoinUp");
const Contracts = require("../Functions/Functions/Contracts");

router.get("/instance", LoadContractMiddleware, function (req, res) {
  res.json({ instance: req.instance.contract });
});

router.get("/address", LoadContractMiddleware, function (req, res) {
  res.json({ address: req.instance.contract.options.address });
});

router.get("/balanceOf", LoadContractMiddleware, async function (req, res) {
  try {
    const balanceOf = await req.instance.balanceOf(req.query.address);
    res.json({ status: "success", balanceOf: balanceOf });
  } catch (err) {
    console.log(err);
    res.json({ status: "error", err: err });
  }
});

router.get("/allowance", LoadContractMiddleware, async function (req, res) {
  try {
    const allowance = await req.instance.allowance(
      req.query.owner,
      req.query.spender
    );
    res.json({ status: "success", allowance: allowance });
  } catch (err) {
    console.log(err);
    res.json({ status: "error", err: err });
  }
});

router.get("/info", LoadContractMiddleware, async function (req, res) {
  const name = await req.instance.name();
  const symbol = await req.instance.symbol();
  res.json({ name: name, symbol: symbol });
});

router.get(
  "/estimateGas/transfer",
  LoadContractMiddleware,
  async function (req, res) {
    req.instance.estimateGas(
      req.query.owner,
      req.query.receiver,
      req.query.amount
    );
    res.send({ status: "finished" });
  }
);

router.get("/exchangeRate", LoadContractMiddleware, async function (req, res) {
  try {
    const exchangeRate = await req.instance.exchangeRate();
    res.json({ status: "success", exchangeRate: exchangeRate });
  } catch (err) {
    res.json({ status: "error", err: err });
  }
});

router.post("/mint", LoadContractMiddleware, async function (req, res) {
  try {
    const hash = await req.instance.mint(
      req.body.address,
      req.body.amount,
      req.body.from
    );
    res.json({ status: "success", amount: req.body.amount, Txhash: hash });
  } catch (err) {
    console.log(err);
    res.json({ status: "error", err: err });
  }
});

router.post("/burn", LoadContractMiddleware, async function (req, res) {
  try {
    const hash = await req.instance.burn(
      req.body.address,
      req.body.amount,
      req.body.from
    );
    res.json({ status: "success", amount: req.body.amount, Txhash: hash });
  } catch (err) {
    console.log(err);
    res.json({ status: "error", err: err });
  }
});

router.post("/approve", LoadContractMiddleware, async function (req, res) {
  try {
    const hash = await req.instance.approve(
      req.body.owner,
      req.body.spender,
      req.body.amount
    );
    res.json({
      status: "success",
      owner: req.body.owner,
      spender: req.body.spender,
      amount: req.body.amount,
      Txhash: hash,
    });
  } catch (err) {
    console.log(err);
    res.json({ status: "error", err: err });
  }
});

router.post("/transfer", LoadContractMiddleware, async function (req, res) {
  try {
    const hash = await req.instance.transfer(
      req.body.owner,
      req.body.receiver,
      req.body.amount
    );
    res.json({
      status: "success",
      owner: req.body.owner,
      receiver: req.body.receiver,
      amount: req.body.amount,
      Txhash: hash,
    });
  } catch (err) {
    console.log(err);
    res.json({ status: "error", err: err });
  }
});

router.post("/transferFrom", LoadContractMiddleware, async function (req, res) {
  try {
    const hash = await req.instance.transferFrom(
      req.body.from,
      req.body.to,
      req.body.amount
    );
    res.json({
      status: "success",
      from: req.body.from,
      to: req.body.to,
      amount: req.body.amount,
      Txhash: hash,
    });
  } catch (err) {
    console.log(err);
    res.json({ status: "error", err: err });
  }
});

router.post(
  "/increaseAllowance",
  LoadContractMiddleware,
  async function (req, res) {
    try {
      const hash = await req.instance.increaseAllowance(
        req.body.owner,
        req.body.spender,
        req.body.amount
      );
      res.json({
        status: "success",
        owner: req.body.owner,
        spender: req.body.spender,
        amount: req.body.amount,
        Txhash: hash,
      });
    } catch (err) {
      console.log(err);
      res.json({ status: "error", err: err });
    }
  }
);

router.post(
  "/decreaseAllowance",
  LoadContractMiddleware,
  async function (req, res) {
    try {
      const hash = await req.instance.decreaseAllowance(
        req.body.owner,
        req.body.spender,
        req.body.amount
      );
      res.json({
        status: "success",
        owner: req.body.owner,
        spender: req.body.spender,
        amount: req.body.amount,
        Txhash: hash,
      });
    } catch (err) {
      console.log(err);
      res.json({ status: "error", err: err });
    }
  }
);

router.post("/buy", LoadContractMiddleware, async function (req, res) {
  try {
    const hash = await req.instance.buy(req.body.ethVal, req.body.from);
    res.json({
      status: "success",
      from: req.body.from,
      ethVal: req.body.ethVal,
      Txhash: hash,
    });
  } catch (err) {
    console.log(err);
    res.json({ status: "error", err: err });
  }
});

router.post("/sell", LoadContractMiddleware, async function (req, res) {
  try {
    const hash = await req.instance.sell(req.body.amount, req.body.from);
    res.json({
      status: "success",
      from: req.body.from,
      ethVal: req.body.ethVal,
      Txhash: hash,
    });
  } catch (err) {
    console.log(err);
    res.json({ status: "error", err: err });
  }
});

router.post("/deploy", async (req, res) => {
  const deployedAddress = await createContract(
    WincoinUp.abi,
    WincoinUp.bytecode,
    req.body.account
  );
  res.json({ status: "success", address: deployedAddress });
});

async function createContract(abi, bytecode, account) {
  let contract = new Contracts.Contract({
    abi: abi,
    bytecode: bytecode,
    account: account,
  });
  await contract.deployContract();
  deployedAddress = contract.contract.options.address;
  return deployedAddress;
}

module.exports = router;

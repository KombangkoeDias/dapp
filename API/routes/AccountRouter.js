const express = require("express");
const router = express.Router();
const Accounts = require(".././Functions/Functions/Accounts");

router.post("/create", async (req, res) => {
  const account = await Accounts.createAccount(req.body.password);
  res.json({ account: account });
});

router.post("/decrypt", async (req, res) => {
  const privateKey = Accounts.decryptPrivateKey(
    req.body.encryptedPrivateKey,
    req.body.password
  );
  res.json({ privateKey: privateKey });
});

router.post("/wallet/create", async (req, res) => {
  const wallet = Accounts.createWallet(req.body.account, req.body.password);
  res.json({ wallet: wallet });
});

module.exports = router;

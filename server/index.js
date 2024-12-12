const express = require("express");
const app = express();
const cors = require("cors");
const port = 3042;

const { secp256k1 } = require("ethereum-cryptography/secp256k1.js");
app.use(cors());
app.use(express.json());

const balances = {
  "02f6c33a3daedf9bac3059f840d71314bb0be5c9b0aa68ce69705f9d570d2ea441": 100,
  "032ceada69865aa97935d6f4380e6edff63aab6cff4aade062a9216542f9ed7856": 50,
  "03acdf4bed54c8cec8e58466a5b00a0b79728e2585fafc77fa1f3ea677aec127e8": 75,
};

const wallet = [];

app.get("/balance/:address", (req, res) => {
  const { address } = req.params;
  const findWalletIdx = wallet.findIndex((w) => w.address === address);
  const balance = wallet[findWalletIdx].balance;
  res.send({ balance });
});

app.post("/send", (req, res) => {
  const { transaction, signature, hash } = req.body;
  // jsonData = JSON.parse(body);
  console.log(transaction, signature, hash);
  const recoverPublicKey = secp.recoverPublicKey;
  res.send("Success!");
});

app.post("/wallet", (req, res) => {
  const { address, balance } = req.body;
  const newWallet = {
    address: address,
    balance: balance,
  };
  wallet.push(newWallet);
  console.log("All wallet: ", wallet);
  res.send(newWallet);
});

app.listen(port, () => {
  console.log(`Listening on port ${port}!`);
});

function setInitialBalance(address) {
  if (!balances[address]) {
    balances[address] = 0;
  }
}

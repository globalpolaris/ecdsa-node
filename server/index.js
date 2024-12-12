const express = require("express");
const app = express();
const cors = require("cors");
const port = 3042;

const { secp256k1 } = require("ethereum-cryptography/secp256k1.js");
const {
  toHex,
  utf8ToBytes,
  hexToBytes,
} = require("ethereum-cryptography/utils.js");
const { keccak256 } = require("ethereum-cryptography/keccak.js");
app.use(cors());
app.use(express.json());

const balances = {
  "02f6c33a3daedf9bac3059f840d71314bb0be5c9b0aa68ce69705f9d570d2ea441": 100,
  "032ceada69865aa97935d6f4380e6edff63aab6cff4aade062a9216542f9ed7856": 50,
  "03acdf4bed54c8cec8e58466a5b00a0b79728e2585fafc77fa1f3ea677aec127e8": 75,
};

const wallet = [];

const getAddress = (publicKey) => {
  const pubKeyBytes = hexToBytes(publicKey);
  const hash = keccak256(pubKeyBytes.slice(1));
  return hash.slice(-20);
};

app.get("/balance/:address", (req, res) => {
  const { address } = req.params;
  const addr = getAddress(address);
  const findWalletIdx = wallet.findIndex((w) => w.address === toHex(addr));
  const balance = wallet[findWalletIdx].balance;
  res.send({ balance });
});

app.post("/send", (req, res) => {
  const { transaction, signature, hash, recoveryBit } = req.body;
  // jsonData = JSON.parse(body);
  // let sig = {
  //   r: BigInt(signature.r),
  //   s: BigInt(signature.s),
  //   recoveryBit: signature.recovery,
  // };
  const recalculatedHash = keccak256(utf8ToBytes(JSON.stringify(transaction)));
  if (toHex(recalculatedHash) !== hash) {
    return res.status(400).send("Invalid hash");
  }
  let sig = secp256k1.Signature.fromDER(signature);
  sig = sig.addRecoveryBit(recoveryBit);
  let hashBytes = hexToBytes(hash);
  const pubKey = toHex(sig.recoverPublicKey(hashBytes).toRawBytes());
  if (transaction.sender !== pubKey) {
    return res.status(400).send("Invalid sender public key");
  }

  console.log("Transaction is valid!");
  const senderWallet = getAddress(transaction.sender);
  const receiverWallet = getAddress(transaction.recipient);
  const findSenderWallet = wallet.findIndex(
    (w) => w.address === toHex(senderWallet)
  );
  const findReceiverWallet = wallet.findIndex(
    (w) => w.address === toHex(receiverWallet)
  );
  console.log(findSenderWallet, findReceiverWallet);
  if (findSenderWallet === -1 || findReceiverWallet === -1) {
    return res.status(400).send("Invalid wallet address");
  }
  wallet[findSenderWallet].balance -= Number(transaction.amount);
  wallet[findReceiverWallet].balance += Number(transaction.amount);
  console.log("All wallet:", wallet);
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

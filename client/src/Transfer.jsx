import { useState } from "react";
import server from "./server";
import { utf8ToBytes } from "ethereum-cryptography/utils";
import { keccak256 } from "ethereum-cryptography/keccak";
import { secp256k1 } from "ethereum-cryptography/secp256k1";

function Transfer({ address, setBalance, allWallet, getAddress }) {
  const [sendAmount, setSendAmount] = useState("");
  const [recipient, setRecipient] = useState("");

  const setValue = (setter) => (evt) => setter(evt.target.value);
  function hashTransaction(trx) {
    let trxUtf = utf8ToBytes(trx)
    return keccak256(trxUtf)
  }

  function signTranscation(trx, privateKey) {
    let hash = hashTransaction(trx)
    return secp256k1.sign(hash, privateKey, { recovered: true })
  }

  async function transfer(evt) {
    evt.preventDefault();

    try {
      console.log(recipient, sendAmount)
      const recipientAddr = getAddress(recipient)
      const transaction = {
        sender: address,
        recipient: recipientAddr,
        amount: sendAmount
      }
      const signed = signTranscation()
    } catch (ex) {
      alert(ex);
    }
  }

  return (
    <form className="container transfer" onSubmit={transfer}>
      <h1>Send Transaction</h1>

      <label>
        Amount
        <input
          placeholder="1, 2, 3..."
          value={sendAmount}
          onChange={setValue(setSendAmount)}
        ></input>
      </label>

      <label>
        Send to
        <select onChange={setValue(setRecipient)}>
          <option>Select wallet</option>
          {allWallet.map((w) => {
            return (
              <option value={w.address}>
                0x{w.publicKey.slice(0, 10)}...{w.publicKey.slice(-10)}
              </option>
            );
          })}
        </select>
      </label>

      <input type="submit" className="button" value="Transfer" />
    </form >
  );
}

export default Transfer;

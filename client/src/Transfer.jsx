import { useEffect, useState } from "react";
import server from "./server";
import { toHex, utf8ToBytes } from "ethereum-cryptography/utils";
import { keccak256 } from "ethereum-cryptography/keccak";
import { secp256k1 } from "ethereum-cryptography/secp256k1";

function Transfer({ address, setBalance, allWallet, getAddress }) {
  const [sendAmount, setSendAmount] = useState("");
  const [recipient, setRecipient] = useState("");

  const setValue = (setter) => (evt) => setter(evt.target.value);
  function hashTransaction(trx) {
    let trxUtf = utf8ToBytes(trx);
    return keccak256(trxUtf);
  }

  function signTranscation(trx, privateKey) {
    let hash = hashTransaction(trx);
    const signature = secp256k1.sign(hash, privateKey);
    return {
      r: signature.r,
      s: signature.s,
      recoveryBit: signature.recovery,
      hash: hash,
    };
  }

  async function transfer(evt) {
    evt.preventDefault();
    const privateKey = prompt("Enter your private key");
    try {
      console.log(recipient, sendAmount);
      const recipientAddr = getAddress(utf8ToBytes(recipient));
      const transaction = {
        sender: address,
        recipient: recipientAddr,
        amount: sendAmount,
      };
      const signed = signTranscation(JSON.stringify(transaction), privateKey);
      const payload = {
        transaction,
        signature: {
          r: signed.r,
          s: signed.s,
          recoveryBit: signed.recoveryBit,
        },
        hash: signed.hash,
      };
      const res = await server.post(`send`, payload);
      console.log(res);
    } catch (ex) {
      console.error(ex);
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
    </form>
  );
}

export default Transfer;

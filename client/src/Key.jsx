import { secp256k1 } from "ethereum-cryptography/secp256k1";
import { toHex } from "ethereum-cryptography/utils";
import { useEffect, useState } from "react";
import { keccak256 } from "ethereum-cryptography/keccak";
import server from "./server";

export default function Key({ allWallet, setAllWallet, getAddress }) {
  const [privateKey, setPrivateKey] = useState(0);
  const [publicKey, setPublicKey] = useState(0);
  const [wallet, setWallet] = useState(0);

  const addWallet = async (address, privkey, pubkey) => {
    try {
      const res = await server.post(`wallet`, {
        address: address,
        balance: 100,
      });
      setAllWallet((prev) => [
        ...prev,
        {
          privateKey: privkey,
          publicKey: pubkey,
          address: address,
          balance: 100,
        },
      ]);
      console.log("AllWallet: ", allWallet);
    } catch (e) {
      alert(e);
    }
  };

  const generateWallet = async (e) => {
    e.preventDefault();
    try {
      const privKey = secp256k1.utils.randomPrivateKey();
      const pubKey = secp256k1.getPublicKey(privKey);
      const address = getAddress(pubKey);
      // setWallet(address);
      // setPrivateKey(toHex(privKey));
      // setPublicKey(toHex(pubKey));
      await addWallet(toHex(address), toHex(privKey), toHex(pubKey));
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="container key">
      <h1>Key Generation</h1>
      <p>Click the button below to generate the Wallet</p>
      <button className="button" onClick={generateWallet}>
        Generate Key
      </button>
      <div className="info">
        {allWallet.length > 0
          ? allWallet.map((wallet, i) => {
              return (
                <div key={wallet.address} className="wallet-info">
                  <p className="w-detail">Wallet #{(i += 1)}</p>
                  <p className="">Address: {wallet.address}</p>
                  <p className="">Balance: {wallet.balance}</p>
                  <p className="">Private Key: {wallet.privateKey}</p>
                  <p className="">Public Key: {wallet.publicKey}</p>
                </div>
              );
            })
          : null}
        {/* Private Key: {privateKey === null ? null : "0x" + privateKey}
        <br />
        Public Key: {publicKey === null ? null : "0x" + publicKey}
        <br />
        Wallet Address: {wallet === "" ? "" : wallet} */}
      </div>
    </div>
  );
}

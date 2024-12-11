import Wallet from "./Wallet";
import Transfer from "./Transfer";
import "./App.scss";
import { useState } from "react";
import Key from "./Key";
import { keccak256 } from "ethereum-cryptography/keccak";

function App() {
  const [balance, setBalance] = useState(0);
  const [address, setAddress] = useState("");
  const [allWallet, setAllWallet] = useState([]);
  const getAddress = (publicKey) => {
    let hash = keccak256(publicKey.slice(1));
    return hash.slice(-20);
  };
  return (
    <div className="app">
      <Key
        allWallet={allWallet}
        setAllWallet={setAllWallet}
        getAddress={getAddress}
      />
      <Wallet
        balance={balance}
        setBalance={setBalance}
        address={address}
        setAddress={setAddress}
        allWallet={allWallet}
        setAllWallet={setAllWallet}
      />
      <Transfer
        setBalance={setBalance}
        address={address}
        allWallet={allWallet}
        getAddress={getAddress}
      />
    </div>
  );
}

export default App;

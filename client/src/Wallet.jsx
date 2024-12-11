import server from "./server";

function Wallet({
  address,
  setAddress,
  balance,
  setBalance,
  allWallet,
  setAllWallet,
}) {
  async function onChange(evt) {
    console.log(allWallet);
    const address = evt.target.value;
    setAddress(address);
    if (address) {
      const {
        data: { balance },
      } = await server.get(`balance/${address}`);
      setBalance(balance);
    } else {
      setBalance(0);
    }
  }

  return (
    <div className="container wallet">
      <h1>Your Wallet</h1>

      <label>
        Send from
        <select onChange={onChange}>
          <option value="">Select wallet</option>
          {allWallet.map((w) => {
            return (
              <option value={w.address}>
                0x{w.publicKey.slice(0, 10)}...{w.publicKey.slice(-10)}
              </option>
            );
          })}
        </select>
      </label>

      <div className="balance">Balance: {balance}</div>
    </div>
  );
}

export default Wallet;

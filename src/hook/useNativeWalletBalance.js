import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import BigNumber from "bignumber.js";
import { web3Reader } from "src/wallet-connection";

export const useNativeWalletBalance = (assetDecimal) => {
  const [walletBalance, setWalletBalance] = useState(0);
  const { accountAddress, nonce } = useSelector((state) => state.accountDataSlice);

  useEffect(() => {
    if (accountAddress) fetchNativeWalletBalance();
  }, [accountAddress, assetDecimal, nonce]);

  async function fetchNativeWalletBalance() {
    const rawBalance = await web3Reader.eth.getBalance(accountAddress);
    const balance = BigNumber(rawBalance).dividedBy(BigNumber("10").pow(assetDecimal)).toFixed();
    setWalletBalance(balance);
  }

  return walletBalance;
};

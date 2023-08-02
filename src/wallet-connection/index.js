import Web3 from "web3";
import { getChainId } from "./action";
import { CHAINS } from "../configs/connection-config";

let web3Reader;
let web3Sender;

async function setWeb3Reader(chainId) {
  if (!chainId) chainId = getChainId();
  const chain = CHAINS[chainId];
  const promises = chain.urls.map(async (rpc) => {
    const web3 = new Web3(rpc);
    await web3.eth.getBlockNumber();
    return rpc;
  });
  const bestRpc = await Promise.any(promises);
  web3Reader = new Web3(bestRpc);
}

function setWeb3Sender(provider) {
  if (!provider) web3Sender = null;
  else web3Sender = new Web3(provider);
}

export { web3Reader, web3Sender, setWeb3Reader, setWeb3Sender };

import { LS } from "src/configs/constance";
import { infoNotify } from "src/hook/useNotify";
import { resetAccountData, updateAccountOverviewData } from "src/redux/accountDataSlice";
import { fetchConfig, updateConfigData } from "src/redux/configSlice";
import { resetDAODataState } from "src/redux/daoDataSlice";
import { setWeb3Reader, setWeb3Sender } from ".";
import { CHAINS, CHAIN_ALIASES, CONNECTOR } from "../configs/connection-config";
import MetamaskConnector from "./connectors/metamask";
import WalletConnectConnector from "./connectors/wallet-connect";

let _metamaskConnector = null;
let _wcConnector = null;

export const getConnectedWallet = () => {
  return window.localStorage.getItem(LS.CONNECTOR);
};

export const setConnectedWallet = (wallet) => {
  if (!wallet) window.localStorage.removeItem(LS.CONNECTOR);
  else window.localStorage.setItem(LS.CONNECTOR, wallet);
};

export const getChainId = () => {
  const chainId = window.localStorage.getItem(LS.CHAIN_ID);
  return chainId ?? CHAIN_ALIASES.HARDHAT_LOCAL;
};

export const setChainId = (chainId) => {
  window.localStorage.setItem(LS.CHAIN_ID, chainId);
};

export const connectMetamask = async (dispatch, enqueueSnackbar) => {
  setConnectedWallet(CONNECTOR.METAMASK);
  if (!_metamaskConnector) _metamaskConnector = new MetamaskConnector(dispatch, enqueueSnackbar);
  const chainId = getChainId();
  await _metamaskConnector.activate(chainId);
  setWeb3Sender(_metamaskConnector?.provider);
  const accounts = await _metamaskConnector?.provider.request({ method: "eth_requestAccounts" });
  dispatch(updateConfigData({ chainId, connector: CONNECTOR.METAMASK }));
  dispatch(updateAccountOverviewData(accounts[0], enqueueSnackbar));
};

export const connectWalletConnect = async (dispatch, enqueueSnackbar) => {
  setConnectedWallet(CONNECTOR.WALLET_CONNECT);
  if (!_wcConnector)
    _wcConnector = new WalletConnectConnector(dispatch, enqueueSnackbar, {
      rpc: [11155111, 31337, 5, 1].reduce((accumulator, chainId) => {
        accumulator[Number(chainId)] = CHAINS[Number(chainId)].urls[0];
        return accumulator;
      }, {}),
    });
  const chainId = getChainId();
  await _wcConnector.activate(chainId);
  setWeb3Sender(_wcConnector?.provider);
  const accounts = await _wcConnector?.provider.request({ method: "eth_requestAccounts" });
  dispatch(updateConfigData({ chainId, connector: CONNECTOR.WALLET_CONNECT }));
  dispatch(updateAccountOverviewData(accounts[0], enqueueSnackbar));
};

export const switchNetwork = async (dispatch, enqueueSnackbar, chainId) => {
  const wallet = getConnectedWallet();
  let isSwitchSuccess = true;
  if (wallet === CONNECTOR.METAMASK) {
    if (!_metamaskConnector) _metamaskConnector = new MetamaskConnector(dispatch, enqueueSnackbar);
    isSwitchSuccess = await _metamaskConnector.activate(chainId);
    setWeb3Sender(_metamaskConnector?.provider);
  } else if (wallet === CONNECTOR.WALLET_CONNECT) {
    if (!_wcConnector) _wcConnector = new WalletConnectConnector(dispatch, enqueueSnackbar);
    isSwitchSuccess = await _wcConnector.activate(chainId);
  }
  if (isSwitchSuccess) {
    setChainId(chainId);
    await setWeb3Reader(chainId);
    dispatch(fetchConfig(enqueueSnackbar, chainId));
    dispatch(resetDAODataState());
    dispatch(resetAccountData(false));
  }
  return isSwitchSuccess;
};

export const disconnect = (dispatch, enqueueSnackbar) => {
  const wallet = getConnectedWallet();
  if (wallet === CONNECTOR.METAMASK) _metamaskConnector.deactivate();
  else if (wallet === CONNECTOR.WALLET_CONNECT) _wcConnector.deactivate();
  dispatch(resetAccountData());
  dispatch(updateConfigData({ connector: "null" }));
  setWeb3Sender(null);
  setConnectedWallet(undefined);
  infoNotify(enqueueSnackbar, "Disconnected");
};

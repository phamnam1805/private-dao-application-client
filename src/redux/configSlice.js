import { createSlice } from "@reduxjs/toolkit";
import { getCurrentContractAddresses } from "src/configs/addresses";
import { CHAIN_ALIASES } from "src/configs/connection-config";
import { QUERY_STATE, NETWORK } from "src/configs/constance";
import DAOManagerContract from "src/contract/DAOManagerContract";
import { errorNotify } from "src/hook/useNotify";
import { web3Reader } from "src/wallet-connection";
import { getChainId, getConnectedWallet } from "src/wallet-connection/action";
import Web3 from "web3";

const initialState = {
  queryingStatus: QUERY_STATE.INITIAL,
  chainId: "",
  hexChainId: undefined,
  network: undefined,
  connector: undefined,
  addresses: {},
};

async function fetchDAOsAddresses(daoManagerAddress) {
  const daoManagerContract = new DAOManagerContract(web3Reader, daoManagerAddress);
  const numDAOs = await daoManagerContract.daoCounter();
  return { DAOS: await Promise.all([...Array(numDAOs).keys()].map((index) => daoManagerContract.daos(index))) };
}

async function getAddress() {
  let addresses = getCurrentContractAddresses();
  const daosAddresses = await fetchDAOsAddresses(addresses.DAO_MANAGER);
  return { ...addresses, ...daosAddresses };
}

export const fetchConfig =
  (enqueueSnackbar, chainId = undefined) =>
  async (dispatch) => {
    try {
      dispatch(startFetchConfig());
      const _chainId = Number(chainId ?? getChainId());
      const _hexChainId = Web3.utils.numberToHex(_chainId);
      let _network = NETWORK.HARDHAT_LOCAL;

      if (_chainId == CHAIN_ALIASES.ETH_MAINNET) {
        _network = NETWORK.ETH_MAINNET;
      } else if (_chainId == CHAIN_ALIASES.GOERLI_TESTNET) {
        _network = NETWORK.GOERLI_TESTNET;
      } else if (_chainId == CHAIN_ALIASES.SEPOLIA_TESTNET) {
        _network = NETWORK.SEPOLIA_TESTNET;
      } else if (_chainId == CHAIN_ALIASES.HARDHAT_LOCAL) {
        _network = NETWORK.HARDHAT_LOCAL;
      }

      const addresses = await getAddress();
      await dispatch(
        fetchConfigSuccess({
          chainId: parseInt(_chainId),
          hexChainId: _hexChainId,
          connector: getConnectedWallet(),
          network: _network,
          addresses,
        })
      );
    } catch (error) {
      console.error(error);
      dispatch(fetchConfigFail());
      errorNotify(enqueueSnackbar, JSON.stringify(error.message));
    }
  };

const configSlice = createSlice({
  name: "configSlice",
  initialState: initialState,
  reducers: {
    updateConfigData: (state, action) => {
      const _data = action.payload;
      if (_data.chainId) state.chainId = _data.chainId;
      if (_data.connector) state.connector = _data.connector;
    },
    startFetchConfig: (state) => {
      state.queryingStatus = QUERY_STATE.FETCHING;
    },
    fetchConfigSuccess: (state, action) => {
      Object.assign(state, action.payload);
      state.queryingStatus = QUERY_STATE.SUCCESS;
    },
    fetchConfigFail: (state) => {
      state.queryingStatus = QUERY_STATE.FAIL;
    },
  },
});

export default configSlice.reducer;
export const { updateConfigData, fetchConfigSuccess, startFetchConfig, fetchConfigFail } = configSlice.actions;

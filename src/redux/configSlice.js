import { createSlice } from "@reduxjs/toolkit";
import { getCurrentContractAddresses } from "src/configs/addresses";
import { CHAIN_ALIASES } from "src/configs/connection-config";
import { QUERY_STATE, NETWORK } from "src/configs/constance";
import DAOManagerContract from "src/contract/DAOManagerContract";
import { errorNotify } from "src/hook/useNotify";
import { web3Reader } from "src/wallet-connection";
import { getChainId, getConnectedWallet } from "src/wallet-connection/action";
import Web3 from "web3";
import { parseBigIntObject, stringifyBigIntObject } from "src/services/utility";

const initialState = {
  queryingStatus: QUERY_STATE.INITIAL,
  queryingInvestmentsStatus: QUERY_STATE.INITIAL,
  chainId: "",
  hexChainId: undefined,
  network: undefined,
  connector: undefined,
  addresses: {},
  investments: {},
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

export const getInvestmentId = (chainId, commitment) => {
  return `investment-${chainId}-${String(commitment)}`;
};

export const readInvestmentData = (chainId, commitment) => {
  return parseBigIntObject(localStorage.getItem(getInvestmentId(chainId, commitment)));
};

export const saveInvestmentData = (chainId, commitment, investmentNote) => {
  localStorage.setItem(
    getInvestmentId(chainId, commitment),
    stringifyBigIntObject({ ...readInvestmentData(chainId, commitment), ...investmentNote })
  );
};

export const removeInvestmentData = (chainId, commitment) => {
  localStorage.removeItem(getInvestmentId(chainId, commitment));
};

const readInvestmentsData = (chainId) => {
  let investments = {};
  Object.keys(localStorage)
    .filter((key) => key.includes("investment") && key.includes(String(chainId)))
    .map((key) => {
      const commitment = BigInt(key.split("-")[2]);
      let note = parseBigIntObject(localStorage.getItem(key));
      note["commitment"] = commitment;
      note["name"] = note["name"] ?? "Untitled Note";
      investments[commitment] = stringifyBigIntObject(note);
      // investments[commitment] = localStorage.getItem(key);
    });
  return investments;
};

export const updateInvestmentNotes = (enqueueSnackbar, chainId) => async (dispatch) => {
  try {
    dispatch(startFetchInvestments());
    const investments = readInvestmentsData(chainId);
    dispatch(fetchInvestmentsSuccess({ investments: investments }));
  } catch (error) {
    console.error(error);
    dispatch(fetchInvestmentsFail());
    errorNotify(enqueueSnackbar, JSON.stringify(error.message));
  }
};


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
        const investments = readInvestmentsData(_chainId);
        await dispatch(fetchInvestmentsSuccess({ investments: investments }));
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
    startFetchInvestments: (state) => {
      state.queryingInvestmentsStatus = QUERY_STATE.FETCHING;
    },
    fetchInvestmentsSuccess: (state, action) => {
      state.investments = action.payload.investments;
      state.queryingInvestmentsStatus = QUERY_STATE.SUCCESS;
    },
    fetchInvestmentsFail: (state) => {
      state.queryingInvestmentsStatus = QUERY_STATE.FAIL;
    },
  },
});

export default configSlice.reducer;
export const {
  updateConfigData,
  fetchConfigSuccess,
  startFetchConfig,
  fetchConfigFail,
  startFetchInvestments,
  fetchInvestmentsSuccess,
  fetchInvestmentsFail,
} = configSlice.actions;

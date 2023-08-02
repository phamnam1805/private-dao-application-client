import { createSlice } from "@reduxjs/toolkit";
import { COMMITTEE, QUERY_STATE, NETWORK } from "src/configs/constance";
import { errorNotify } from "src/hook/useNotify";
import { getNetwork, parseBigIntObject, stringifyBigIntObject } from "src/services/utility";
import { web3Reader } from "src/wallet-connection";
import { defaultClient } from "src/services/requestClient";

const initialState = {
  fetchingAccountStatus: QUERY_STATE.INITIAL,
  nonce: 0,
  accountAddress: undefined,
  contributions: {},
};

export const updateAccountOverviewData = (accountAddress) => async (dispatch) => {
  dispatch(updateAccountAddress({ accountAddress: accountAddress }));
};

const getContributionId = (chainId, keyId, accountAddress) => {
  return `contribution-${chainId}-${keyId}-${accountAddress.toLowerCase()}`;
};

export const readContributionData = (chainId, keyId, accountAddress) => {
  return parseBigIntObject(localStorage.getItem(getContributionId(chainId, keyId, accountAddress)));
};

export const saveContributionData = (chainId, keyId, contribution, accountAddress) => {
  localStorage.setItem(
    getContributionId(chainId, keyId, accountAddress),
    stringifyBigIntObject({ ...readContributionData(chainId, keyId, accountAddress), ...contribution })
  );
};

export const removeContributionData = (chainId, keyId, accountAddress) => {
  localStorage.removeItem(getContributionId(chainId, keyId, accountAddress));
};

const readContributionsData = (chainId, accountAddress) => {
  let contributions = {};
  Object.keys(localStorage)
    .filter((key) =>
      key.includes("contribution") &&
      key.includes(String(chainId)) &&
      key.includes(accountAddress.toLowerCase())
    )
    .map((key) => {
      const keyId = Number(key.split("-")[2]);
      contributions[keyId] = localStorage.getItem(key);

      // const senderIndex = value.secret.i;
      // const checkIndex = (senderIndex - 1) < 1 ? COMMITTEE.N : senderIndex - 1;
      // const isRound1Submitted = keys[keyId].round1DataSubmissions.filter(ctb => ctb.senderAddress?.toString().toLowerCase() == accountAddress.toLowerCase()) >= 1;
      // const isRound2Submitted = keys[keyId].round2DataSubmissions[checkIndex - 1].dataSubmissions.filter(ctb => Number(ctb.senderIndex) == Number(senderIndex)) >= 1;

      // contributions[keyId]["submitted"] = {
      //   "round1": isRound1Submitted,
      //   "round2": isRound2Submitted,
      //   "tally": {}, // FIX ME
      // };
    });
  return contributions;
};

export const fetchAccountData = (accountAddress, enqueueSnackbar) =>
  async (dispatch, getState) => {
    try {
      dispatch(fetchingAccountData({}));
      const { chainId } = getState().configSlice;
      const contributions = readContributionsData(chainId, accountAddress);
      console.log("valid contributions", contributions);
      dispatch(fetchAccountDataSuccess({ contributions }));
    } catch (error) {
      dispatch(fetchAccountDataFail());
      console.error("AccountData", error);
      errorNotify(enqueueSnackbar, JSON.stringify(error.message));
    }
  };

export const resetAccountData =
  (isResetAccount = true) =>
    async (dispatch, getState) => {
      const accountAddress = getState().accountDataSlice.accountAddress;
      if (isResetAccount) dispatch(resetAccountDataState({}));
      else dispatch(resetAccountDataState({ accountAddress }));
    };

const accountDataSlice = createSlice({
  name: "accountDataSlice",
  initialState: initialState,
  reducers: {
    updateAccountDataNonce: (state) => {
      state.nonce = state.nonce + 1;
    },
    updateAccountAddress: (state, action) => {
      state.accountAddress = action.payload.accountAddress;
      state.fetchingAccountStatus = QUERY_STATE.INITIAL;
    },
    fetchingAccountData: (state, action) => {
      state.fetchingAccountStatus = QUERY_STATE.FETCHING;
    },
    fetchAccountDataSuccess: (state, action) => {
      state.contributions = action.payload.contributions;
      state.fetchingAccountStatus = QUERY_STATE.SUCCESS;
    },
    fetchAccountDataFail: (state, action) => {
      state.fetchingAccountStatus = QUERY_STATE.FAIL;
    },
    resetAccountDataState: (state, action) => {
      Object.assign(state, initialState);
      if (action.payload.accountAddress) state.accountAddress = action.payload.accountAddress;
    },
  },
});

export default accountDataSlice.reducer;
export const {
  updateAccountDataNonce,
  updateAccountAddress,
  fetchingAccountData,
  fetchAccountDataSuccess,
  fetchAccountDataFail,
  resetAccountDataState,
} = accountDataSlice.actions;

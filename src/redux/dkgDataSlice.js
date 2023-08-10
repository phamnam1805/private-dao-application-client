import { createSlice } from "@reduxjs/toolkit";
import { QUERY_STATE } from "src/configs/constance";
import { CHAIN_ALIASES } from "src/configs/connection-config";
import { errorNotify } from "src/hook/useNotify";
import { defaultClient } from "src/services/requestClient";

const initialState = {
  fetchingKeysStatus: QUERY_STATE.INITIAL,
  fetchingParticularKeyStatus: QUERY_STATE.INITIAL,
  keys: {},
  requests: {},
};

export const fetchKeysData = (enqueueSnackbar) => async (dispatch, getState) => {
  try {
    dispatch(fetchingKeysData());
    const chainId = getState().configSlice.chainId;
    const backendChainId = (await defaultClient.get("/")).data.chainID;
    if (Number(chainId) !== Number(backendChainId))
      throw Error(`Change to ${CHAIN_ALIASES[Number(backendChainId)]?.name || "unknown"} network!`);

    let [resKey, resRequest] = await Promise.all([
      defaultClient.post("/committee/distributed-keys"),
      defaultClient.post("/committee/distributed-key-requests")
    ]);

    const requestList = resRequest["data"];
    const requests = requestList.reduce((reqs, req) => {
      reqs[req.requestID] = {
        requestID: req.requestID,
        state: Number(req.state),
        requester: req.requester,
        keyID: Number(req.distributedKeyID),
        R: req.r,
        M: req.m,
        tallyCounter: Number(req.tallyCounter),
        resultSubmitted: req.resultSubmitted,
        tallyDataSubmissions: req.tallyDataSubmissions,
        resultVector: req.resultVector,
      };
      return reqs;
    }, {});

    const keyList = resKey["data"];
    const keys = keyList.map((key) => ({
      keyID: Number(key.distributedKeyID),
      dimension: Number(key.dimension),
      type: Number(key.distributedKeyType),
      state: Number(key.distributedKeyState),
      verifier: key.verifier,
      publicKey: [key.publicKeyX, key.publicKeyY],
      round1DataSubmissions: key.round1DataSubmissions,
      round2DataSubmissions: key.round2DataSubmissions,
    }));

    dispatch(fetchKeysDataSuccess({ keys: keys, requests: requests }));
  } catch (error) {
    dispatch(fetchKeysDataFail());
    console.error("Keys data: ", error);
    errorNotify(enqueueSnackbar, JSON.stringify(error.message));
  }
};

export const fetchParticularKeyData = (keyID, enqueueSnackbar) => async (dispatch, getState) => {

};

const dkgDataSlice = createSlice({
  name: "dkgDataSlice",
  initialState: initialState,
  reducers: {
    fetchingKeysData: (state) => {
      state.fetchingKeysStatus = QUERY_STATE.FETCHING;
    },
    fetchKeysDataSuccess: (state, action) => {
      state.keys = action.payload.keys;
      state.requests = action.payload.requests;
      state.fetchingKeysStatus = QUERY_STATE.SUCCESS;
      // state.fetchingParticularKeyStatus = QUERY_STATE.SUCCESS;
    },
    fetchKeysDataFail: (state) => {
      state.fetchingKeysStatus = QUERY_STATE.FAIL;
    },
    fetchingParticularKeyData: (state) => {
      state.fetchingParticularKeyStatus = QUERY_STATE.FETCHING;
    },
    fetchParticularKeyDataSuccess: (state) => {
      state.fetchingParticularKeyStatus = QUERY_STATE.SUCCESS;
    },
    fetchParticularKeyDataFail: (state) => {
      state.fetchingParticularKeyStatus = QUERY_STATE.FAIL;
    },
    resetKeyDataState: (state) => {
      Object.assign(state, initialState);
    },
  },
});

export default dkgDataSlice.reducer;
export const {
  fetchingKeysData,
  fetchKeysDataSuccess,
  fetchKeysDataFail,
  fetchingParticularKeyData,
  fetchParticularKeyDataSuccess,
  fetchParticularKeyDataFail,
  resetKeyDataState,
} = dkgDataSlice.actions;

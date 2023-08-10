import { createSlice, current } from "@reduxjs/toolkit";
import { QUERY_STATE } from "src/configs/constance";
import { CHAIN_ALIASES } from "src/configs/connection-config";
import { errorNotify } from "src/hook/useNotify";
import { defaultClient } from "src/services/requestClient";

const initialState = {
  fetchingFundingRoundsStatus: QUERY_STATE.INITIAL,
  funding: undefined,
};

export const fetchFundingRoundsData = (enqueueSnackbar) => async (dispatch, getState) => {
  try {
    dispatch(fetchingFundingRoundsData());
    const chainId = getState().configSlice.chainId;
    const backendChainId = (await defaultClient.get("/")).data.chainID;
    if (Number(chainId) !== Number(backendChainId))
      throw Error(`Change to ${CHAIN_ALIASES[Number(backendChainId)]?.name || "unknown"} network!`);
    let res = await defaultClient.post("/investment/funding-rounds");
    const fundingData = res["data"];
    const currentRound = Object.keys(fundingData.currentFundingRound) == 0 ? null : {
      fundingRoundId: Number(fundingData.currentFundingRound.fundingRoundID),
      state: Number(fundingData.currentFundingRound.state),
      requestState: Number(fundingData.currentFundingRound.requestState),
      listDAO: fundingData.currentFundingRound.listDAO.map(e => e.toLowerCase()),
      result: fundingData.currentFundingRound.result.map(e => Number(e)),
      totalFunded: Number(fundingData.currentFundingRound.totalFunded),
      launchedAt: Number(fundingData.currentFundingRound.launchedAt),
      finalizedAt: Number(fundingData.currentFundingRound.finalizedAt),
      failedAt: Number(fundingData.currentFundingRound.failedAt),
      keyId: Number(fundingData.currentFundingRound.keyID),
      requestId: fundingData.currentFundingRound.requestID,
    };
    const oldRounds = fundingData.oldFundingRounds.length == 0 ? null : fundingData.oldFundingRounds.map(round => ({
      fundingRoundId: Number(round.fundingRoundID),
      state: Number(round.state),
      requestState: Number(round.requestState),
      listDAO: round.listDAO.map(e => e.toLowerCase()),
      result: round.result.map(e => Number(e)),
      totalFunded: Number(round.totalFunded),
      launchedAt: Number(round.launchedAt),
      finalizedAt: Number(round.finalizedAt),
      failedAt: Number(round.failedAt),
      keyId: Number(round.keyID),
      requestID: round.requestID,
    }));
    const config = {
      pendingPeriod: Number(fundingData.fundingRoundConfig.pendingPeriod),
      activePeriod: Number(fundingData.fundingRoundConfig.activePeriod),
      tallyPeriod: Number(fundingData.fundingRoundConfig.tallyPeriod),
    };
    const queue = fundingData.fundingRoundQueue.map(e => e.toLowerCase());
    dispatch(fetchFundingRoundsDataSuccess({
      funding: {
        currentRound: currentRound,
        oldRounds: oldRounds,
        config: config,
        queue: queue
      }
    }));
  } catch (error) {
    dispatch(fetchFundingRoundsDataFail());
    console.error("FundingRounds data: ", error);
    errorNotify(enqueueSnackbar, JSON.stringify(error.message));
  }
};

const fundingDataSlice = createSlice({
  name: "fundingDataSlice",
  initialState: initialState,
  reducers: {
    fetchingFundingRoundsData: (state) => {
      state.fetchingFundingRoundsStatus = QUERY_STATE.FETCHING;
    },
    fetchFundingRoundsDataSuccess: (state, action) => {
      Object.assign(state, action.payload);
      state.fetchingFundingRoundsStatus = QUERY_STATE.SUCCESS;
    },
    fetchFundingRoundsDataFail: (state) => {
      state.fetchingFundingRoundsStatus = QUERY_STATE.FAIL;
    },
    resetKeyDataState: (state) => {
      Object.assign(state, initialState);
    },
  },
});

export default fundingDataSlice.reducer;
export const {
  fetchingFundingRoundsData,
  fetchFundingRoundsDataSuccess,
  fetchFundingRoundsDataFail,
  fetchingParticularKeyData,
  fetchParticularKeyDataSuccess,
  fetchParticularKeyDataFail,
  resetKeyDataState,
} = fundingDataSlice.actions;

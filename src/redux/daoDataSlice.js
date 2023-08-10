import { createSlice } from "@reduxjs/toolkit";
import { QUERY_STATE, NETWORK } from "src/configs/constance";
import { CHAIN_ALIASES } from "src/configs/connection-config";
import { errorNotify } from "src/hook/useNotify";
import { defaultClient, ipfsQueryClient } from "src/services/requestClient";
import { getNetwork, random } from "src/services/utility";
import { web3Reader } from "src/wallet-connection";

const initialState = {
  fetchingDAOsStatus: QUERY_STATE.INITIAL,
  fetchingParticularDAOStatus: QUERY_STATE.INITIAL,
  fetchingApiDAOStatus: QUERY_STATE.INITIAL,
  daos: {},
};

export const fetchDAOData = (enqueueSnackbar) => async (dispatch, getState) => {
  try {
    dispatch(fetchingDAOData());
    const chainId = getState().configSlice.chainId;
    const backendChainId = (await defaultClient.get("/")).data.chainID;
    if (Number(chainId) !== Number(backendChainId))
      throw Error(`Change to ${CHAIN_ALIASES[Number(backendChainId)].name || "unknown"} network!`);
    const res = await defaultClient.post("/dao/all");
    const daoData = res["data"];
    const ipfsData = await Promise.all(daoData.map((dao) => ipfsQueryClient.get(`/${dao.ipfsHash || ""}`)));
    const daos = daoData.map((dao, index) => {
      return {
        name: ipfsData[index].name,
        address: dao.daoAddress,
        logoUrl: ipfsData[index].logoUrl,
        description: ipfsData[index].description,
        website: ipfsData[index].website,
        tags: String(ipfsData[index].tags || "None").split(","),
        totalFunded: Number(dao.totalFunded),
      };
    });
    dispatch(fetchDAODataSuccess({ daos: daos }));
  } catch (error) {
    dispatch(fetchDAODataFail());
    console.error("DAOs data: ", error);
    errorNotify(enqueueSnackbar, JSON.stringify(error.message));
  }
};

export const fetchParticularDAOData = (daoAddress, enqueueSnackbar) => async (dispatch, getState) => {
  const daos = getState().daoDataSlice.daos;
  const daoExisted = Object.values(daos).filter(dao => dao.address.toLowerCase() == daoAddress.toLowerCase()).length > 0;
  if (daoExisted) {
    try {
      dispatch(fetchingParticularDAOData());
      const res = await defaultClient.post(`/dao/${daoAddress}/proposals`);
      const proposalOverviewData = res["data"];
      const proposalDetails = await Promise.all(proposalOverviewData.map(p => defaultClient.post(`/dao/${daoAddress}/proposals/${p.proposalID}`)));
      // const [ipfsData, proposalDetails] = await Promise.all([
      //   Promise.all(proposalOverviewData.map(p => ipfsQueryClient.get(`/${p.ipfsHash}`))),
      //   Promise.all(proposalOverviewData.map(p => defaultClient.post(`/dao/${daoAddress}/proposals/${p.proposalID}`)))
      // ]);
      const proposals = proposalOverviewData.reduce((map, obj, idx) => {
        map[obj.proposalID] = {
          proposalID: obj.proposalID,
          state: Number(obj.state),
          ipfsHash: obj.ipfsHash,
          descriptionHash: obj.descriptionHash,
          title: "Test Proposal",
          // title: ipfsData[idx].title ?? "Test Proposal",
          // description: ipfsData[idx].description ?? "Unknown",
          requestID: proposalDetails[idx].data.requestID,
          requestState: Number(proposalDetails[idx].data.requestState),
          distributedKey: proposalDetails[idx].data.distributedKey,
          canceled: proposalDetails[idx].data.canceled,
          executed: proposalDetails[idx].data.executed,
          forVotes: proposalDetails[idx].data.forVotes,
          againstVotes: proposalDetails[idx].data.againstVotes,
          abstainVotes: proposalDetails[idx].data.abstainVotes,
          startBlock: proposalDetails[idx].data.startBlock,
          config: {
            pendingPeriod: Number(proposalDetails[idx].data.daoConfig.pendingPeriod),
            votingPeriod: Number(proposalDetails[idx].data.daoConfig.votingPeriod),
            tallyingPeriod: Number(proposalDetails[idx].data.daoConfig.tallyingPeriod),
            timelockPeriod: Number(proposalDetails[idx].data.daoConfig.timelockPeriod),
            queuingPeriod: Number(proposalDetails[idx].data.daoConfig.queuingPeriod),
          },
        };
        return map;
      }, {});
      const updatedDaos = daos.map(dao => (dao.address.toLowerCase() !== daoAddress.toLowerCase() ? dao : {
        ...dao,
        ...{ proposals: proposals }
      }));
      dispatch(fetchParticularDAODataSuccess({ daos: updatedDaos }));
    } catch (error) {
      dispatch(fetchParticularDAODataFail());
      console.error("DAOs data: ", error);
      errorNotify(enqueueSnackbar, JSON.stringify(error.message));
    }
  }

};

const daoDataSlice = createSlice({
  name: "daoDataSlice",
  initialState: initialState,
  reducers: {
    fetchingDAOData: (state) => {
      state.fetchingDAOsStatus = QUERY_STATE.FETCHING;
    },
    fetchDAODataSuccess: (state, action) => {
      state.daos = action.payload.daos;
      state.fetchingDAOsStatus = QUERY_STATE.SUCCESS;
      // state.fetchingParticularDAOStatus = QUERY_STATE.SUCCESS;
    },
    fetchDAODataFail: (state) => {
      state.fetchingDAOsStatus = QUERY_STATE.FAIL;
    },
    fetchingParticularDAOData: (state) => {
      state.fetchingParticularDAOStatus = QUERY_STATE.FETCHING;
    },
    fetchParticularDAODataSuccess: (state, action) => {
      state.daos = action.payload.daos;
      state.fetchingParticularDAOStatus = QUERY_STATE.SUCCESS;
    },
    fetchParticularDAODataFail: (state) => {
      state.fetchingParticularDAOStatus = QUERY_STATE.FAIL;
    },
    resetDAODataState: (state) => {
      Object.assign(state, initialState);
    },
  },
});

export default daoDataSlice.reducer;
export const {
  fetchingDAOData,
  fetchDAODataSuccess,
  fetchDAODataFail,
  fetchingParticularDAOData,
  fetchParticularDAODataSuccess,
  fetchParticularDAODataFail,
  resetDAODataState,
} = daoDataSlice.actions;

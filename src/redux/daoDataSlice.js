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

// const mockDAOData = [
//   {
//     address: "0xD5745a490f14CdA24bed11156d91Eb7A77c8CB1B",
//     status: "0",
//     ipfs: {
//       name: "The PAO",
//       logoUrl:
//         "https://lh3.googleusercontent.com/u/0/drive-viewer/AITFw-ww9lkjcQGAe9pBTgpxtKx0Af2mZsVDNDGM_PsAoBZHQifZ34fDGptTqex3-gPGxBCPXq11ZOp8rwK-Ncb1eD5CJhr3JQ=w3024-h1666",
//       description:
//         "The protocol addresses the privacy issue for investors, encompassing both the privacy of the amount of money they have invested and the privacy of voting on project operations through proposals.",
//       website: "https://thepao.fund",
//       tags: "Investment,Financial",
//     },
//   },
//   {
//     address: "0xD5745a490f14CdA24bed11156d91Eb7A77c8CB1B",
//     status: "1",
//     ipfs: {
//       name: "Gitcoin",
//       logoUrl: "https://user-images.githubusercontent.com/23297747/40148910-112c56d4-5936-11e8-95df-aa9796b33bf3.png",
//       description:
//         "Gitcoin's mission is to grow and sustain open source development. Gitcoin believes that open source software developers create billions of dollars in value, but don't get to capture that value.",
//       website: "https://gitcoin.co",
//       tags: "Investment,Public Goods",
//     },
//   },
//   {
//     address: "0xD5745a490f14CdA24bed11156d91Eb7A77c8CB1B",
//     status: "2",
//     ipfs: {
//       name: "Openzeppelin",
//       logoUrl: "https://avatars.githubusercontent.com/u/20820676?s=280&v=4",
//       description:
//         "OpenZeppelin provides security products to build, automate, and operate decentralized applications. We also protect leading organizations by performing security audits on their systems and products.",
//       website: "https://www.openzeppelin.com",
//       tags: "Programming,Security",
//     },
//   },
// ];

export const fetchDAOData = (enqueueSnackbar) => async (dispatch, getState) => {
  try {
    dispatch(fetchingDAOData());
    const chainId = getState().configSlice.chainId;
    const backendChainId = (await defaultClient.get("/")).data.chainID;
    if (Number(chainId) !== Number(backendChainId))
      throw Error(`Change to ${CHAIN_ALIASES[Number(backendChainId)].name || "unknown"} network!`);
    let res = await defaultClient.post("/dao/all");
    const daoList = res["data"];
    const ipfsData = await Promise.all(daoList.map((dao) => ipfsQueryClient.get(`/${dao.ipfsHash || ""}`)));
    daoList.map((dao, index) => {
      Object.assign(dao, { ipfs: ipfsData[index] });
      Object.assign(dao, { status: String(random(0, 2)) }); // FIXME
    });

    dispatch(fetchDAODataSuccess({ daos: daoList }));
  } catch (error) {
    dispatch(fetchDAODataFail());
    console.error("DAOs data: ", error);
    errorNotify(enqueueSnackbar, JSON.stringify(error.message));
  }
};

export const fetchParticularDAOData = (daoAddress, enqueueSnackbar) => async (dispatch, getState) => {
  const daos = getState().daoDataSlice.daos;

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
      state.fetchingParticularDAOStatus = QUERY_STATE.SUCCESS;
    },
    fetchDAODataFail: (state) => {
      state.fetchingDAOsStatus = QUERY_STATE.FAIL;
    },
    fetchingParticularDAOData: (state) => {
      state.fetchingParticularDAOStatus = QUERY_STATE.FETCHING;
    },
    fetchParticularDAODataSuccess: (state, action) => {
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

import { createSlice } from "@reduxjs/toolkit";

export const StepStatus = {
  LOADING: "loading",
  ERROR: "error",
  INIT: "init",
  FINISH: "finish",
};

export const DEFAULT_VALUE = {
  PENDING_PERIOD: 10,
  VOTING_PERIOD: 100,
  TALLYING_PERIOD: 40,
  TIMELOCK_PERIOD: 10,
  QUEUING_PERIOD: 50,
};

const initialState = {
  newDAOAddress: undefined,
  activeStep: 0,
  activeStatus: StepStatus.INIT,
  selectedStep: 0,
  targetProviderId: undefined,
  ipfsHash: undefined,
  descriptionHash: undefined,
};

const createDAODataSlice = createSlice({
  name: "createDAODataSlice",
  initialState: initialState,
  reducers: {
    updateCreateDAOData: (state, action) => {
      const data = action.payload;
      Object.assign(state, data);
    },
    resetCreateDAOData: (state) => {
      Object.assign(state, initialState);
    },
  },
});

export default createDAODataSlice.reducer;
export const { updateCreateDAOData, resetCreateDAOData } = createDAODataSlice.actions;

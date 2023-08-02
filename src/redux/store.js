import { configureStore } from "@reduxjs/toolkit";
import accountDataReducer from "./accountDataSlice";
import createDAODataReducer from "./createDAODataSlice";
import daoDataReducer from "./daoDataSlice";
import dkgDataReducer from "./dkgDataSlice";
import configReducer from "./configSlice";
import userConfigReducer from "./userConfigSlice";

export default configureStore({
  reducer: {
    userConfigSlice: userConfigReducer,
    createDAODataSlice: createDAODataReducer,
    configSlice: configReducer,
    daoDataSlice: daoDataReducer,
    accountDataSlice: accountDataReducer,
    dkgDataSlice: dkgDataReducer,
  },
});

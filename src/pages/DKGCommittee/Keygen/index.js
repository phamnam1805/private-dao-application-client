import { Box, Button, Grid, makeStyles } from "@material-ui/core";
import { useSnackbar } from "notistack";
import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { QUERY_STATE, THEME_MODE } from "src/configs/constance";
import { fetchKeysData } from "src/redux/dkgDataSlice";
import { fetchAccountData } from "src/redux/accountDataSlice";
import MainLayoutWrapper from "src/components/Wrappers/MainLayoutWrapper";
import ErrorIconBox from "src/components/Icon/ErrorIconBox";
import { LoadingIconBox } from "src/components/Icon/LoadingIcon";
import KeyTable from "./KeyTable";
import { parseBigIntObject, stringifyBigIntObject } from "src/services/utility";

function KeyListLayout() {
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();
  const { accountAddress } = useSelector((state) => state.accountDataSlice);
  const { fetchingKeysStatus, keys } = useSelector((state) => state.dkgDataSlice);
  const { fetchingAccountStatus, contributions } = useSelector((state => state.accountDataSlice));
  useEffect(() => {
    if (fetchingKeysStatus === QUERY_STATE.INITIAL) dispatch(fetchKeysData(enqueueSnackbar));
  }, [fetchingKeysStatus]);

  useEffect(() => {
    if (fetchingAccountStatus === QUERY_STATE.INITIAL && accountAddress) dispatch(fetchAccountData(accountAddress, enqueueSnackbar));
  }, [accountAddress, fetchingAccountStatus]);

  const keyListData = useMemo(() => {
    if (fetchingKeysStatus === QUERY_STATE.SUCCESS && fetchingAccountStatus === QUERY_STATE.SUCCESS) {
      const keyList = keys.map(key => ({
        ...key,
        ...{ contributions: contributions[key.keyID] }
      }));
      return keyList;
    }
    else return [];
  }, [fetchingKeysStatus, fetchingAccountStatus, keys, contributions]);

  return (
    <>
      {(fetchingKeysStatus === QUERY_STATE.FETCHING || fetchingAccountStatus === QUERY_STATE.FETCHING) && <LoadingIconBox />}
      {(fetchingKeysStatus === QUERY_STATE.FAIL || fetchingAccountStatus === QUERY_STATE.FAIL) && <ErrorIconBox des="Something wrong!" />}
      {(fetchingKeysStatus === QUERY_STATE.SUCCESS && fetchingAccountStatus === QUERY_STATE.SUCCESS) && (
        <>
          <Box sx={{ display: "flex", flexDirection: "row-reverse" }}>
            <Button style={{ marginBottom: "1rem" }} variant="contained" color="primary">
              Generate New Key
            </Button>
          </Box>
          <Box>
            <KeyTable keyListData={keyListData} />
          </Box>
        </>
      )}
    </>
  );
}

export default function Keygen() {


  return (
    <MainLayoutWrapper
      overview={{
        title: "Key Generation",
        des: "Asymmetric key pairs can be generated distributedly for specific purposes from the contributions of committee members",
      }}
    >
      <KeyListLayout />
    </MainLayoutWrapper>
  );
}

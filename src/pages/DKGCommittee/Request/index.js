import { Box } from "@material-ui/core";
import { useSnackbar } from "notistack";
import { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { QUERY_STATE } from "src/configs/constance";
import { fetchKeysData } from "src/redux/dkgDataSlice";
import { fetchAccountData } from "src/redux/accountDataSlice";
import MainLayoutWrapper from "src/components/Wrappers/MainLayoutWrapper";
import ErrorIconBox from "src/components/Icon/ErrorIconBox";
import { LoadingIconBox } from "src/components/Icon/LoadingIcon";
import RequestTable from "./RequestTable";

function RequestListLayout() {
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();
  const { accountAddress } = useSelector((state) => state.accountDataSlice);
  const { fetchingKeysStatus, keys, requests } = useSelector((state) => state.dkgDataSlice);
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

  const requestListData = useMemo(() => {
    if (fetchingKeysStatus === QUERY_STATE.SUCCESS && fetchingAccountStatus === QUERY_STATE.SUCCESS) {
      const requestList = Object.entries(requests).map(([key, value]) => value);
      return requestList;
    }
    else return [];
  }, [fetchingKeysStatus, fetchingAccountStatus, requests, contributions]);

  return (
    <>
      {(fetchingKeysStatus === QUERY_STATE.FETCHING || fetchingAccountStatus === QUERY_STATE.FETCHING) && <LoadingIconBox />}
      {(fetchingKeysStatus === QUERY_STATE.FAIL || fetchingAccountStatus === QUERY_STATE.FAIL) && <ErrorIconBox des="Something wrong!" />}
      {(fetchingKeysStatus === QUERY_STATE.SUCCESS && fetchingAccountStatus === QUERY_STATE.SUCCESS) && (
        <>
          <Box sx={{ minHeight: "3.3rem" }}>
          </Box>
          <Box>
            <RequestTable keyListData={keyListData} requestListData={requestListData} />
          </Box>
        </>
      )}
    </>
  );
}

export default function Request() {
  return (
    <MainLayoutWrapper
      overview={{
        title: "Key Requests",
        des: "Generated distributed keys can be used for Threshold Homomorphic Encryption through key usage requests",
      }}
    >
      <RequestListLayout />
    </MainLayoutWrapper>
  );
}

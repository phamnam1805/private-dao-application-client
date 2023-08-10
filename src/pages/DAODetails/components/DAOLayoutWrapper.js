import { useSnackbar } from "notistack";
import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import useLowerAddressParam from "src/hook/useLowerAddressParam";
import { fetchDAOData, fetchParticularDAOData } from "src/redux/daoDataSlice";
import { updateInvestmentNotes } from "src/redux/configSlice";
import { QUERY_STATE } from "src/configs/constance";
import MainLayoutWrapper from "src/components/Wrappers/MainLayoutWrapper";
import ErrorIconBox from "src/components/Icon/ErrorIconBox";
import { LoadingIconBox } from "src/components/Icon/LoadingIcon";

function DAOLayout({ children }) {
  const { daoAddress } = useLowerAddressParam();
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();
  const { fetchingDAOsStatus, fetchingParticularDAOStatus, daos } = useSelector((state) => state.daoDataSlice);
  const { chainId, queryingInvestmentsStatus, investments } = useSelector((state) => state.configSlice);

  useEffect(() => {
    if (fetchingDAOsStatus === QUERY_STATE.INITIAL) dispatch(fetchDAOData(enqueueSnackbar));
  }, [fetchingDAOsStatus, daos]);

  useEffect(() => {
    if (fetchingParticularDAOStatus === QUERY_STATE.INITIAL) dispatch(fetchParticularDAOData(daoAddress, enqueueSnackbar));
  }, [fetchingParticularDAOStatus, daos]);

  useEffect(() => {
    if (queryingInvestmentsStatus === QUERY_STATE.INITIAL) dispatch(updateInvestmentNotes(enqueueSnackbar, chainId));
  }, [queryingInvestmentsStatus, investments]);

  return (
    <>
      {(
        fetchingDAOsStatus === QUERY_STATE.FETCHING ||
        fetchingParticularDAOStatus === QUERY_STATE.FETCHING ||
        queryingInvestmentsStatus === QUERY_STATE.FETCHING
      ) && <LoadingIconBox />}
      {(
        fetchingDAOsStatus === QUERY_STATE.FAIL ||
        fetchingParticularDAOStatus === QUERY_STATE.FAIL ||
        queryingInvestmentsStatus === QUERY_STATE.FAIL
      ) && <ErrorIconBox des="Something wrong!" />}
      {(
        fetchingDAOsStatus === QUERY_STATE.SUCCESS &&
        fetchingParticularDAOStatus === QUERY_STATE.SUCCESS &&
        queryingInvestmentsStatus === QUERY_STATE.SUCCESS
      ) && (children)}
    </>
  );
}

export default function DAOLayoutWrapper({ children, ...props }) {
  return (
    <MainLayoutWrapper
      overview={{
        title: "DAO Information",
        des: "Public information about this DAO and Improvement Proposals from the governance process.",
        back: "/daos",
      }}
    >
      <DAOLayout {...props}>{children}</DAOLayout>
    </MainLayoutWrapper>
  );
}

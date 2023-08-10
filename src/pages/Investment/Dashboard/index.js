import { Avatar, Box, Button, Divider, Grid, Paper, Typography, makeStyles, useMediaQuery } from "@material-ui/core";
import { useSnackbar } from "notistack";
import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import useQuery from "src/hook/useUrlQuery";
import { QUERY_STATE, THEME_MODE } from "src/configs/constance";
import { fetchAccountData } from "src/redux/accountDataSlice";
import { fetchDAOData } from "src/redux/daoDataSlice";
import { fetchFundingRoundsData } from "src/redux/fundingDataSlice";
import MainLayoutWrapper from "src/components/Wrappers/MainLayoutWrapper";
import ErrorIconBox from "src/components/Icon/ErrorIconBox";
import { LoadingIconBox } from "src/components/Icon/LoadingIcon";
import LatestCampaign from "../Campaigns/LatestCampaign";
import CampaignList from "../Campaigns/CampaignList";
import FundingQueue from "../Campaigns/FundingQueue";
import Empty from "src/components/Icon/Empty";

const useStyle = makeStyles((theme) => ({}));

export function InvestmentDashboardLayout() {
  const query = useQuery();
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();
  const { accountAddress } = useSelector((state) => state.accountDataSlice);
  const { fetchingDAOsStatus, daos } = useSelector((state) => state.daoDataSlice);
  const { fetchingFundingRoundsStatus, funding } = useSelector((state) => state.fundingDataSlice);
  const { fetchingAccountStatus } = useSelector((state => state.accountDataSlice));

  useEffect(() => {
    if (fetchingAccountStatus === QUERY_STATE.INITIAL && accountAddress) dispatch(fetchAccountData(accountAddress, enqueueSnackbar));
  }, [accountAddress, fetchingAccountStatus]);

  useEffect(() => {
    if (fetchingDAOsStatus === QUERY_STATE.INITIAL) dispatch(fetchDAOData(enqueueSnackbar));
  }, [fetchingDAOsStatus]);

  useEffect(() => {
    if (fetchingFundingRoundsStatus === QUERY_STATE.INITIAL) dispatch(fetchFundingRoundsData(enqueueSnackbar));
  }, [fetchingFundingRoundsStatus]);

  const daoListData = useMemo(() => {
    if (fetchingAccountStatus === QUERY_STATE.SUCCESS && fetchingDAOsStatus === QUERY_STATE.SUCCESS && fetchingFundingRoundsStatus === QUERY_STATE.SUCCESS && funding) {
      return {
        active: Object.values(daos).map((dao) => {
          if (funding.currentRound === null) return null;
          if (!funding.currentRound.listDAO.includes(dao.address.toLowerCase())) return null;
          else return dao;
        }).filter(e => e !== null),
        queued: Object.values(daos).map((dao) => {
          if (funding.queue.length > 0 && funding.queue.includes(dao.address.toLowerCase())) return dao;
          else return null;
        }).filter(e => e !== null),
      };
    } else return [];
  }, [fetchingAccountStatus, fetchingDAOsStatus, fetchingAccountStatus, daos, funding]);

  return (
    <>
      {(fetchingFundingRoundsStatus === QUERY_STATE.FETCHING || fetchingDAOsStatus === QUERY_STATE.FETCHING || fetchingAccountStatus === QUERY_STATE.FETCHING) && <LoadingIconBox />}
      {(fetchingFundingRoundsStatus === QUERY_STATE.FAIL || fetchingDAOsStatus === QUERY_STATE.FAIL || fetchingAccountStatus === QUERY_STATE.FAIL) && <ErrorIconBox des="Something wrong!" />}
      {(fetchingFundingRoundsStatus === QUERY_STATE.SUCCESS && fetchingDAOsStatus === QUERY_STATE.SUCCESS && fetchingAccountStatus === QUERY_STATE.SUCCESS) && (
        <>
          <Box mb={2}>
            {
              daoListData.active.length == 0 ?
                (<FundingQueue daos={daoListData.queued} />) :
                <LatestCampaign
                  daos={daoListData.active}
                  fundingRound={{
                    ...funding.currentRound,
                    ...{ config: funding.config }
                  }}
                  selectedIndex={funding.currentRound.listDAO.findIndex(e => e == query.get("addr")) ?? 0}
                />
            }

          </Box>
          <Box mt={5} mb={2}>
            <Typography variant="h2">Previous Funding Rounds</Typography>
          </Box>
          <Box mb={2}>
            {funding.oldRounds ? <CampaignList campaigns={funding.oldRounds} /> : (
              <Box py={2} display="flex" justifyContent="center">
                <Empty title="No Data" iconProps={{ style: { fontSize: "60px" } }} />
              </Box>
            )}

          </Box>
        </>
      )}
    </>
  );
}

export default function Dashboard() {


  return (
    <MainLayoutWrapper
      overview={{
        title: "Dashboard",
        des: "Explore investment opportunities in the latest campaign and checkout previously funded projects.",
      }}
    >
      <InvestmentDashboardLayout />
    </MainLayoutWrapper>
  );
}

import { Avatar, Box, Button, Divider, Grid, Paper, Typography, makeStyles, useMediaQuery } from "@material-ui/core";
import { useEffect, useMemo, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSnackbar } from "notistack";
import useNotify from "src/hook/useNotify";
import FundManagerContract from "src/contract/FundManagerContract";
import { web3Sender } from "src/wallet-connection";
import { fetchFundingRoundsData } from "src/redux/fundingDataSlice";
import MainLayoutWrapper from "src/components/Wrappers/MainLayoutWrapper";
import Empty from "src/components/Icon/Empty";
import DAOInfo from "src/pages/DAODetails/DAOInfo";
import Funding from "./Funding";
import StyledTextField from "../components/StyledTextField";

const useStyle = makeStyles((theme) => ({
  fundingQueue: {
    display: "flex",
  },
  daoList: {
    // display: "block",
    height: "288px",
    overflowY: "auto",
    "&::-webkit-scrollbar": {
      display: "none",
    },
    borderRadius: "1%",
    borderRight: `0.1px solid ${theme.palette.text.secondary}`,
  },
  daoCard: {
    display: "flex",
    justifyContent: "start",
    alignItems: "center",
    borderRadius: 0,
    // width: "100%",
  },
}));

function DAOCard({ dao }) {
  const cls = useStyle();

  return (
    // <Box className={cls.daoCard}>
    <Button className={cls.daoCard} fullWidth>
      <Avatar src={dao.logoUrl} alt={"DAO Logo"} style={{ border: "0.2px solid lightgray" }} />
      <Box sx={{ minWidth: "1rem" }}></Box>
      <Typography>{dao.name}</Typography>
    </Button>
    // </Box>
  );
}

function DAOList({ daos }) {
  const cls = useStyle();
  return (
    <>
      {(daos && daos.length) ? (
        <Box className={cls.daoList}>
          {daos.map((e, i) => (
            <>
              <DAOCard key={i} dao={e} />
              {i !== daos.length - 1 && <Divider />}
            </>
          ))}
        </Box>
      ) : (
        <Box sx={{ witdh: "100%", display: "flex", justifyContent: "center" }}>
          <Empty title="No DAOs in queue" iconProps={{ style: { fontSize: "60px" } }} />
        </Box>
      )}
    </>
  );
}

export default function FundingQueue({ daos }) {
  const cls = useStyle();
  const dispatch = useDispatch();
  const mounted = useRef(false);
  const { errorNotify } = useNotify();
  const { enqueueSnackbar } = useSnackbar();
  const { accountAddress } = useSelector((state) => state.accountDataSlice);
  const { addresses } = useSelector((state) => state.configSlice);

  const [selectedDAO, setSelectedDAO] = useState(daos[0] ?? null);
  const [keyId, setKeyId] = useState(0);
  const [keyIdHelperText, setKeyIdHelperText] = useState(null);

  useEffect(() => {
    if (!selectedDAO?.address) setSelectedDAO(daos[0]);
  }, [selectedDAO]);

  useEffect(() => {
    if (mounted.current) {
      if (keyId === "") setKeyIdHelperText("This field is required");
      if (String(keyId) === "NaN") setKeyIdHelperText("This value is invalid");
      else setKeyIdHelperText(null);
    }
    mounted.current = true;
  }, [keyId]);

  async function onLaunchClick() {
    const fundManagerContractSender = new FundManagerContract(web3Sender, addresses.FUND_MANAGER);
    const _promise = fundManagerContractSender.launchFundingRound(keyId, accountAddress);

    _promise.on("transactionHash", (_) => {
      // setIsLoading(true);
    });
    _promise.then(async (receipt) => {
      dispatch(fetchFundingRoundsData(enqueueSnackbar));
      // setIsLoading(false);
    });
    _promise.catch(async (error) => {
      errorNotify(JSON.stringify(error.message));
      // setIsLoading(false);
    });
  }

  return (
    <>
      <Box mb={2}>
        <Typography variant="h2">Funding Queue</Typography>
      </Box>
      <Grid className={cls.fundingQueue} container spacing={2}>
        <Grid item md={daos.length > 0 ? 4 : 0} xs={12} sx={{ height: "100%" }}>
          {selectedDAO && <DAOInfo dao={selectedDAO} description={false} />}
        </Grid>
        <Grid item md={daos.length > 0 ? 8 : 12} xs={12}>
          <Paper sx={{ witdh: "100%" }}>
            <Grid container spacing={2}>
              <Grid item sm={5} xs={12}>
                <DAOList daos={daos} />
              </Grid>
              <Grid item sm={7} xs={12}>
                <Box mb={5}>
                  <Typography color="textSecondary">There is no funding round at the moment.</Typography>
                </Box>
                <Box mt={5} mb={2}>
                  <Typography variant="h5">Launch new funding round</Typography>
                </Box>
                <Box mb={1}>
                  <StyledTextField
                    textProps={{
                      disabled: false,
                      label: "Distributed Key ID",
                      fullWidth: true,
                      value: keyId,
                      onChange: (e) => setKeyId(Number(e.target.value)),
                      error: keyIdHelperText,
                      helperText: keyIdHelperText,
                    }}
                  />
                </Box>
                <Box sx={{ marginRight: "4px", marginBottom: 1 }}>
                  <Button
                    disabled={keyId === "" || String(keyId) === "NaN" || daos?.length == 0}
                    variant="contained"
                    color="secondary"
                    fullWidth
                    onClick={() => onLaunchClick()}
                  >
                    Launch
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
      </Grid>
    </>

  );
}

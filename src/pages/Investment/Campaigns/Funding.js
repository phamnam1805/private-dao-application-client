import { Avatar, Box, Button, Divider, Grid, Paper, Typography, makeStyles, useMediaQuery } from "@material-ui/core";
import { useEffect, useMemo, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSnackbar } from "notistack";
import useNotify from "src/hook/useNotify";
import { QUERY_STATE, THEME_MODE } from "src/configs/constance";
import { fetchKeysData } from "src/redux/dkgDataSlice";
import { fetchFundingRoundsData } from "src/redux/fundingDataSlice";
import { updateInvestmentNotes, saveInvestmentData } from "src/redux/configSlice";
import FundManagerContract from "src/contract/FundManagerContract";
import { FUNDING_STATE, FUNDING_STATE_ALIAS, KEY_REQUEST_STATE } from "src/configs/constance";
import { web3Sender } from "src/wallet-connection";
import { getBlockNumber, mineBlocks } from "src/services/utility";
import ErrorIconBox from "src/components/Icon/ErrorIconBox";
import { LoadingIconBox } from "src/components/Icon/LoadingIcon";
import StyledTextField from "../components/StyledTextField";
import StatusChip from "../components/StatusChip";
import { Voter, Utils } from "distributed-key-generation";

const useStyle = makeStyles((theme) => ({}));

export default function Funding({ dao, fundingRound }) {
  const cls = useStyle();
  const dispatch = useDispatch();
  const mounted = useRef(false);
  const { errorNotify } = useNotify();
  const { enqueueSnackbar } = useSnackbar();
  const { accountAddress } = useSelector((state) => state.accountDataSlice);
  const { chainId, addresses } = useSelector((state) => state.configSlice);
  const { fetchingKeysStatus, keys, requests } = useSelector((state) => state.dkgDataSlice);
  const [isLoading, setIsLoading] = useState(false);
  const fundingManagerSender = new FundManagerContract(web3Sender, addresses.FUND_MANAGER);

  useEffect(() => {
    if (fetchingKeysStatus === QUERY_STATE.INITIAL) dispatch(fetchKeysData(enqueueSnackbar));
  }, [fetchingKeysStatus]);

  const [fundingAmount, setFundingAmount] = useState(0);
  const [fundingAmountHelperText, setFundingAmountHelperText] = useState(null);

  const devAction = useMemo(() => {
    switch (fundingRound.state) {
      case FUNDING_STATE.PENDING:
        return "Fast forward to funding period";
      case FUNDING_STATE.ACTIVE:
        return "Fast forward to tallying period";
      case FUNDING_STATE.TALLYING:
        if (fundingRound.requestState == KEY_REQUEST_STATE.RESULT_SUBMITTED)
          return "Finalize round";
        else if (requests[fundingRound.requestId] && requests[fundingRound.requestId].R.length > 0)
          return "Fast forward to finalization";
        else if (fundingRound.requestState == KEY_REQUEST_STATE.CONTRIBUTION)
          return "Start tallying process";
        else return "None";
      case FUNDING_STATE.SUCCEEDED:
        return "Finalize round";
      case FUNDING_STATE.FAILED:
        return "Finalize round";
      default:
        return "None";
    }
  }, [fundingRound, requests]);

  async function onFundClick() {
    setIsLoading(true);

    const valueInWei = web3Sender.utils.toWei(fundingAmount);
    const fundingVector = fundingRound.listDAO.map(e => e == dao.address.toLowerCase() ? 1 : 0);
    const fundInput = Voter.getFund(
      keys[fundingRound.keyId].publicKey,
      fundingRound.listDAO.map(e => BigInt(e)),
      BigInt(valueInWei),
      fundingVector
    );

    let { proof, publicInput } = await window.snarkjs.groth16.fullProve(
      fundInput.circuitInput,
      "/wasm/fund_dim3.wasm",
      "/zkey/fund_dim3_final.zkey"
    );

    proof = Utils.genSolidityProof(proof.pi_a, proof.pi_b, proof.pi_c);
    const _promise = fundingManagerSender.fund(
      fundingRound.fundingRoundId, fundInput.commitment, fundInput.Ri, fundInput.Mi, proof,
      accountAddress, valueInWei
    );

    // On transactionHash
    _promise.on("transactionHash", (_) => {

    });
    // Then
    _promise.then(async (receipt) => {
      saveInvestmentData(chainId, fundInput.circuitInput.commitment, {
        account: accountAddress,
        dao: dao.address.toLowerCase(),
        amount: valueInWei,
        nullifier: fundInput.circuitInput.nullifier,
        timestamp: Date.now(),
      });
      dispatch(updateInvestmentNotes(enqueueSnackbar, chainId));
      dispatch(fetchKeysData(enqueueSnackbar));
      setIsLoading(false);
    });
    // Catch
    _promise.catch(async (error) => {
      errorNotify(JSON.stringify(error.message));
      setIsLoading(false);
    });
  }

  async function onDevClick() {
    try {
      switch (fundingRound.state) {
        case FUNDING_STATE.PENDING:
          await mineBlocks(fundingRound.config.pendingPeriod, true);
          break;
        case FUNDING_STATE.ACTIVE:
          await mineBlocks(fundingRound.config.activePeriod, true);
          break;
        case FUNDING_STATE.TALLYING:
          if (fundingRound.requestState == KEY_REQUEST_STATE.RESULT_SUBMITTED)
            await fundingManagerSender.finalizeFundingRound(fundingRound.fundingRoundId, accountAddress);
          else if (requests[fundingRound.requestId].R.length > 0)
            await mineBlocks(fundingRound.config.tallyPeriod);
          else if (fundingRound.requestState == KEY_REQUEST_STATE.CONTRIBUTION)
            await fundingManagerSender.startTallying(fundingRound.fundingRoundId, accountAddress);
          break;
        case FUNDING_STATE.SUCCEEDED:
          await fundingManagerSender.finalizeFundingRound(fundingRound.fundingRoundId, accountAddress);
          break;
        case FUNDING_STATE.FAILED:
          await fundingManagerSender.finalizeFundingRound(fundingRound.fundingRoundId, accountAddress);
          break;
        default:
          break;
      }
      dispatch(fetchFundingRoundsData(enqueueSnackbar));
    } catch (error) {
      errorNotify(JSON.stringify(error.message));
    }
  }

  useEffect(() => {
    if (mounted.current) {
      if (fundingAmount === "" || fundingAmount == 0) setFundingAmountHelperText("This field is required");
      if (String(Number(fundingAmount)) === "NaN") setFundingAmountHelperText("This value is invalid");
      else setFundingAmountHelperText(null);
    }
    mounted.current = true;
  }, [fundingAmount]);

  return (
    <>
      {fetchingKeysStatus === QUERY_STATE.FETCHING && <LoadingIconBox />}
      {fetchingKeysStatus === QUERY_STATE.FAIL && <ErrorIconBox des="Something wrong!" />}
      {fetchingKeysStatus === QUERY_STATE.SUCCESS && (
        <Box ml={1}>
          <Box mb={1}>
            <Typography variant="h5">Funding Round Status</Typography>
          </Box>
          <Box mb={2}>
            <StatusChip status={FUNDING_STATE_ALIAS[fundingRound.state]} />
          </Box>
          <Box mt={5} mb={2}>
            <Typography variant="h5">Fund This Project</Typography>
          </Box>
          <Box mb={1}>
            <StyledTextField
              textProps={{
                disabled: false,
                label: "Amount (ETH)",
                fullWidth: true,
                value: fundingAmount,
                onChange: (e) => setFundingAmount(e.target.value),
                error: fundingAmountHelperText,
                helperText: fundingAmountHelperText,
              }}
            />
          </Box>
          <Box mb={1} sx={{ marginRight: "4px" }}>
            <Button
              disabled={isLoading || fundingAmount == 0 || fundingAmount === "" || String(Number(fundingAmount)) === "NaN"}
              variant="contained"
              color="primary"
              fullWidth
              onClick={() => onFundClick()}
            >
              {isLoading ? <LoadingIconBox iconProps={{ sx: { height: 25 } }} /> : "Fund"}
            </Button>
          </Box>
          <Box sx={{ marginRight: "4px" }}>
            <Button
              disabled={fundingRound.state == FUNDING_STATE.FINALIZED}
              variant="outlined"
              color="primary"
              fullWidth
              size="small"
              onClick={() => onDevClick()}
            >
              {devAction}
            </Button>
          </Box>
        </Box>
      )}
    </>

  );
}

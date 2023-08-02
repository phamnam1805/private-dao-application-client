import { Box, makeStyles, Typography } from "@material-ui/core";
import { useEffect, useMemo, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import DAOManagerContract from "src/contract/DAOManagerContract";
import useNotify from "src/hook/useNotify";
import { DEFAULT_VALUE, StepStatus, updateCreateDAOData, resetCreateDAOData } from "src/redux/createDAODataSlice";
import { web3Reader, web3Sender } from "src/wallet-connection";
import BaseStep from "../components/BaseStep";
import StyledTextField from "../components/StyledTextField";

const useStyle = makeStyles((theme) => ({
  text: {
    color: theme.palette.text.hint,
  },
  but: {
    marginBottom: "10px",
    width: "150px",
    [theme.breakpoints.down("sm")]: {
      width: "100%",
    },
  },
}));

export default function SecondStep({ ...props }) {
  const cls = useStyle();
  const dispatch = useDispatch();
  const history = useHistory();
  const mounted = useRef(false);
  const { errorNotify } = useNotify();
  const [isLoading, setIsLoading] = useState(false);
  const { accountAddress } = useSelector((state) => state.accountDataSlice);
  const { activeStep, activeStatus, descriptionHash } = useSelector((state) => state.createDAODataSlice);
  const { chainId, addresses } = useSelector((state) => state.configSlice);
  const { DAO_MANAGER, DAOS } = addresses;

  const disableAll = !(activeStep == 1);

  const [pendingPeriod, setPendingPeriod] = useState(DEFAULT_VALUE.PENDING_PERIOD);
  const [pendingPeriodHelperText, setPendingPeriodHelperText] = useState(null);
  const [votingPeriod, setVotingPeriod] = useState(DEFAULT_VALUE.VOTING_PERIOD);
  const [votingPeriodHelperText, setVotingPeriodHelperText] = useState(null);
  const [tallyingPeriod, setTallyingPeriod] = useState(DEFAULT_VALUE.TALLYING_PERIOD);
  const [tallyingPeriodHelperText, setTallyingPeriodHelperText] = useState(null);
  const [timelockPeriod, setTimelockPeriod] = useState(DEFAULT_VALUE.TIMELOCK_PERIOD);
  const [timelockPeriodHelperText, setTimelockPeriodHelperText] = useState(null);
  const [queuingPeriod, setQueuingPeriod] = useState(DEFAULT_VALUE.QUEUING_PERIOD);
  const [queuingPeriodHelperText, setQueuingPeriodHelperText] = useState(null);

  useEffect(() => {
    if (mounted.current) {
      if (pendingPeriod === "" || pendingPeriod === "NaN" || pendingPeriod == 0)
        setPendingPeriodHelperText("This field is required");
      else setPendingPeriodHelperText(null);
    }
  }, [pendingPeriod]);

  useEffect(() => {
    if (mounted.current) {
      if (votingPeriod === "" || votingPeriod === "NaN" || votingPeriod == 0)
        setVotingPeriodHelperText("This field is required");
      else setVotingPeriodHelperText(null);
    }
  }, [votingPeriod]);

  useEffect(() => {
    if (mounted.current) {
      if (tallyingPeriod === "" || tallyingPeriod === "NaN" || tallyingPeriod == 0)
        setTallyingPeriodHelperText("This field is required");
      else setTallyingPeriodHelperText(null);
    }
  }, [tallyingPeriod]);

  useEffect(() => {
    if (mounted.current) {
      if (timelockPeriod === "" || timelockPeriod === "NaN" || timelockPeriod == 0)
        setTimelockPeriodHelperText("This field is required");
      else setTimelockPeriodHelperText(null);
    }
  }, [timelockPeriod]);

  useEffect(() => {
    if (mounted.current) {
      if (queuingPeriod === "" || queuingPeriod === "NaN" || queuingPeriod == 0)
        setQueuingPeriodHelperText("This field is required");
      else setQueuingPeriodHelperText(null);
    }
    mounted.current = true;
  }, [queuingPeriod]);

  const confirmDisable = useMemo(() => {
    return pendingPeriod == 0 || votingPeriod == 0 || tallyingPeriod == 0 || timelockPeriod == 0 || queuingPeriod == 0;
  }, [pendingPeriod, votingPeriod, tallyingPeriod, timelockPeriod, queuingPeriod]);

  async function onConfirmClick() {
    dispatch(
      updateCreateDAOData({
        activeStatus: StepStatus.LOADING,
      })
    );
    const daoManagerContractReader = new DAOManagerContract(web3Reader, DAO_MANAGER);
    const daoId = await daoManagerContractReader.daoCounter();
    const daoManagerContractSender = new DAOManagerContract(web3Sender, DAO_MANAGER);
    const _promise = daoManagerContractSender.createDAO(
      daoId,
      [pendingPeriod, votingPeriod, tallyingPeriod, timelockPeriod, queuingPeriod],
      descriptionHash,
      accountAddress
    );
    _promise.on("transactionHash", (_) => {
      setIsLoading(true);
    });
    _promise.then(async (receipt) => {
      dispatch(
        updateCreateDAOData({
          activeStatus: StepStatus.FINISH,
        })
      );
      dispatch(resetCreateDAOData());
      setIsLoading(false);
      history.push("/daos");
    });
    _promise.catch(async (error) => {
      errorNotify(JSON.stringify(error.message));
      dispatch(updateCreateDAOData({ activeStatus: StepStatus.ERROR }));
      setIsLoading(false);
    });
  }

  const disabledBut =
    confirmDisable ||
    !(activeStep == 1 && (activeStatus === StepStatus.INIT || activeStatus === StepStatus.ERROR)) ||
    isLoading;

  return (
    <BaseStep
      {...props}
      style={{ padding: 0 }}
      butProps={{
        disabled: disabledBut,
        onClick: onConfirmClick,
      }}
      boxButProps={{ mx: 2, pb: 2 }}
    >
      <Box display="flex" justifyContent="center" flexDirection="column" padding="1.5rem">
        <Box mb={2}>
          <StyledTextField
            textProps={{
              disabled: disableAll,
              label: "Pending Period",
              fullWidth: true,
              value: pendingPeriod,
              onChange: (e) => setPendingPeriod(Number(e.target.value)),
              error: pendingPeriodHelperText,
              helperText: pendingPeriodHelperText,
            }}
          />
        </Box>
        <Box mb={2}>
          <StyledTextField
            textProps={{
              disabled: disableAll,
              label: "Voting Period",
              fullWidth: true,
              value: votingPeriod,
              onChange: (e) => setVotingPeriod(Number(e.target.value)),
              error: votingPeriodHelperText,
              helperText: votingPeriodHelperText,
            }}
          />
        </Box>
        <Box mb={2}>
          <StyledTextField
            textProps={{
              disabled: disableAll,
              label: "Tallying Period",
              fullWidth: true,
              value: tallyingPeriod,
              onChange: (e) => setTallyingPeriod(Number(e.target.value)),
              error: tallyingPeriodHelperText,
              helperText: tallyingPeriodHelperText,
            }}
          />
        </Box>
        <Box mb={2}>
          <StyledTextField
            textProps={{
              disabled: disableAll,
              label: "Timelock Period",
              fullWidth: true,
              value: timelockPeriod,
              onChange: (e) => setTimelockPeriod(Number(e.target.value)),
              error: timelockPeriodHelperText,
              helperText: timelockPeriodHelperText,
            }}
          />
        </Box>
        <Box mb={2}>
          <StyledTextField
            textProps={{
              disabled: disableAll,
              label: "Queuing Period",
              fullWidth: true,
              value: queuingPeriod,
              onChange: (e) => setQueuingPeriod(Number(e.target.value)),
              error: queuingPeriodHelperText,
              helperText: queuingPeriodHelperText,
            }}
          />
        </Box>
      </Box>
    </BaseStep>
  );
}

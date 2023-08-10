import { Box, Button, Collapse, Grid, IconButton, makeStyles, Paper, Typography, useTheme } from "@material-ui/core";
import { useSnackbar } from "notistack";
import { useEffect, useMemo, useState } from "react";
import { useHistory } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import useNotify from "src/hook/useNotify";
import Web3 from "web3";
import { web3Sender } from "src/wallet-connection";
import { defaultClient } from "src/services/requestClient";
import { Voter, Utils } from "distributed-key-generation";
import DAOContract from "src/contract/DAOContract";
import { QUERY_STATE, KEY_REQUEST_STATE, PROPOSAL_STATE, PROPOSAL_STATE_ALIAS } from "src/configs/constance";
import { fetchParticularDAOData } from "src/redux/daoDataSlice";
import { fetchKeysData } from "src/redux/dkgDataSlice";
import { saveInvestmentData, updateInvestmentNotes } from "src/redux/configSlice";
import { mineBlocks } from "src/services/utility";
import ErrorIconBox from "src/components/Icon/ErrorIconBox";
import { LoadingIconBox } from "src/components/Icon/LoadingIcon";
import ArrowAnimationIcon from "src/components/Icon/ArrowAnimationIcon";
import useLowerAddressParam from "src/hook/useLowerAddressParam";
import VotingItem from "./VotingItem";
import StatusChip from "./StatusChip";
import ResultBar from "./ResultBar";

const useStyle = makeStyles((theme) => ({
  assetRateCell: {
    display: "flex",
    alignItems: "flex-start",
    justifyContent: "left",
    [theme.breakpoints.up("md")]: {
      flexDirection: "column",
      alignItems: "flex-start",
    },
    [theme.breakpoints.down("xs")]: {
      flexDirection: "column",
      alignItems: "flex-start",
    },
  },
  apr: {
    border: "1px solid #7994C1",
    padding: "2px 4px",
    borderRadius: "6px",
    display: "flex",
    alignItems: "center",
    [theme.breakpoints.down("sm")]: {
      marginLeft: "0.5rem",
    },
    [theme.breakpoints.down("xs")]: {
      marginLeft: "0rem",
    },
  },
  aprText: {
    color: "#7994C1",
    fontSize: "11px",
    fontWeight: 400,
  },
  aprBox: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    [theme.breakpoints.down("xs")]: {
      justifyContent: "flex-start",
    },
  },
  imageBox: {
    display: "flex",
    alignItems: "flex-start",
  },
  image: {
    width: 36,
    height: 36,
    marginRight: 8,
    marginTop: -6,
    [theme.breakpoints.down("xs")]: {
      width: 27,
      height: 27,
    },
  },
}));

export default function ProposalItem({ proposal, notes, ...props }) {
  const { daoAddress } = useLowerAddressParam();
  const cls = useStyle();
  const theme = useTheme();
  const dispatch = useDispatch();
  const { errorNotify } = useNotify();
  const { enqueueSnackbar } = useSnackbar();
  const { chainId } = useSelector((state) => state.configSlice);
  const { fetchingKeysStatus, requests } = useSelector((state) => state.dkgDataSlice);
  const { accountAddress } = useSelector((state) => state.accountDataSlice);
  const [open, setOpen] = useState(false);
  const totalVotes = Number(proposal.forVotes) + Number(proposal.againstVotes) + Number(proposal.abstainVotes);

  useEffect(() => {
    if (fetchingKeysStatus === QUERY_STATE.INITIAL) dispatch(fetchKeysData(enqueueSnackbar));
  }, [fetchingKeysStatus]);


  const devAction = useMemo(() => {
    console.log(requests[proposal.requestID]);
    switch (proposal.state) {
      case PROPOSAL_STATE.PENDING:
        return "Fast forward to voting period";
      case PROPOSAL_STATE.ACTIVE:
        return "Fast forward to tallying period";
      case PROPOSAL_STATE.TALLYING:
        if (proposal.requestState == KEY_REQUEST_STATE.RESULT_SUBMITTED)
          return "Finalize proposal";
        else if (
          requests[proposal.requestID] &&
          requests[proposal.requestID].R &&
          requests[proposal.requestID].R.length > 0
        )
          return "None";
        else if (proposal.requestState == KEY_REQUEST_STATE.CONTRIBUTION)
          return "Start tallying process";
        else return "None";
      case PROPOSAL_STATE.SUCCEEDED:
        return "Queue proposal";
      case PROPOSAL_STATE.QUEUED:
        return "Execute proposal";
      default:
        return "None";
    }
  }, [proposal, notes, requests]);

  async function onDevClick() {
    try {
      const daoSender = new DAOContract(web3Sender, daoAddress);
      switch (proposal.state) {
        case PROPOSAL_STATE.PENDING:
          await mineBlocks(proposal.config.pendingPeriod, true);
          break;
        case PROPOSAL_STATE.ACTIVE:
          await mineBlocks(proposal.config.votingPeriod, true);
          break;
        case PROPOSAL_STATE.TALLYING:
          if (proposal.requestState == KEY_REQUEST_STATE.RESULT_SUBMITTED) {
            await daoSender.finalize(proposal.proposalID, accountAddress);
            await mineBlocks(proposal.config.tallyingPeriod, true);
          }
          else if (
            requests[proposal.requestID] &&
            requests[proposal.requestID].R &&
            requests[proposal.requestID].R.length > 0
          ) {
            break;
          }
          else if (proposal.requestState == KEY_REQUEST_STATE.CONTRIBUTION) {
            await daoSender.tally(proposal.proposalID, accountAddress);
          }
          break;
        case PROPOSAL_STATE.SUCCEEDED:
          await daoSender.queue(proposal.proposalID, accountAddress);
          break;
        case PROPOSAL_STATE.QUEUED:
          await mineBlocks(proposal.config.timelockPeriod, true);
          await daoSender.execute(proposal.proposalID, accountAddress);
          break;
        default:
          break;
      }
      dispatch(fetchParticularDAOData(daoAddress, enqueueSnackbar));
    } catch (error) {
      errorNotify(JSON.stringify(error.message));
    }
  }

  const onCellClick = () => {
  };

  const onOpenCellClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setOpen(!open);
  };

  async function onVoteClick(note, option) {
    try {

      const daoSender = new DAOContract(web3Sender, daoAddress);
      const res = (await defaultClient.post("/investment/paths"))["data"];
      let path;
      Object.entries(res).map(([key, value]) => {
        if (String(note.commitment) == String(key)) path = value;
      });
      if (!path) throw new Error("Can not find equivalent path");
      const vote = Voter.getVote(
        Utils.getBigIntArray([
          proposal.distributedKey.publicKey.x,
          proposal.distributedKey.publicKey.y
        ]),
        BigInt(daoAddress),
        BigInt(proposal.proposalID),
        [...Array(3).keys()].map(e => e == option ? 1 : 0),
        BigInt(note.amount),
        BigInt(note.nullifier),
        path.pathElements,
        path.pathIndices,
        path.pathRoot
      );
      let { proof, publicSignals } = await window.snarkjs.groth16.fullProve(
        vote.circuitInput,
        "/wasm/vote_dim3.wasm",
        "/zkey/vote_dim3_final.zkey",
      );
      proof = Utils.genSolidityProof(proof.pi_a, proof.pi_b, proof.pi_c);
      const voteData = [
        path.pathRoot,
        vote.circuitInput.nullifierHash,
        vote.Ri,
        vote.Mi,
        proof
      ];
      const _promise = daoSender.castVote(proposal.proposalID, voteData, accountAddress);

      // On transactionHash
      _promise.on("transactionHash", (_) => {
        // setIsLoading(true);
      });
      // Then
      _promise.then(async (receipt) => {
        saveInvestmentData(
          chainId, note.commitment,
          note.votes ? {
            votes: {
              ...note.votes,
              ...{ [proposal.proposalID]: option }
            }
          } : {
            votes: { [proposal.proposalID]: option }
          }
        );
        dispatch(updateInvestmentNotes(enqueueSnackbar, chainId));
        // setIsLoading(false);
      });
      // Catch
      _promise.catch(async (error) => {
        // setIsLoading(false);
        throw error;
      });
    } catch (error) {
      errorNotify(JSON.stringify(error.message));
    }
  }

  function checkVoted(note) {
    return note.votes && note.votes[proposal.proposalID];
  }

  return (
    <>
      <Box {...props}>
        <Paper
          onClick={() => onCellClick()}
          style={
            open ? { cursor: "pointer", borderBottomLeftRadius: 0, borderBottomRightRadius: 0 } : { cursor: "pointer" }
          }
        >
          {(fetchingKeysStatus === QUERY_STATE.FETCHING) && <LoadingIconBox />}
          {(fetchingKeysStatus === QUERY_STATE.FAIL) && <ErrorIconBox des="Something wrong!" />}
          {(fetchingKeysStatus === QUERY_STATE.SUCCESS) && (
            <>
              <Grid container>
                <Grid item md={5} sm={12} container spacing={1}>
                  <Grid item xs={12}>
                    <Box className={cls.imageBox}>
                      <Typography variant="h5">{proposal.title}</Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <StatusChip status={PROPOSAL_STATE_ALIAS[proposal.state]} />
                  </Grid>
                  <Grid item xs={12} md={6}></Grid>
                  <Grid item xs={12}>
                    <Box sx={{ marginRight: "2rem" }}>
                      <Button
                        disabled={devAction == "None"}
                        variant="outlined"
                        color="primary"
                        fullWidth
                        size="small"
                        onClick={() => onDevClick()}
                      >
                        {devAction}
                      </Button>
                    </Box>
                  </Grid>
                </Grid>
                <Grid item md={7} sm={12} container>
                  <Grid item xs={11} container>
                    <Grid item xs={12}>
                      <ResultBar
                        option={"Yay"}
                        value={Web3.utils.fromWei(proposal.forVotes)}
                        ratio={totalVotes == 0 ? 0 : (Number(proposal.forVotes) * 100) / totalVotes}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <ResultBar
                        option={"Nay"}
                        value={Web3.utils.fromWei(proposal.againstVotes)}
                        ratio={totalVotes == 0 ? 0 : (Number(proposal.againstVotes) * 100) / totalVotes}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <ResultBar
                        option={"Abstain"}
                        value={Web3.utils.fromWei(proposal.abstainVotes)}
                        ratio={totalVotes == 0 ? 0 : (Number(proposal.abstainVotes) * 100) / totalVotes}
                      />
                    </Grid>
                  </Grid>
                  <Grid item xs={1} container direction="row-reverse" alignItems="center">
                    <Box>
                      <IconButton onClick={(e) => onOpenCellClick(e)} style={{ marginTop: -12 }}>
                        <ArrowAnimationIcon color="primary" isTransform={open} />
                      </IconButton>
                    </Box>
                  </Grid>
                </Grid>
              </Grid>
              <Collapse in={open}>
                <VotingItem
                  notes={notes} onVote={onVoteClick} checkVoted={checkVoted}
                  disabledAll={proposal.state !== PROPOSAL_STATE.ACTIVE}
                />
              </Collapse>
            </>
          )}
        </Paper>
      </Box>
    </>
  );
}

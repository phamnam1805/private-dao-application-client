import { Box, Collapse, Grid, IconButton, makeStyles, Paper, Typography, useTheme } from "@material-ui/core";
import { useState } from "react";
import { useHistory } from "react-router-dom";
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

export default function ProposalItem({ proposal, ...props }) {
  const { daoAddress } = useLowerAddressParam();
  const cls = useStyle();
  const theme = useTheme();
  const history = useHistory();
  const [open, setOpen] = useState(false);
  const totalVotes = Number(proposal.forVotes) + Number(proposal.againstVotes) + Number(proposal.abstainVotes);
  // const [drawOpen, setDrawOpen] = useState(false);

  const onCellClick = () => {
  };

  const onOpenCellClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setOpen(!open);
  };

  return (
    <>
      <Box {...props}>
        <Paper
          onClick={() => onCellClick()}
          style={
            open ? { cursor: "pointer", borderBottomLeftRadius: 0, borderBottomRightRadius: 0 } : { cursor: "pointer" }
          }
        >
          <Grid container>
            <Grid item md={5} sm={12} container>
              <Grid item xs={12}>
                <Box className={cls.imageBox}>
                  <Typography variant="h5">{proposal.title}</Typography>
                </Box>
              </Grid>
              <Grid item xs={12} md={6}>
                <StatusChip status={proposal.status} />
              </Grid>
              <Grid item xs={12} md={6}></Grid>
            </Grid>
            <Grid item md={7} sm={12} container>
              <Grid item xs={11} container>
                <Grid item xs={12}>
                  <ResultBar
                    option={"Yay"}
                    value={Number(proposal.forVotes)}
                    ratio={totalVotes == 0 ? 0 : (Number(proposal.forVotes) * 100) / totalVotes}
                  />
                </Grid>
                <Grid item xs={12}>
                  <ResultBar
                    option={"Nay"}
                    value={Number(proposal.againstVotes)}
                    ratio={totalVotes == 0 ? 0 : (Number(proposal.againstVotes) * 100) / totalVotes}
                  />
                </Grid>
                <Grid item xs={12}>
                  <ResultBar
                    option={"Abstain"}
                    value={Number(proposal.abstainVotes)}
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
        </Paper>
        <Collapse in={open}>
          <VotingItem />
        </Collapse>
      </Box>
    </>
  );
}

import {
  Box,
  Button,
  Grid,
  Hidden,
  List,
  ListItem,
  makeStyles,
  Paper,
  Popover,
  Typography,
  withStyles,
} from "@material-ui/core";
import { useEffect, useMemo, useRef, useState } from "react";
import ArrowAnimationIcon from "src/components/Icon/ArrowAnimationIcon";
import CopyIcon from "src/components/Icon/CopyIcon";
import Empty from "src/components/Icon/Empty";
import { THEME_MODE } from "src/configs/constance";
import { formatAddress } from "src/services/utility";

const CssBox = withStyles((theme) => ({
  root: {
    padding: "0.5rem",
    backgroundColor: theme.palette.background.paper,
    border: `1px solid ${theme.palette.type === THEME_MODE.DARK ? "#433026" : "#C1A779"}`,
    borderRadius: "6px",
    cursor: "pointer",
    boxShadow: "0px 2px 1px #0000029",
    display: "inline-flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
}))(Box);

const useStyle = makeStyles((theme) => ({
  root: {
    background: theme.palette.background.collapse,
    padding: "2rem",
    borderBottomLeftRadius: "10px",
    borderBottomRightRadius: "10px",
    borderBottom: "1px solid #00000029",
    boxShadow: "inset 0px 0px 0px #00000029",
  },
  title: {
    color: theme.palette.text.disabled,
  },
  moreInfoText: {
    fontSize: "12px",
    fontWeight: 300,
  },
  content: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  voteBtn: {
    variant: "outlined",
  },
}));

export default function VotingItem() {
  const cls = useStyle();
  const rootRef = useRef(null);
  const notes = [
    {
      id: "0",
      dao: "0x52567d79610A91dCd3bC32F5550118E40b22781F",
      amount: 1000,
      nullifier: "0x1234567812345678123456781234567812345678123456781234567812345678",
      commitment: "0x1234567812345678123456781234567812345678123456781234567812345678",
      createdAt: 1689689327000,
    },
    {
      id: "1",
      dao: "0x52567d79610A91dCd3bC32F5550118E40b22781F",
      amount: 2000,
      nullifier: "0x1234567812345678123456781234567812345678123456781234567812345678",
      commitment: "0x1234567812345678123456781234567812345678123456781234567812345678",
      createdAt: 1689689327000,
    },
  ];
  const defaultSelectedCommitment = notes[0] || null;
  const [selectedCommitment, setSelectedCommitment] = useState(defaultSelectedCommitment);
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const id = open ? "commitments-popover" : undefined;

  useEffect(() => {
    if (!selectedCommitment?.commitment) setSelectedCommitment(defaultSelectedCommitment);
  }, [selectedCommitment]);

  const rootWidth = useMemo(() => {
    if (rootRef?.current) return rootRef.current.offsetWidth;
    else return "auto";
  }, [rootRef?.current?.offsetWidth]);

  function onChooseCommitment(e, selectedCommitment) {
    setSelectedCommitment(selectedCommitment);
    if (event?.onChooseItem) event.onChooseCommitment(e, selectedCommitment);
    setAnchorEl(null);
  }

  return (
    <Box className={cls.root}>
      {notes.length == 0 ? (
        <Box display="flex" justifyContent="center" width="100%">
          <Empty title="No Data" iconProps={{ style: { fontSize: "60px" } }} />
        </Box>
      ) : (
        <Grid container>
          <Grid item md={5} sm={12} container>
            <Box sx={{ width: "100%", marginRight: "1.5rem" }}>
              <Box className={cls.content} mb={2}>
                <Typography color="textPrimary" variant="h5" gutterBottom>
                  Funding Note Information
                </Typography>
              </Box>
              <Box className={cls.content}>
                <Typography color="textSecondary" gutterBottom>
                  ID
                </Typography>
                <Typography>Commitment #{selectedCommitment.id}</Typography>
              </Box>
              <Box className={cls.content}>
                <Typography color="textSecondary" gutterBottom>
                  Amount
                </Typography>
                <Typography>{selectedCommitment.amount} ETH</Typography>
              </Box>
              <Box className={cls.content}>
                <Typography color="textSecondary" gutterBottom>
                  Created At
                </Typography>
                <Typography>{new Date(1689689327000).toString().slice(4, 15)}</Typography>
              </Box>
            </Box>
          </Grid>
          <Grid item md={7} sm={12} container direction="column" justifyContent="flex-start">
            <Box className={cls.content} mb={2}>
              <Typography color="textPrimary" variant="h5" gutterBottom>
                Cast your Vote
              </Typography>
            </Box>
            <Box className={cls.content} mb={2}>
              <CssBox ref={rootRef} onClick={(event) => setAnchorEl(event.currentTarget)}>
                <Typography className={cls.text}>{formatAddress(selectedCommitment.commitment, 8)}</Typography>
                <ArrowAnimationIcon
                  className={cls.text}
                  fontSize="small"
                  isTransform={open}
                  style={{ marginLeft: "0.25rem" }}
                />
              </CssBox>
              <Popover
                id={id}
                open={open}
                anchorEl={anchorEl}
                onClose={() => setAnchorEl(null)}
                PaperProps={{ style: { padding: "0 0.25rem" } }}
              >
                <List style={{ width: rootWidth }}>
                  {notes.map((item, _) => {
                    return (
                      <ListItem
                        key={item.id}
                        button
                        onClick={(event) => onChooseCommitment(event, item)}
                        style={{ borderRadius: "6px" }}
                      >
                        {formatAddress(item.commitment, 8)}
                      </ListItem>
                    );
                  })}
                </List>
              </Popover>
            </Box>
            <Box className={cls.content}>
              <Button variant="contained" color="primary" fullWidth={true}>
                YAY
              </Button>
              <Box
                sx={{
                  minWidth: "0.5rem",
                }}
              />
              <Button variant="contained" color="secondary" fullWidth={true}>
                NAY
              </Button>
              <Box
                sx={{
                  minWidth: "0.5rem",
                }}
              />
              <Button variant="outlined" fullWidth={true}>
                ABSTAIN
              </Button>
            </Box>
          </Grid>
        </Grid>
      )}
    </Box>
  );
}

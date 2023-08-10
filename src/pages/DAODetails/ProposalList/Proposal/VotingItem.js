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
import { useSnackbar } from "notistack";
import { useEffect, useMemo, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import ArrowAnimationIcon from "src/components/Icon/ArrowAnimationIcon";
import CopyIcon from "src/components/Icon/CopyIcon";
import Empty from "src/components/Icon/Empty";
import { THEME_MODE } from "src/configs/constance";
import { formatAddress } from "src/services/utility";
import Web3 from "web3";

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

export default function VotingItem({ notes, onVote, checkVoted, disabledAll }) {
  const cls = useStyle();
  const rootRef = useRef(null);
  const defaultSelectedNote = notes[0] || null;
  const [selectedNote, setSelectedNote] = useState(defaultSelectedNote);
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const id = open ? "commitments-popover" : undefined;

  useEffect(() => {
    if (!selectedNote?.nullifier) setSelectedNote(defaultSelectedNote);
  }, [selectedNote]);

  const rootWidth = useMemo(() => {
    if (rootRef?.current) return rootRef.current.offsetWidth;
    else return "auto";
  }, [rootRef?.current?.offsetWidth]);

  function onChooseNote(e, selectedNote) {
    setSelectedNote(selectedNote);
    if (event?.onChooseItem) event.onChooseNote(e, selectedNote);
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
                  Name
                </Typography>
                <Typography>{selectedNote.name ?? "Untitled note"}</Typography>
              </Box>
              <Box className={cls.content}>
                <Typography color="textSecondary" gutterBottom>
                  Amount
                </Typography>
                <Typography>{Web3.utils.fromWei(selectedNote.amount)} ETH</Typography>
              </Box>
              <Box className={cls.content}>
                <Typography color="textSecondary" gutterBottom>
                  Created At
                </Typography>
                <Typography>{new Date(selectedNote.timestamp).toDateString()}</Typography>
              </Box>
              <Box className={cls.content}>
                <Typography color="textSecondary" gutterBottom>
                  Voted
                </Typography>
                <Typography>{checkVoted(selectedNote) ? "Yes" : "No"}</Typography>
              </Box>
            </Box>
          </Grid>
          <Grid item md={7} sm={12} container direction="column" justifyContent="flex-start">
            <Box className={cls.content} mb={2}>
              <Typography color="textPrimary" variant="h5" gutterBottom>
                Cast your Vote
              </Typography>
            </Box>
            <Box className={cls.content} mb={2.5}>
              <CssBox ref={rootRef} onClick={(event) => setAnchorEl(event.currentTarget)}>
                <Typography className={cls.text}>{formatAddress(String(selectedNote.commitment), 8)}</Typography>
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
                        onClick={(event) => onChooseNote(event, item)}
                        style={{ borderRadius: "6px" }}
                      >
                        {formatAddress(String(item.commitment), 8)}
                      </ListItem>
                    );
                  })}
                </List>
              </Popover>
            </Box>
            <Box className={cls.content}>
              <Button
                variant="contained" color="primary" fullWidth={true}
                onClick={() => onVote(selectedNote, 1)}
                disabled={checkVoted(selectedNote) || disabledAll}
              >
                YAY
              </Button>
              <Box sx={{ minWidth: "0.5rem" }} />
              <Button
                variant="contained" color="secondary" fullWidth={true}
                onClick={() => onVote(selectedNote, 0)}
                disabled={checkVoted(selectedNote) || disabledAll}
              >
                NAY
              </Button>
              <Box sx={{ minWidth: "0.5rem" }} />
              <Button
                variant="contained" fullWidth={true}
                onClick={() => onVote(selectedNote, 2)}
                disabled={checkVoted(selectedNote) || disabledAll}
              >
                ABSTAIN
              </Button>
            </Box>
          </Grid>
        </Grid>
      )}
    </Box>
  );
}

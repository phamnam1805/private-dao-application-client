import {
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  List,
  ListItem,
  Popover,
  Table,
  TableBody,
  TableContainer,
  TableCell,
  TableHead,
  TableRow,
  Typography,
  makeStyles,
} from "@material-ui/core";
import GetAppIcon from "@material-ui/icons/GetApp";
import EditIcon from "@material-ui/icons/Edit";
import DeleteIcon from "@material-ui/icons/Delete";
import { useSnackbar } from "notistack";
import { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import Empty from "src/components/Icon/Empty";
import { THEME_MODE } from "src/configs/constance";
import { web3Reader } from "src/wallet-connection";
import { formatAddress, parseBigIntObject } from "src/services/utility";
import { getInvestmentId, removeInvestmentData, saveInvestmentData, updateInvestmentNotes } from "src/redux/configSlice";
import StyledTextField from "../components/StyledTextField";
import { stringifyBigIntObject } from "src/services/utility";

const useStyle = makeStyles((theme) => ({
  title: {
    padding: "10px 20px 10px 20px",
    background: theme.palette.type === THEME_MODE.DARK ? "#4D2900" : "#F2F5F2",
  },
  listItem: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: theme.spacing(2),
    borderRadius: 10,
  },
  image: {
    height: 60,
    width: 60,
    objectFit: "contain",
  },
  chooseText: {
    color: theme.palette.text.hint,
    padding: "0rem 0rem 0.5rem 0rem",
  },
}));

function RenameModalDialog({ open, onClose, onRename }) {
  const cls = useStyle();
  const mounted = useRef(false);
  const [name, setName] = useState("");
  const [nameHelperText, setNameHelperText] = useState(null);

  useEffect(() => {
    if (mounted.current) {
      if (!name || name == "Untitled note") setNameHelperText("This field is required");
      else setNameHelperText(null);
    }
    mounted.current = true;
  }, [name]);

  return (
    <Dialog open={open} onClose={onClose} PaperProps={{ style: { padding: 0, maxWidth: 400 } }}>
      <DialogTitle className={cls.title}>
        <Box textAlign="center">
          <Typography variant="h4" className={cls.chooseText}>
            Edit Investment Note
          </Typography>
        </Box>
      </DialogTitle>
      <DialogContent>
        <Box mt={2}>
          <StyledTextField
            textProps={{
              label: "Alias",
              fullWidth: true,
              value: name,
              onChange: (e) => setName(e.target.value),
              error: nameHelperText,
              helperText: nameHelperText,
            }}
          />
        </Box>
        <Box my={2}>
          <Button
            variant="contained" fullWidth color="secondary" size="large" disabled={!name}
            onClick={() => onRename(name)}
          >
            <Typography align="center" color="textPrimary" style={{ fontSize: "14px", fontWeight: "400" }}>
              Rename
            </Typography>
          </Button>
        </Box>
      </DialogContent>
    </Dialog>
  );
}

function NoteTableHeader({ sortUpdate, sortType, sortKey }) {
  const cls = useStyle();
  const columns = [
    { id: "name", label: "Name", classes: cls.cell, style: { minWidth: 150 }, sort: undefined },
    {
      id: "address",
      label: "DAO",
      classes: cls.firstCell,
      style: { minWidth: 50, maxWidth: 60 },
      sort: undefined,
    },
    { id: "amount", label: "Funded Amount", classes: cls.cell, style: { minWidth: 50 }, sort: undefined },
    { id: "timestamp", label: "Created At", classes: cls.cell, style: { minWidth: 50, maxWidth: 60 }, sort: undefined },
    { id: "action", label: "", classes: cls.cell, style: { minWidth: 130 }, sort: "totalSupply" },
  ];

  return (
    <TableHead>
      <TableRow>
        {columns.map((element, index) => {
          return (
            <TableCell key={element.id} className={element?.classes} style={element?.style}>
              <Box display="flex" justifyContent="flex-start" alignItems="center">
                <Typography>{element.label}</Typography>
              </Box>
            </TableCell>
          );
        })}
      </TableRow>
    </TableHead>
  );
}

function NoteTableRow({ note }) {
  const cls = useStyle();
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();
  const rootRef = useRef(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const { chainId } = useSelector((state) => state.configSlice);
  const open = Boolean(anchorEl);
  const id = open ? "note-action-popover" : undefined;
  const [isOpenRenameModal, setIsOpenRenameModal] = useState(false);

  function onRowClick() { }

  function onDownloadClick() {
    const data = new Blob([stringifyBigIntObject(note)], { type: "application/json" });
    const jsonURL = URL.createObjectURL(data);
    let tempLink = document.createElement("a");
    tempLink.href = jsonURL;
    tempLink.setAttribute("download", `${getInvestmentId(chainId, note.commitment)}.json`);
    document.body.appendChild(tempLink);
    tempLink.click();
  }

  function onDeleteClick() {
    removeInvestmentData(chainId, note.commitment);
    dispatch(updateInvestmentNotes(enqueueSnackbar, chainId));
  }

  return (
    <TableRow onClick={onRowClick}>
      <TableCell>
        <Box display="flex" alignItems="center">
          <Typography>{note.name ?? "Untitled note"}</Typography>
        </Box>
      </TableCell>
      <TableCell>
        <Box display="flex" alignItems="center">
          <Typography>{formatAddress(note.dao, 6)}</Typography>
        </Box>
      </TableCell>
      <TableCell>
        <Box display="flex" alignItems="center">
          <Typography>{web3Reader.utils.fromWei(note.amount)} ETH</Typography>
        </Box>
      </TableCell>
      <TableCell>
        <Box display="flex" alignItems="center">
          <Typography>{(new Date(note.timestamp)).toLocaleString()}</Typography>
        </Box>
      </TableCell>
      <TableCell>
        <Box
          display="flex" alignItems="center" flexDirection={"row-reverse"}
          aria-describedby={id}
          onClick={(event) => setAnchorEl(event.currentTarget)}
        >
          <IconButton onClick={() => {
            setAnchorEl(null);
            onDeleteClick();
          }}>
            <DeleteIcon />
          </IconButton>
          <IconButton onClick={() => {
            setAnchorEl(null);
            onDownloadClick();
          }}>
            <GetAppIcon />
          </IconButton>
          <IconButton onClick={(event) => {
            setAnchorEl(null);
            setIsOpenRenameModal(true);
          }}>
            <EditIcon />
          </IconButton>
        </Box>
      </TableCell>
      <RenameModalDialog
        open={isOpenRenameModal}
        onClose={() => setIsOpenRenameModal(false)}
        onRename={(newName) => {
          saveInvestmentData(chainId, note.commitment, { name: newName });
          dispatch(updateInvestmentNotes(enqueueSnackbar, chainId));
          setIsOpenRenameModal(false);
        }}
      />
    </TableRow>
  );
}

export default function NoteTable({ noteListData }) {
  const notes = Object.entries(noteListData).map(([commitment, noteData], index) => {
    return { ...{ commitment: commitment }, ...parseBigIntObject(noteData) };
  }).sort((a, b) => {
    if (a.timestamp <= b.timestamp) return 1;
    else return -1;
  });

  return (
    <Box>
      <TableContainer style={{ marginTop: 2, borderRadius: "10px" }}>
        <Table>
          <NoteTableHeader />
          {notes.length > 0 && (
            <TableBody>
              {notes.map((note, index) => {
                return <NoteTableRow key={index} note={note} />;
              })}
            </TableBody>
          )}
        </Table>
      </TableContainer>
      {(notes.length == 0) && (
        <Box py={2} display="flex" justifyContent="center">
          <Empty title="No Data" iconProps={{ style: { fontSize: "60px" } }} />
        </Box>
      )}
    </Box>
  );
}

import {
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  Table,
  TableBody,
  TableContainer,
  TableCell,
  TableHead,
  TableRow,
  Typography,
  makeStyles,
} from "@material-ui/core";
import { useSnackbar } from "notistack";
import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import useNotify from "src/hook/useNotify";
import DKGContract from "src/contract/DKGContract";
import { web3Reader, web3Sender } from "src/wallet-connection";
import { KEY_STATE, KEY_STATE_ALIAS, KEY_TYPE_ALIAS, THEME_MODE } from "src/configs/constance";
import { fetchAccountData, saveContributionData } from "src/redux/accountDataSlice";
import { fetchKeysData } from "src/redux/dkgDataSlice";
import { formatAddress, parseBigIntObject } from "src/services/utility";
import CopyIcon from "src/components/Icon/CopyIcon";
import Empty from "src/components/Icon/Empty";
import { LoadingIconBox } from "src/components/Icon/LoadingIcon";
import { generateRound1Contribution, generateRound2Contribution } from "../Contributions";

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

function ContributionModalDialog({ open, onClose }) {
  const cls = useStyle();
  return (
    <Dialog open={open} onClose={onClose} PaperProps={{ style: { padding: 0, maxWidth: 400 } }}>
      <DialogTitle className={cls.title}>
        <Box textAlign="center">
          <Typography variant="h4" className={cls.chooseText}>
            Key Generation Contribution
          </Typography>
        </Box>
      </DialogTitle>
      <DialogContent>
        <Box mt={2}>
          <LoadingIconBox />
        </Box>
        <Box mt={2}>
          <Typography align="center" color="textSecondary" style={{ fontSize: "14px", fontWeight: "400" }}>
            Submitting Contribution
          </Typography>
        </Box>
      </DialogContent>
    </Dialog>
  );
}

function PublicKeyModalDialog({ open, onClose, pubKeyX, pubKeyY }) {
  const cls = useStyle();
  return (
    <Dialog open={open} onClose={onClose} PaperProps={{ style: { padding: 0, maxWidth: 400 } }}>
      <DialogTitle className={cls.title}>
        <Box textAlign="center">
          <Typography variant="h4" className={cls.chooseText}>
            Public Key
          </Typography>
        </Box>
      </DialogTitle>
      <DialogContent>
        <Box mt={2} sx={{ display: "flex", width: "100%" }}>
          <Typography color="textPrimary" style={{ fontSize: "14px", fontWeight: "400" }}>
            {"X:"}
          </Typography>
          <Typography color="textSecondary" style={{
            width: "100%",
            fontSize: "14px",
            fontWeight: "400",
            wordWrap: "break-word"
          }}>
            {pubKeyX}
          </Typography>
        </Box>
        <Box mt={2} sx={{ display: "flex" }}>
          <Typography color="textPrimary" style={{ fontSize: "14px", fontWeight: "400" }}>
            {"Y:"}
          </Typography>
          <Typography color="textSecondary" style={{
            width: "100%",
            fontSize: "14px",
            fontWeight: "400",
            wordWrap: "break-word"
          }}>
            {pubKeyY}
          </Typography>
        </Box>
        <Box ml={-1}>
          <CopyIcon copyText={`[${pubKeyX},${pubKeyY}]`} defaultText="Copy public key" successText="Copied public key!" size="small" />
        </Box>
      </DialogContent>
    </Dialog>
  );
}

function KeyTableHeader() {
  const cls = useStyle();
  const columns = [
    { id: "keyID", label: "ID", classes: cls.cell, style: { minWidth: 60, maxWidth: 70 } },
    { id: "dimension", label: "Dimension", classes: cls.cell, style: { minWidth: 60, maxWidth: 70 } },
    { id: "type", label: "Type", classes: cls.firstCell, style: { minWidth: 100, maxWidth: 120 } },
    { id: "state", label: "Status", classes: cls.cell, style: { minWidth: 100, maxWidth: 120 } },
    { id: "verifier", label: "Verifier Address", classes: cls.cell, style: { minWidth: 120 } },
    { id: "publicKey", label: "", classes: cls.cell, style: { minWidth: 250 } },
    { id: "actions", label: "", classes: cls.cell, style: { minWidth: 200 } },
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

function KeyTableRow({ dKey }) {
  const dispatch = useDispatch();
  const { errorNotify } = useNotify();
  const { enqueueSnackbar } = useSnackbar();
  const { accountAddress } = useSelector((state) => state.accountDataSlice);
  const { chainId, addresses } = useSelector((state) => state.configSlice);
  const { DKG } = addresses;
  const [isOpenContributionModal, setIsOpenContributionModal] = useState(false);
  const [isOpenPublicKeyModal, setIsOpenPublicKeyModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  async function onRowClick() { }

  async function onContributionClick() {
    setIsLoading(true);
    // Open modal
    const dkgReader = new DKGContract(web3Reader, DKG);
    const dkgSender = new DKGContract(web3Sender, DKG);
    const keyData = await dkgReader.distributedKeys(dKey.keyID);
    let committeeData, contribution, _promise;
    if (dKey.state == KEY_STATE.CONTRIBUTION_ROUND_1) {
      // eslint-disable-next-line no-constant-condition
      if (true) {
        const generatedData = generateRound1Contribution(Number(keyData.round1Counter) + 1);
        committeeData = generatedData.committeeData;
        contribution = generatedData.contribution;
      } else {
        // Upload data
      }
      _promise = dkgSender.submitRound1Contribution(
        dKey.keyID,
        contribution,
        accountAddress
      );
    } else if (dKey.state == KEY_STATE.CONTRIBUTION_ROUND_2) {
      // eslint-disable-next-line no-constant-condition
      if (true) {
        const generatedData = await generateRound2Contribution(
          parseBigIntObject(dKey.contributions),
          dKey.round1DataSubmissions
        );
        committeeData = generatedData.committeeData;
        contribution = generatedData.contribution;
      } else {
        // Upload data
      }
      _promise = dkgSender.submitRound2Contribution(
        dKey.keyID,
        contribution,
        accountAddress
      );
    }
    // On transactionHash
    _promise.on("transactionHash", (_) => {
    });
    // Then
    _promise.then(async (receipt) => {
      saveContributionData(chainId, dKey.keyID, committeeData, accountAddress);
      dispatch(fetchKeysData(enqueueSnackbar));
      dispatch(fetchAccountData(accountAddress, enqueueSnackbar));
      setIsLoading(false);
    });
    // Catch
    _promise.catch(async (error) => {
      errorNotify(JSON.stringify(error.message));
      setIsLoading(false);
    });

    // Close modal

  }

  async function onPublicKeyClick() {
    setIsOpenPublicKeyModal(true);
  }

  return (
    <TableRow onClick={onRowClick}>
      <TableCell>
        <Box display="flex" alignItems="center">
          <Typography>{dKey.keyID}</Typography>
        </Box>
      </TableCell>
      <TableCell>
        <Box display="flex" alignItems="center">
          <Typography>{dKey.dimension}</Typography>
        </Box>
      </TableCell>
      <TableCell>
        <Box display="flex" alignItems="center">
          <Typography>{KEY_TYPE_ALIAS[dKey.type]}</Typography>
        </Box>
      </TableCell>
      <TableCell>
        <Box display="flex" alignItems="center">
          <Typography>{KEY_STATE_ALIAS[dKey.state]}</Typography>
        </Box>
      </TableCell>
      <TableCell>
        <Box display="flex" alignItems="center">
          <Typography>{formatAddress(dKey.verifier, 4)}</Typography>
          <CopyIcon copyText={dKey.verifier} defaultText="Copy address" successText="Copied address!" size="small" />
        </Box>
      </TableCell>
      <TableCell>
        {dKey.state < 2 && (
          <Box display="flex" alignItems="center">
            <Button
              variant="outlined" color={"primary"} fullWidth
              onClick={onContributionClick}
              disabled={
                isLoading ||
                (dKey.contributions !== undefined && dKey.state == KEY_STATE.CONTRIBUTION_ROUND_1) ||
                (dKey.contributions !== undefined && (parseBigIntObject(dKey.contributions).ciphers !== undefined) && dKey.state == KEY_STATE.CONTRIBUTION_ROUND_2)
              }
            >
              {isLoading && <LoadingIconBox iconProps={{ sx: { height: 25 } }} />}
              {!isLoading &&
                (!(dKey.contributions !== undefined) ? "Submit Contribution Round 1" : ((parseBigIntObject(dKey.contributions).ciphers !== undefined) ? "Finished Contribution" : "Submit Contribution Round 2"))
              }
            </Button>
          </Box>
        )}
      </TableCell>
      <TableCell>
        <Box display="flex" alignItems="center">
          <Button
            onClick={onPublicKeyClick}
            variant="contained"
            color={"secondary"}
            fullWidth
            disabled={dKey.state !== KEY_STATE.ACTIVE}
          >
            Get Public Key
          </Button>
        </Box>
      </TableCell>
      <PublicKeyModalDialog open={isOpenPublicKeyModal} onClose={() => setIsOpenPublicKeyModal(false)} pubKeyX={dKey.publicKey[0]} pubKeyY={dKey.publicKey[1]} />
    </TableRow>
  );
}

export default function KeyTable({ keyListData }) {
  return (
    <Box>
      <TableContainer style={{ marginTop: 2, borderRadius: "10px" }}>
        <Table>
          <KeyTableHeader />
          {keyListData.length > 0 && (
            <TableBody>
              {[...keyListData].reverse().map((dKeyData, index) => {
                return <KeyTableRow key={index} dKey={dKeyData} />;
              })}
            </TableBody>
          )}
        </Table>
      </TableContainer>
      {(keyListData.length == 0) && (
        <Box py={2} display="flex" justifyContent="center">
          <Empty title="No Data" iconProps={{ style: { fontSize: "60px" } }} />
        </Box>
      )}
    </Box>
  );
}

import {
  Box,
  Button,
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
import { QUERY_STATE, KEY_STATE, KEY_STATE_ALIAS, KEY_TYPE_ALIAS } from "src/configs/constance";
import { fetchAccountData, readContributionData, removeContributionData, saveContributionData } from "src/redux/accountDataSlice";
import { fetchKeysData } from "src/redux/dkgDataSlice";
import { formatAddress } from "src/services/utility";
import CopyIcon from "src/components/Icon/CopyIcon";
import Empty from "src/components/Icon/Empty";
import { generateRound1Contribution, generateRound2Contribution } from "../Contributions";
import { parseBigIntObject } from "src/services/utility";

const useStyle = makeStyles((theme) => ({}));

function KeyTableHeader() {
  const cls = useStyle();
  const columns = [
    { id: "keyID", label: "Key ID", classes: cls.cell, style: { minWidth: 60, maxWidth: 70 } },
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
  const cls = useStyle();
  const dispatch = useDispatch();
  const { errorNotify } = useNotify();
  const { enqueueSnackbar } = useSnackbar();
  const { accountAddress } = useSelector((state) => state.accountDataSlice);
  const { chainId, addresses } = useSelector((state) => state.configSlice);
  const { DKG } = addresses;
  const [isLoading, setIsLoading] = useState(false);
  async function onRowClick() { }
  console.log("Key API:", dKey);

  async function onContributionClick() {
    console.log(`Start Contribution Round ${dKey.state + 1}`);
    // Open modal
    const dkgReader = new DKGContract(web3Reader, DKG);
    const dkgSender = new DKGContract(web3Sender, DKG);
    const keyData = await dkgReader.distributedKeys(dKey.keyID);
    console.log("Previous", keyData);
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
      console.log("round2");
      // eslint-disable-next-line no-constant-condition
      if (true) {
        const generatedData = generateRound2Contribution(
          parseBigIntObject(dKey.contributions),
          dKey.round1DataSubmissions
        );
        committeeData = generatedData.committeeData;
        contribution = generatedData.contribution;
      } else {
        // Upload data
      }
    }

    console.log(committeeData, contribution);

    // On transactionHash
    _promise.on("transactionHash", (_) => {
      setIsLoading(true);
    });
    // Then
    _promise.then(async (receipt) => {
      saveContributionData(chainId, dKey.keyID, committeeData, accountAddress);
      dispatch(fetchKeysData(enqueueSnackbar));
      dispatch(fetchAccountData(accountAddress, enqueueSnackbar));
      setIsLoading(false);
      const keyData = await dkgReader.distributedKeys(dKey.keyID);
      console.log("After", keyData);
    });
    // Catch
    _promise.catch(async (error) => {
      errorNotify(JSON.stringify(error.message));
      setIsLoading(false);
    });
    // Close modal

  }

  async function onPublicKeyClick() {
    console.log("This is public key!");
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
                (dKey.contributions !== undefined && dKey.state == KEY_STATE.CONTRIBUTION_ROUND_1) ||
                (dKey.contributions !== undefined && (parseBigIntObject(dKey.contributions).ciphers !== undefined) && dKey.state == KEY_STATE.CONTRIBUTION_ROUND_2)
              }
            >
              {!(dKey.contributions !== undefined) ? "Submit Contribution Round 1" : ((parseBigIntObject(dKey.contributions).ciphers !== undefined) ? "Finished Contribution" : "Submit Contribution Round 2")}
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
    </TableRow>
  );
}

export default function KeyTable({ keyListData }) {
  return (
    <Box>
      {keyListData.length > 0 ? (
        <TableContainer style={{ marginTop: 2, borderRadius: "10px" }}>
          <Table>
            <KeyTableHeader />
            <TableBody>
              {[...keyListData].reverse().map((dKeyData, index) => {
                return <KeyTableRow key={index} dKey={dKeyData} />;
              })}
            </TableBody>
          </Table>
        </TableContainer>
      ) : (
        <Box py={2} display="flex" justifyContent="center">
          <Empty title="No Data" iconProps={{ style: { fontSize: "60px" } }} />
        </Box>
      )}
    </Box>
  );
}

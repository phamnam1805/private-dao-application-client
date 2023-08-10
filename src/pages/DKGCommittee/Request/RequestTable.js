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
import { BASE_FUNDING, KEY_REQUEST_STATE, KEY_REQUEST_STATE_ALIAS, THEME_MODE } from "src/configs/constance";
import { fetchAccountData, saveContributionData } from "src/redux/accountDataSlice";
import { fetchKeysData } from "src/redux/dkgDataSlice";
import { formatAddress, parseBigIntObject } from "src/services/utility";
import CopyIcon from "src/components/Icon/CopyIcon";
import Empty from "src/components/Icon/Empty";
import ErrorIconBox from "src/components/Icon/ErrorIconBox";
import { LoadingIconBox } from "src/components/Icon/LoadingIcon";
import { bruteForceResult, generateTallyContribution, generateResultSubmission } from "../Contributions";

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

function ResultModalDialog({ open, onClose, resultVector }) {
  const cls = useStyle();
  return (
    <Dialog open={open} onClose={onClose} PaperProps={{ style: { padding: 0, maxWidth: 600 } }}>
      <DialogTitle className={cls.title}>
        <Box textAlign="center">
          <Typography variant="h4" className={cls.chooseText}>
            Result Vector
          </Typography>
        </Box>
      </DialogTitle>
      <DialogContent>
        {resultVector.map((res, index) => (
          <>
            <Box mt={2} key={`result-${index}-title`}>
              <Typography color="textPrimary" style={{ fontSize: "16px", fontWeight: "500" }}>
                {`Dimension ${index}:`}
              </Typography>
            </Box>

            <Box mt={2} sx={{ display: "flex", width: "100%" }} key={`result-${index}-0`}>
              <Typography color="textPrimary" style={{ fontSize: "14px", fontWeight: "400" }}>
                {"X: "}
              </Typography>
              <Typography color="textSecondary" style={{
                width: "100%",
                fontSize: "14px",
                fontWeight: "400",
                wordWrap: "break-word"
              }}>
                {resultVector[index][0]}
              </Typography>
            </Box>

            <Box mt={2} sx={{ display: "flex", width: "100%" }} key={`result-${index}-1`}>
              <Typography color="textPrimary" style={{ fontSize: "14px", fontWeight: "400" }}>
                {"Y: "}
              </Typography>
              <Typography color="textSecondary" style={{
                width: "100%",
                fontSize: "14px",
                fontWeight: "400",
                wordWrap: "break-word"
              }}>
                {resultVector[index][1]}
              </Typography>
            </Box>
          </>
        ))}
        <Box ml={-1}>
          <CopyIcon copyText={`[${[...resultVector.map(e => `[${e.toString()}]`)]}]`} defaultText="Copy result" successText="Copied result!" size="small" />
        </Box>
      </DialogContent>
    </Dialog>
  );
}

function RequestTableHeader() {
  const cls = useStyle();
  const columns = [
    { id: "requestID", label: "ID", classes: cls.cell, style: { minWidth: 60, maxWidth: 70 } },
    { id: "requestor", label: "Requestor", classes: cls.cell, style: { minWidth: 60, maxWidth: 70 } },
    { id: "keyID", label: "Key ID", classes: cls.firstCell, style: { minWidth: 80, maxWidth: 100 } },
    { id: "state", label: "Status", classes: cls.cell, style: { minWidth: 100, maxWidth: 120 } },
    { id: "actions", label: "", classes: cls.cell, style: { minWidth: 220 } },
    { id: "result", label: "", classes: cls.cell, style: { minWidth: 150 } },
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

function RequestTableRow({ keys, request }) {
  const dispatch = useDispatch();
  const { errorNotify } = useNotify();
  const { enqueueSnackbar } = useSnackbar();
  const { accountAddress } = useSelector((state) => state.accountDataSlice);
  const { chainId, addresses } = useSelector((state) => state.configSlice);
  const { DKG } = addresses;
  const [isOpenResultModal, setIsOpenResultModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  function onRowClick() { }

  async function onActionClick() {
    try {
      setIsLoading(true);
      // Open modal
      const dkgReader = new DKGContract(web3Reader, DKG);
      const dkgSender = new DKGContract(web3Sender, DKG);
      // const keyData = await dkgReader.distributedKeys(dKey.keyID);
      let _promise;
      const keyGenContribution = parseBigIntObject(keys[request.keyID].contributions);
      if (request.state == KEY_REQUEST_STATE.CONTRIBUTION) {
        console.log("Submitting tally contribution...");
        let contribution;
        // eslint-disable-next-line no-constant-condition
        if (true) {
          const generatedData = await generateTallyContribution(
            keyGenContribution,
            keys[request.keyID].round2DataSubmissions,
            request.R
          );
          // committeeData = generatedData.committeeData;
          contribution = generatedData.contribution;
        } else {
          // Upload data
        }
        _promise = dkgSender.submitTallyContribution(
          request.requestID,
          contribution,
          accountAddress
        );
      } else if (request.state == KEY_REQUEST_STATE.RESULT_AWAITING) {
        console.log("Submitting brute force result...");
        let submission;
        // eslint-disable-next-line no-constant-condition
        if (true) {
          const result = await bruteForceResult(request.resultVector);
          const generatedData = await generateResultSubmission(
            request.tallyDataSubmissions,
            request.M,
            result
          );
          submission = generatedData.submission;
        } else {
          // Upload data
        }
        _promise = dkgSender.submitTallyResult(
          request.requestID,
          submission.result,
          submission.proof,
          accountAddress
        );
      }

      // On transactionHash
      _promise.on("transactionHash", (_) => {
      });
      // Then
      _promise.then(async (receipt) => {
        if (request.state == KEY_REQUEST_STATE.CONTRIBUTION) {
          saveContributionData(
            chainId, request.keyID,
            keyGenContribution.tally ? {
              tally: { ...keyGenContribution.tally, ...{ [request.requestID]: true } }
            } : {
              tally: { [request.requestID]: true }
            },
            accountAddress
          );
        }
        dispatch(fetchKeysData(enqueueSnackbar));
        dispatch(fetchAccountData(accountAddress, enqueueSnackbar));
        setIsLoading(false);
      });
      // Catch
      _promise.catch(async (error) => {
        setIsLoading(false);
        throw error;
      });
    } catch (error) {
      setIsLoading(false);
      errorNotify(JSON.stringify(error.message));
    }
  }

  async function onResultClick() {
    setIsOpenResultModal(true);
  }

  return (
    <>
      <TableRow onClick={onRowClick}>
        <TableCell>
          <Box display="flex" alignItems="center">
            <Typography>{formatAddress(request.requestID, 4)}</Typography>
          </Box>
        </TableCell>
        <TableCell>
          <Box display="flex" alignItems="center">
            <Typography>{formatAddress(request.requester, 4)}</Typography>
          </Box>
        </TableCell>
        <TableCell>
          <Box display="flex" alignItems="center">
            <Typography>{request.keyID}</Typography>
          </Box>
        </TableCell>
        <TableCell>
          <Box display="flex" alignItems="center">
            <Typography>{KEY_REQUEST_STATE_ALIAS[request.state]}</Typography>
          </Box>
        </TableCell>
        <TableCell>
          {request.state < 2 && (
            <Box display="flex" alignItems="center">
              <Button
                variant="outlined" color={"primary"} fullWidth
                disabled={
                  isLoading ||
                  (
                    KEY_REQUEST_STATE.CONTRIBUTION &&
                    keys[request.keyID].contributions &&
                    parseBigIntObject(keys[request.keyID].contributions).tally &&
                    parseBigIntObject(keys[request.keyID].contributions).tally[request.requestID]
                  )
                }
                onClick={onActionClick}
              >

                {isLoading && <LoadingIconBox iconProps={{ sx: { height: 25 } }} />}
                {!isLoading && request.state == KEY_REQUEST_STATE.CONTRIBUTION && (
                  (keys[request.keyID].contributions &&
                    parseBigIntObject(keys[request.keyID].contributions).tally &&
                    parseBigIntObject(keys[request.keyID].contributions).tally[request.requestID])
                    ? "Submitted Contribution" : "Submit Contribution"
                )}
                {!isLoading && request.state == KEY_REQUEST_STATE.RESULT_AWAITING && "Submit Result"}
              </Button>
            </Box>
          )}
        </TableCell>
        <TableCell>
          <Box display="flex" alignItems="center">
            <Button
              variant="contained"
              color={"secondary"}
              fullWidth
              disabled={request.state !== KEY_REQUEST_STATE.RESULT_SUBMITTED}
              onClick={onResultClick}
            >
              View Result
            </Button>
          </Box>
        </TableCell>
        <ResultModalDialog open={isOpenResultModal} onClose={() => setIsOpenResultModal(false)} resultVector={request.resultVector} />
      </TableRow >
    </>
  );
}

export default function RequestTable({ keyListData, requestListData }) {
  return (
    <Box>
      <TableContainer style={{ marginTop: 2, borderRadius: "10px" }}>
        <Table>
          <RequestTableHeader />
          {requestListData.length > 0 && (
            <TableBody>
              {[...requestListData].reverse().map((requestData, index) => {
                return <RequestTableRow key={`request-row-${index}`} keys={keyListData} request={requestData} />;
              })}
            </TableBody>
          )}
        </Table>
      </TableContainer>
      {(requestListData.length == 0) && (
        <Box py={2} display="flex" justifyContent="center">
          <Empty title="No Data" iconProps={{ style: { fontSize: "60px" } }} />
        </Box>
      )}
    </Box>
  );
}

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
import { useMemo, useState } from "react";
import { useSelector } from "react-redux";
import Empty from "src/components/Icon/Empty";
import ErrorIconBox from "src/components/Icon/ErrorIconBox";
import { LoadingIconBox } from "src/components/Icon/LoadingIcon";
import { QUERY_STATE, KEY_REQUEST_STATE, KEY_REQUEST_STATE_ALIAS } from "src/configs/constance";
import { formatAddress } from "src/services/utility";
import ArrowAnimationIcon from "src/components/Icon/ArrowAnimationIcon";
import CopyIcon from "src/components/Icon/CopyIcon";

const useStyle = makeStyles((theme) => ({}));

function RequestTableHeader() {
  const cls = useStyle();
  const columns = [
    { id: "requestID", label: "Request ID", classes: cls.cell, style: { minWidth: 60, maxWidth: 70 } },
    { id: "requestor", label: "Requestor", classes: cls.cell, style: { minWidth: 60, maxWidth: 70 } },
    { id: "keyID", label: "Key ID", classes: cls.firstCell, style: { minWidth: 100, maxWidth: 120 } },
    { id: "state", label: "Status", classes: cls.cell, style: { minWidth: 100, maxWidth: 120 } },
    { id: "actions", label: "", classes: cls.cell, style: { minWidth: 200 } },
    { id: "result", label: "", classes: cls.cell, style: { minWidth: 130 } },
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

function RequestTableRow({ request }) {
  const cls = useStyle();

  function onRowClick() {}

  return (
    <TableRow onClick={onRowClick}>
      <TableCell>
        <Box display="flex" alignItems="center">
          <Typography>{formatAddress(request.requestID, 8)}</Typography>
        </Box>
      </TableCell>
      <TableCell>
        <Box display="flex" alignItems="center">
          <Typography>{formatAddress(request.requestor, 6)}</Typography>
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
            <Button variant="outlined" color={"primary"} fullWidth>
              {request.state == KEY_REQUEST_STATE.CONTRIBUTION && "Submit Contribution"}
              {request.state == KEY_REQUEST_STATE.RESULT_AWAITING && "Submit Result"}
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
          >
            View Result
          </Button>
        </Box>
      </TableCell>
    </TableRow>
  );
}

export default function RequestTable({ requestListData }) {
  // const { fetchingPortfolioStatus } = useSelector((state) => state.portfolioDataSlice);

  const fetchingRequestsStatus = QUERY_STATE.SUCCESS;
  const data = requestListData;

  return (
    <Box>
      <TableContainer style={{ marginTop: 2, borderRadius: "10px" }}>
        <Table>
          <RequestTableHeader />
          {fetchingRequestsStatus === QUERY_STATE.SUCCESS && data.length > 0 && (
            <TableBody>
              {data.map((requestData, index) => {
                return <RequestTableRow key={index} request={requestData} />;
              })}
            </TableBody>
          )}
        </Table>
      </TableContainer>
      {(() => {
        if (fetchingRequestsStatus === QUERY_STATE.SUCCESS && data.length == 0)
          return (
            <Box py={2} display="flex" justifyContent="center">
              <Empty title="No Data" iconProps={{ style: { fontSize: "60px" } }} />
            </Box>
          );
        else if (fetchingRequestsStatus == QUERY_STATE.FETCHING) return <LoadingIconBox mt={2} />;
        else if (fetchingRequestsStatus == QUERY_STATE.FAIL) return <ErrorIconBox />;
      })()}
    </Box>
  );
}

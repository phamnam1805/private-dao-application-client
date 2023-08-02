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
import { QUERY_STATE } from "src/configs/constance";
import { formatAddress } from "src/services/utility";
import ArrowAnimationIcon from "src/components/Icon/ArrowAnimationIcon";

const useStyle = makeStyles((theme) => ({}));

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
    { id: "nullifier", label: "Nullifier", classes: cls.cell, style: { minWidth: 50, maxWidth: 60 }, sort: undefined },
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

  function onRowClick() {}

  return (
    <TableRow onClick={onRowClick}>
      <TableCell>
        <Box display="flex" alignItems="center">
          <Typography>{note.name}</Typography>
        </Box>
      </TableCell>
      <TableCell>
        <Box display="flex" alignItems="center">
          <Typography>{formatAddress(note.dao, 6)}</Typography>
        </Box>
      </TableCell>
      <TableCell>
        <Box display="flex" alignItems="center">
          <Typography>{note.amount} ETH</Typography>
        </Box>
      </TableCell>
      <TableCell>
        <Box display="flex" alignItems="center">
          <Typography>{formatAddress(note.nullifier, 8)}</Typography>
        </Box>
      </TableCell>
      <TableCell>
        <Box display="flex" alignItems="center" flexDirection={"row-reverse"}>
          <Button variant="outlined" endIcon={<ArrowAnimationIcon />}>
            Actions
          </Button>
        </Box>
      </TableCell>
    </TableRow>
  );
}

export default function NoteTable({ noteListData }) {
  const [displayMode, setDisplayMode] = useState("all");

  // const { fetchingPortfolioStatus } = useSelector((state) => state.portfolioDataSlice);

  const fetchingPortfolioStatus = QUERY_STATE.SUCCESS;
  const data = noteListData;

  return (
    <Box>
      <TableContainer style={{ marginTop: 2, borderRadius: "10px" }}>
        <Table>
          <NoteTableHeader />
          {fetchingPortfolioStatus === QUERY_STATE.SUCCESS && data.length > 0 && (
            <TableBody>
              {data.map((noteData, index) => {
                return <NoteTableRow key={index} note={noteData} />;
              })}
            </TableBody>
          )}
        </Table>
      </TableContainer>
      {(() => {
        if (fetchingPortfolioStatus === QUERY_STATE.SUCCESS && data.length == 0)
          return (
            <Box py={2} display="flex" justifyContent="center">
              <Empty title="No Data" iconProps={{ style: { fontSize: "60px" } }} />
            </Box>
          );
        else if (fetchingPortfolioStatus == QUERY_STATE.FETCHING) return <LoadingIconBox mt={2} />;
        else if (fetchingPortfolioStatus == QUERY_STATE.FAIL) return <ErrorIconBox />;
      })()}
    </Box>
  );
}

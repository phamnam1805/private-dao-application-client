import {
  Box, Button, Grid, Typography, makeStyles
} from "@material-ui/core";
import PublishIcon from "@material-ui/icons/Publish";
import { useSnackbar } from "notistack";
import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { QUERY_STATE, THEME_MODE } from "src/configs/constance";
import { saveInvestmentData, updateInvestmentNotes } from "src/redux/configSlice";
import { parseBigIntObject } from "src/services/utility";
import MainLayoutWrapper from "src/components/Wrappers/MainLayoutWrapper";
import ErrorIconBox from "src/components/Icon/ErrorIconBox";
import { LoadingIconBox } from "src/components/Icon/LoadingIcon";
import NoteTable from "../Notes/NoteTable";

export function PortfolioLayout() {
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();
  const { chainId, queryingInvestmentsStatus, investments } = useSelector((state) => state.configSlice);

  return (
    <>
      {(queryingInvestmentsStatus === QUERY_STATE.FETCHING) && <LoadingIconBox />}
      {(queryingInvestmentsStatus === QUERY_STATE.FAIL) && <ErrorIconBox des="Something wrong!" />}
      {(queryingInvestmentsStatus === QUERY_STATE.SUCCESS) && (
        <>
          <Box sx={{ display: "flex", flexDirection: "row-reverse" }}>
            <input
              style={{ display: "none" }}
              id="uploadNote"
              type="file"
              accept="application/json"
              onChange={(event) => {
                if (event.target.files && event.target.files[0]) {
                  const fileReader = new FileReader();
                  fileReader.readAsText(event.target.files[0], "UTF-8");
                  fileReader.onload = e => {
                    const uploadedNote = parseBigIntObject(e.target.result);
                    saveInvestmentData(uploadedNote.chainId ?? 31337, uploadedNote.commitment, uploadedNote);
                    dispatch(updateInvestmentNotes(enqueueSnackbar, chainId));
                  };
                }
              }}
            />
            <label htmlFor="uploadNote">
              <Button
                style={{ marginBottom: "1rem" }}
                // fullWidth={matches}
                variant="contained"
                color="primary"
                component="span"
                endIcon={<PublishIcon />}
              // onClick={() => history.push("/create-dao")}
              >
                Upload Investment Note
              </Button>
            </label>
          </Box>
          <Box>
            <Grid container spacing={2}>
              <Grid item lg={12} xs={12}>
                <NoteTable noteListData={investments} />
              </Grid>
            </Grid>
          </Box>
        </>
      )}
    </>
  );
}

export default function Portfolio() {

  return (
    <MainLayoutWrapper
      overview={{
        title: "Portfolio",
        des: "Track your portfolio history with secret investment notes",
      }}
    >
      <PortfolioLayout />
    </MainLayoutWrapper>
  );
}

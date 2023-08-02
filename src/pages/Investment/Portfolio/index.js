import { Box, Button, Grid, makeStyles } from "@material-ui/core";
import MainLayoutWrapper from "src/components/Wrappers/MainLayoutWrapper";
import NoteTable from "../Notes/NoteTable";

export default function Portfolio() {
  const noteListData = [
    {
      name: "Test Note 0",
      dao: "0xD5745a490f14CdA24bed11156d91Eb7A77c8CB1B",
      amount: "10000",
      nullifier: "0x123123123123123123123123123123123123123123123123123",
    },
    {
      name: "Test Note 2",
      dao: "0xD5745a490f14CdA24bed11156d91Eb7A77c8CB1B",
      amount: "50000",
      nullifier: "0x123123123123123123123123123123123123123123123123123",
    },
    {
      name: "Test Note 3",
      dao: "0xD5745a490f14CdA24bed11156d91Eb7A77c8CB1B",
      amount: "3000",
      nullifier: "0x123123123123123123123123123123123123123123123123123",
    },
  ];
  return (
    <MainLayoutWrapper
      overview={{
        title: "Portfolio",
        des: "Track your portfolio history with secret investment notes",
      }}
    >
      <Box sx={{ display: "flex", flexDirection: "row-reverse" }}>
        <Button
          style={{ marginBottom: "1rem" }}
          // fullWidth={matches}
          variant="contained"
          color="primary"
          // startIcon={<AddCircleIcon />}
          // onClick={() => history.push("/create-dao")}
        >
          Upload Investment Note
        </Button>
      </Box>
      <Box>
        <Grid container spacing={2}>
          {/* <Grid item lg={5} xs={12}>
            <Paper></Paper>
          </Grid> */}
          <Grid item lg={12} xs={12}>
            <NoteTable noteListData={noteListData} />
          </Grid>
        </Grid>
      </Box>
    </MainLayoutWrapper>
  );
}

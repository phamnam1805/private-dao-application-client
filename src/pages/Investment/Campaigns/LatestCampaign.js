import { Avatar, Box, Button, Divider, Grid, Paper, Typography, makeStyles, useMediaQuery } from "@material-ui/core";
import { useEffect, useMemo, useRef, useState } from "react";
import MainLayoutWrapper from "src/components/Wrappers/MainLayoutWrapper";
import DAOInfo from "src/pages/DAODetails/DAOInfo";
import Funding from "./Funding";

const useStyle = makeStyles((theme) => ({
  latestCampaign: {
    display: "flex",
  },
  daoList: {
    // display: "block",
    height: "270px",
    overflowY: "auto",
    "&::-webkit-scrollbar": {
      display: "none",
    },
    borderRadius: "1%",
    borderRight: `0.1px solid ${theme.palette.text.secondary}`,
  },
  daoCard: {
    display: "flex",
    justifyContent: "start",
    alignItems: "center",
    borderRadius: 0,
    // width: "100%",
  },
}));

function DAOCard({ dao }) {
  const cls = useStyle();

  return (
    // <Box className={cls.daoCard}>
    <Button className={cls.daoCard} fullWidth>
      <Avatar src={dao.logoUrl} alt={"DAO Logo"} style={{ border: "0.2px solid lightgray" }} />
      <Box sx={{ minWidth: "1rem" }}></Box>
      <Typography>{dao.name}</Typography>
    </Button>
    // </Box>
  );
}

function DAOList({ daos }) {
  const cls = useStyle();
  return (
    <Box className={cls.daoList}>
      {daos &&
        daos.map((e, i) => (
          <>
            <DAOCard key={i} dao={e} />
            {i !== daos.length - 1 && <Divider />}
          </>
        ))}
    </Box>
  );
}

export default function LatestCampaign({ daos }) {
  const cls = useStyle();
  const [selectedDAO, setSelectedDAO] = useState(daos[0]);

  useEffect(() => {
    if (!selectedDAO?.address) setSelectedDAO(daos[0]);
  }, [selectedDAO]);

  return (
    <Grid className={cls.latestCampaign} container spacing={2}>
      <Grid item md={4} xs={12} sx={{ height: "100%" }}>
        <DAOInfo dao={selectedDAO} description={false} />
      </Grid>
      <Grid item md={8} xs={12}>
        <Paper sx={{ witdh: "100%" }}>
          <Grid container>
            <Grid item md={5} xs={6}>
              <DAOList daos={daos} />
            </Grid>
            <Grid item md={7} xs={6}>
              <Funding />
            </Grid>
          </Grid>
        </Paper>
      </Grid>
    </Grid>
  );
}

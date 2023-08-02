import { Box, Grid, Paper, Typography, makeStyles } from "@material-ui/core";
import CopyIcon from "src/components/Icon/CopyIcon";
import { formatAddress } from "src/services/utility";

const useStyle = makeStyles((theme) => ({
  infoBox: {
    backgroundColor: theme.palette.background.paper,
  },
  desBox: {
    // display: "flex",
    minHeight: "300px",
    backgroundColor: theme.palette.background.paper,
  },
  image: {
    [theme.breakpoints.up("sm")]: {
      width: "140px",
    },
    [theme.breakpoints.only("xs")]: {
      width: "120px",
    },
  },
  info: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  infoTag: {
    display: "flex",
    justifyContent: "end",
    alignItems: "center",
  },
}));

export default function DAOInfo({ dao, description = true }) {
  const cls = useStyle();

  return (
    <Grid container spacing={3}>
      <Grid item lg={description ? 4 : 12} sm={description ? 5 : 12} xs={12}>
        <Paper className={cls.infoBox}>
          <Box display="flex" justifyContent="center" position="relative" my={1.5}>
            <img src={dao.logoUrl} alt="shield" className={cls.image} />
          </Box>
          <Box
            sx={{
              minHeight: "1rem",
            }}
          />
          <Box className={cls.info}>
            <Typography color="textSecondary" gutterBottom>
              Address
            </Typography>
            <Box className={cls.info}>
              <Typography>{formatAddress(dao.address, 4)}</Typography>
              <CopyIcon copyText={dao.address} defaultText="Copy address" successText="Copied address!" size="small" />
            </Box>
          </Box>
          <Box className={cls.info}>
            <Typography color="textSecondary" gutterBottom>
              Tags
            </Typography>
            <Box className={cls.infoTag}>
              {dao.tags.map((tag, index) => {
                return (
                  <Typography key={`tag-${index}`}>
                    {index == 0 ? "" : " , "}
                    {tag}
                  </Typography>
                );
              })}
            </Box>
          </Box>

          <Box className={cls.info}>
            <Typography color="textSecondary" gutterBottom>
              Website
            </Typography>
            <Typography>{dao.website}</Typography>
          </Box>
        </Paper>
      </Grid>
      {description && (
        <Grid item lg={8} sm={7} xs={12}>
          <Paper className={cls.desBox}>
            <Typography variant="h2" gutterBottom>
              Description
            </Typography>
            <Typography>{dao.description}</Typography>
          </Paper>
        </Grid>
      )}
    </Grid>
  );
}

import { useHistory } from "react-router-dom";
import { Box, Button, Typography, makeStyles } from "@material-ui/core";
// import { Skeleton } from "@material-ui/lab";
import Web3 from "web3";
import CopyIcon from "src/components/Icon/CopyIcon";
import { formatAddress } from "src/services/utility";

const useStyle = makeStyles((theme) => ({
  daoBox: {
    padding: "1.2rem",
    borderRadius: 6,
    backgroundColor: theme.palette.background.paper,
    zIndex: 100,
  },
  title: {
    fontWeight: "bold",
    fontSize: "20px",
  },
  content: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  tag: {
    display: "flex",
    justifyContent: "end",
    alignItems: "center",
  },
  standby: {
    backgroundColor: "rgba(125, 125, 125, 0.6)",
    disable: true,
  },
  queued: {
    backgroundColor: "rgba(125, 125, 125, 0.6)",
  },
  active: {
    backgroundColor: "#D97719",
  },
}));

export default function DAOItem({ dao }) {
  const cls = useStyle();
  const history = useHistory();

  const status = () => {
    switch (dao.state) {
      case 0:
        return { text: "Not raising fund", className: cls.standby };
      case 1:
        return { text: "Queued for next round", className: cls.queued };
      case 2:
        return { text: "Fund the project", className: cls.active };
      default:
        return { text: "No funding information", className: cls.standby };
    }
  };

  return (
    <Box flexGrow={1} className={cls.daoBox}>
      <Box display="flex" justifyContent="space-between" flexWrap="wrap" width="100%" alignItems="center">
        <Box display="flex" alignItems="center" mb={1}>
          <img src={dao.logoUrl} alt="dao logo" style={{ height: 75, marginRight: "1rem" }} />
          <Typography className={cls.title} style={{ paddingRight: 20 }}>
            {dao.name}
          </Typography>
        </Box>
      </Box>
      <Box
        sx={{
          minHeight: "2rem",
        }}
      />
      <Box pt={2}>
        <Box className={cls.content}>
          <Typography color="textSecondary" gutterBottom>
            {dao.description}
          </Typography>
        </Box>
        <Box
          sx={{
            minHeight: "1rem",
          }}
        />
        <Box className={cls.content}>
          <Typography color="textSecondary" gutterBottom>
            Address
          </Typography>
          <Box className={cls.content}>
            <Typography>{formatAddress(dao.address, 4)}</Typography>
            <CopyIcon copyText={dao.address} defaultText="Copy address" successText="Copied address!" size="small" />
          </Box>
        </Box>
        <Box className={cls.content}>
          <Typography color="textSecondary" gutterBottom>
            Total Funded
          </Typography>
          <Typography>{Web3.utils.fromWei(String(dao.totalFunded))} ETH</Typography>
        </Box>
        <Box className={cls.content}>
          <Typography color="textSecondary" gutterBottom>
            Tags
          </Typography>
          <Box className={cls.tag}>
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
        <Box className={cls.content}>
          <Typography color="textSecondary" gutterBottom>
            Website
          </Typography>
          <Typography>{dao.website}</Typography>
        </Box>
        <Box
          sx={{
            minHeight: "1rem",
          }}
        />
        <Box className={cls.content}>
          <Button
            fullWidth={true} className={status().className}
            disabled={dao.state == 2 ? false : true}
            onClick={() => { history.push(`/investment-dashboard?addr=${dao.address.toLowerCase()}`) }}
          >
            {status().text}
          </Button>
          <Box
            sx={{
              minWidth: "0.5rem",
            }}
          />
          <Button color="primary" variant="outlined" onClick={() => history.push(`/daos/${dao.address.toLowerCase()}`)}>
            Details
          </Button>
        </Box>
      </Box>
    </Box>
  );
}

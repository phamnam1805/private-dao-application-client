import {
  Avatar,
  Box,
  Collapse,
  Grid,
  Hidden,
  IconButton,
  makeStyles,
  Paper,
  Tooltip,
  Typography,
  useMediaQuery,
  useTheme,
} from "@material-ui/core";
import { useState } from "react";
import { FUNDING_STATE_ALIAS } from "src/configs/constance";
import ArrowAnimationIcon from "src/components/Icon/ArrowAnimationIcon";
import StatusChip from "../components/StatusChip";
import CopyIcon from "src/components/Icon/CopyIcon";
import Empty from "src/components/Icon/Empty";
import { formatAddress } from "src/services/utility";
import { web3Reader } from "src/wallet-connection";

const useStyle = makeStyles((theme) => ({
  campaignBox: {
    background: theme.palette.background.paper,
    borderRadius: "1rem",
    padding: "1.5rem",
    zIndex: 1000,
  },
  imageBox: {
    display: "flex",
    alignItems: "flex-start",
  },
  image: {
    width: 36,
    height: 36,
    marginRight: 8,
    marginTop: -6,
    [theme.breakpoints.down("xs")]: {
      width: 27,
      height: 27,
    },
  },
  collapse: {
    background: theme.palette.background.collapse,
    padding: "1rem 2rem ",
    marginTop: "-0.9rem",
    borderBottomLeftRadius: "10px",
    borderBottomRightRadius: "10px",
    borderBottom: "1px solid #00000029",
    // zIndex: 1,
    // boxShadow: "inset 0px 0px 0px #00000029",
  },
}));

function FundingResult({ daos, result, ...props }) {
  return (
    <Grid {...props} container alignItems="center">
      <Grid item xs={6}>
        <Typography variant="h6" color="primary">
          DAO Address
        </Typography>
      </Grid>
      <Grid item xs={6}>
        <Typography variant="h6" color="primary">
          Funded Amount
        </Typography>
      </Grid>
      <Grid item xs={12}>
        <Box sx={{ minHeight: "1rem" }}></Box>
      </Grid>
      {daos.map((e, i) => (
        <>
          <Grid item xs={6}>
            {formatAddress(daos[i], 8)}
            <CopyIcon
              copyText={daos[i]}
              defaultText="Copy address"
              successText="Copied address!"
              size="small"
              sx={{ margin: 0, padding: 0 }}
            />
          </Grid>
          <Grid item xs={6}>
            {`${web3Reader.utils.fromWei(String(result[i]))} ETH`}
          </Grid>
        </>
      ))}
    </Grid>
  );
}

export default function CampaignItem({ campaign, ...props }) {
  const cls = useStyle();
  const [open, setOpen] = useState(false);
  const onOpenCellClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setOpen(!open);
  };

  return (
    <div>
      <Box {...props} mb={2}>
        <Box className={cls.campaignBox}>
          <Grid container>
            <Grid item md={5} sm={12} container spacing={1}>
              <Grid item xs={12}>
                <Box className={cls.imageBox}>
                  <Typography variant="h5">{`Funding Round ${campaign.fundingRoundId}`}</Typography>
                </Box>
              </Grid>
              <Grid item xs={12} md={6}>
                <StatusChip status={FUNDING_STATE_ALIAS[campaign.state]} />
              </Grid>
              <Grid item xs={12} md={6}></Grid>
            </Grid>
            <Grid item md={3} xs={5} container>
              <Grid item xs={12}>
                <Box className={cls.imageBox}>
                  <Typography variant="h5">{"Total Funded"}</Typography>
                </Box>
              </Grid>
              <Grid item xs={12}>
                <Box className={cls.imageBox}>
                  <Typography>
                    {`${web3Reader.utils.fromWei(String(campaign.totalFunded))} ETH`}
                  </Typography>
                </Box>
              </Grid>
            </Grid>
            <Grid item md={3} xs={5} container>
              <Grid item xs={12}>
                <Box className={cls.imageBox}>
                  <Typography variant="h5">{"Number of DAOs"}</Typography>
                </Box>
              </Grid>
              <Grid item xs={12}>
                <Box className={cls.imageBox}>
                  <Typography>
                    {campaign.listDAO.length || 0}
                  </Typography>
                </Box>
              </Grid>
            </Grid>
            <Grid item sm={1} container direction="row-reverse" alignItems="center">
              {campaign.state == 4 && (
                <Box>
                  <IconButton onClick={(e) => onOpenCellClick(e)} style={{ marginTop: -12 }}>
                    <ArrowAnimationIcon color="primary" isTransform={open} />
                  </IconButton>
                </Box>
              )}
            </Grid>
          </Grid>
        </Box>
        {campaign.state == 4 && (
          <Collapse in={open} sx={{ zIndex: 1 }}>
            <FundingResult className={cls.collapse} daos={campaign.listDAO} result={campaign.result} />
          </Collapse>
        )}
      </Box>
    </div>
  );
}

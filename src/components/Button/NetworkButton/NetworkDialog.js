import { Box, Dialog, DialogContent, DialogTitle, List, ListItem, makeStyles, Typography } from "@material-ui/core";
import { useSnackbar } from "notistack";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import ETH from "src/assets/images/tokens/ETH.png";
import { THEME_MODE } from "src/configs/constance";
import { switchNetwork } from "src/wallet-connection/action";

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
    width: "25%",
    [theme.breakpoints.only("xs")]: {
      width: "50%",
    },
  },
  content: {
    padding: "20px",
  },
}));

const chainConfig = [
  { chainId: 1, image: ETH, name: "ETH Mainnet", width: "60px" },
  { chainId: 5, image: ETH, name: "Goerli Testnet", width: "60px" },
  { chainId: 11155111, image: ETH, name: "Sepolia Testnet", width: "60px" },
  { chainId: 31337, image: ETH, name: "Hardhat Local", width: "60px" },
];

export default function NetworkDialog({ open, handleClose }) {
  const cls = useStyle();
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();
  const history = useHistory();

  const changeNetwork = async (chainId) => {
    const isSwitchSuccess = await switchNetwork(dispatch, enqueueSnackbar, chainId);
    if (isSwitchSuccess) history.push("/daos");
    handleClose();
  };

  return (
    <Dialog
      PaperProps={{ elevation: 0, style: { maxWidth: 550, padding: "0px" } }}
      fullWidth
      open={open}
      onClose={handleClose}
    >
      <DialogTitle className={cls.title}>
        <Typography variant="h4">Select Network</Typography>
      </DialogTitle>
      <DialogContent className={cls.content}>
        <List style={{ display: "flex", flexWrap: "wrap" }} disablePadding>
          {chainConfig.map((item) => (
            <ListItem key={item.chainId} button className={cls.listItem} onClick={() => changeNetwork(item.chainId)}>
              <Box height={70}>
                <img src={item.image} height={50} alt={item.name} />
              </Box>
              <Typography noWrap variant="subtitle2">
                {item.name}
              </Typography>
            </ListItem>
          ))}
        </List>
      </DialogContent>
    </Dialog>
  );
}

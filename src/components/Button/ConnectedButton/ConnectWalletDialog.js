import { Box, Dialog, DialogContent, DialogTitle, List, ListItem, makeStyles, Typography } from "@material-ui/core";
import { useSnackbar } from "notistack";
import { useDispatch } from "react-redux";
import metamaskLogo from "src/assets/images/metamask.png";
import { WalletConnectIcon } from "src/components/Icon";
import { THEME_MODE } from "src/configs/constance";
import { connectMetamask, connectWalletConnect } from "src/wallet-connection/action";

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

const ConnectLink = ({ link, text }) => {
  return (
    <a href={link} target="_blank" rel="noreferrer" style={{ color: "#F3791C", textDecoration: "none" }}>
      {text}
    </a>
  );
};

export default function ConnectWalletDialog({ open, onClose }) {
  const cls = useStyle();
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();

  async function onMetamaskClick() {
    await connectMetamask(dispatch, enqueueSnackbar);
    onClose();
  }

  async function onWalletConnectClick() {
    await connectWalletConnect(dispatch, enqueueSnackbar);
    onClose();
  }

  return (
    <Dialog open={open} onClose={onClose} PaperProps={{ style: { padding: 0, maxWidth: 400 } }}>
      <DialogTitle className={cls.title}>
        <Box textAlign="center">
          <Typography variant="h4" className={cls.chooseText}>
            Choose Wallet
          </Typography>
          <Typography style={{ fontSize: "14px", fontWeight: "400", opacity: 0.65 }}>
            Safely connect to your existing blockchain wallet and directly stake tokens in them.
          </Typography>
        </Box>
      </DialogTitle>
      <DialogContent>
        <List disablePadding={true} style={{ display: "flex", justifyContent: "space-between" }}>
          <ListItem button onClick={onMetamaskClick} disabled={!window.ethereum} className={cls.listItem}>
            <img src={metamaskLogo} alt="metamask" className={cls.image} />
            <Typography noWrap variant="subtitle2" className={cls.chooseText}>
              Metamask
            </Typography>
          </ListItem>
          <ListItem button onClick={onWalletConnectClick} className={cls.listItem}>
            <WalletConnectIcon className={cls.image} />
            <Typography noWrap variant="subtitle2" className={cls.chooseText}>
              Wallet Connect
            </Typography>
          </ListItem>
        </List>
        <Box mt={2}>
          <Typography align="center" color="textSecondary" style={{ fontSize: "14px", fontWeight: "400" }}>
            By connecting, I accept The PAO&#39;s
            <br />
            <ConnectLink link="" text="Term of Service" />
            ,&nbsp;
            <ConnectLink link="" text="Privacy Policy" />, and&nbsp;
            <ConnectLink link="" text="Cookies Policy" />
          </Typography>
        </Box>
      </DialogContent>
    </Dialog>
  );
}

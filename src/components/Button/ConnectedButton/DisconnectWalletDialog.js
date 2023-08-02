import {
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Link,
  makeStyles,
  Typography,
} from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";
import LaunchIcon from "@material-ui/icons/Launch";
import { useSnackbar } from "notistack";
import { useDispatch, useSelector } from "react-redux";
import CopyIcon from "src/components/Icon/CopyIcon";
import { CONNECTOR } from "src/configs/connection-config";
import { THEME_MODE } from "src/configs/constance";
import useExplorerUrl from "src/hook/useExplorerUrl";
import { formatAddress } from "src/services/utility";
import { disconnect, getConnectedWallet } from "src/wallet-connection/action";

const useStyle = makeStyles((theme) => ({
  disconnectButton: {
    color: "rgb(234, 99, 99)",
  },
  title: {
    padding: "10px 20px 10px 20px",
    background: theme.palette.type === THEME_MODE.DARK ? "#4D2900" : "#F2F5F2",
  },
  content: {
    padding: "20px",
  },
  iconNewTab: {
    fontSize: "16px",
    marginLeft: "4px",
  },
}));

export default function DisconnectWalletDialog({ open, onClose }) {
  const cls = useStyle();
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();
  const { accountAddress } = useSelector((state) => state.accountDataSlice);
  const { link } = useExplorerUrl(accountAddress);

  const onDisconnectWalletClick = () => {
    disconnect(dispatch, enqueueSnackbar);
    onClose();
  };

  return (
    <Dialog PaperProps={{ elevation: 0, style: { maxWidth: 350, padding: "0px" } }} fullWidth open={open}>
      <DialogTitle className={cls.title}>
        <Box display="flex" justifyContent="space-between">
          <Typography variant="h4">Wallet Connection</Typography>
          <IconButton size="small" onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>
      <DialogContent className={cls.content}>
        <Typography>
          {`Connected with ${getConnectedWallet() === CONNECTOR.METAMASK ? "MetaMask" : "WalletConnect"}`}
        </Typography>
        <Box display="flex" alignItems="center">
          <Typography variant="h5">{formatAddress(accountAddress, 6)}</Typography>
          <CopyIcon copyText={accountAddress} defaultText="Copy address" successText="Copied address!" size="small" />
        </Box>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Link style={{ fontSize: "14px", fontWeight: 400 }} href={link} target="_blank" rel="noreferrer noopener">
            <Box display="flex" alignItems="center">
              <Typography>View on Explorer</Typography>
              <LaunchIcon className={cls.iconNewTab} />
            </Box>
          </Link>
          <Button
            variant="outlined"
            color="inherit"
            className={cls.disconnectButton}
            onClick={onDisconnectWalletClick}
            size="small"
          >
            Disconnect
          </Button>
        </Box>
      </DialogContent>
    </Dialog>
  );
}

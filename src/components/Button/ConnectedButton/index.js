import { Button } from "@material-ui/core";
import { useState } from "react";
import { useSelector } from "react-redux";
import DisconnectWalletDialog from "./DisconnectWalletDialog";
import ConnectWalletDialog from "./ConnectWalletDialog";
import { formatAddress } from "src/services/utility";
import { ConnectedWalletIcon, DisconnectedWalletIcon } from "src/components/Icon";

export default function ConnectButton({ ...props }) {
  const { accountAddress } = useSelector((state) => state.accountDataSlice);

  const [isOpenConnectModal, setIsOpenConnectModal] = useState(false);
  const [isOpenDisconnectModal, setIsOpenDisconnectModal] = useState(false);

  function hdClickConnectWallet() {
    if (!accountAddress) setIsOpenConnectModal(true);
    else setIsOpenDisconnectModal(true);
  }

  return (
    <>
      <Button
        {...props}
        variant="contained"
        color="primary"
        onClick={hdClickConnectWallet}
        startIcon={accountAddress ? <ConnectedWalletIcon /> : <DisconnectedWalletIcon />}
      >
        {accountAddress ? formatAddress(accountAddress, 4) : "Connect Wallet"}
      </Button>
      <ConnectWalletDialog open={isOpenConnectModal} onClose={() => setIsOpenConnectModal(false)} />
      <DisconnectWalletDialog open={isOpenDisconnectModal} onClose={() => setIsOpenDisconnectModal(false)} />
    </>
  );
}

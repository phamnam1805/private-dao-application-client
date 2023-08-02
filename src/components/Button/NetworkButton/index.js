import { Button } from "@material-ui/core";
import { useState } from "react";
import { useSelector } from "react-redux";
import { CHAINS } from "src/configs/connection-config";
import NetworkDialog from "./NetworkDialog";

export default function NetworkButton({ ...props }) {
  const [open, setOpen] = useState(false);
  const { chainId } = useSelector((state) => state.configSlice);

  return (
    <>
      <Button
        {...props}
        color="primary"
        variant="outlined"
        style={{ minWidth: "150px", ...props?.style }}
        onClick={() => setOpen(true)}
      >
        {CHAINS?.[chainId]?.name || "Disconnected"}
      </Button>
      <NetworkDialog open={open} handleClose={() => setOpen(false)} />
    </>
  );
}

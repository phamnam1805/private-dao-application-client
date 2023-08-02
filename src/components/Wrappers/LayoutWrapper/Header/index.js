import { Box, makeStyles, useMediaQuery } from "@material-ui/core";
import MenuOutlinedIcon from "@material-ui/icons/MenuOutlined";
import { useState } from "react";
import ConnectButton from "src/components/Button/ConnectedButton";
import NetworkButton from "src/components/Button/NetworkButton";
import { PAOLogo } from "src/components/Icon/PAOLogo";
import { THEME_MODE } from "src/configs/constance";
import SmallScreenDrawer from "./SmallScreenDrawer";

const useStyle = makeStyles((theme) => ({
  root: {
    height: 65,
    display: "flex",
    alignItems: "center",
    position: "sticky",
    top: 0,
    padding: "0rem 3rem",
    justifyContent: "space-between",
    backgroundColor: theme.palette.type === THEME_MODE.DARK ? "#391902" : "#391902",
  },
}));

export default function Header({ isBlur }) {
  const cls = useStyle();
  const [open, setOpen] = useState(false);
  const xsOnly = useMediaQuery((theme) => theme.breakpoints.only("xs"));
  const smDown = useMediaQuery((theme) => theme.breakpoints.down("sm"));

  return (
    <Box className={cls.root} style={isBlur ? { opacity: 0.1 } : {}}>
      <Box display="flex" alignItems="center">
        {smDown && (
          <Box display="flex" alignItems="center">
            <MenuOutlinedIcon onClick={() => setOpen(true)} style={{ marginRight: "0.5rem" }} />
            {xsOnly ? <PAOLogo /> : <PAOLogo />}
          </Box>
        )}
      </Box>
      <Box display="flex" alignItems="center">
        {!xsOnly && <NetworkButton style={{ marginRight: "0.5rem" }} />}
        <ConnectButton />
      </Box>
      <SmallScreenDrawer open={open} onClose={() => setOpen(false)} />
    </Box>
  );
}

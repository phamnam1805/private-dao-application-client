import { Box, makeStyles, useMediaQuery } from "@material-ui/core";
import clsx from "clsx";
import { useSnackbar } from "notistack";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import ScrollToTop from "src/components/ScrollToTop";
import { CONNECTOR } from "src/configs/connection-config";
import { fetchConfig } from "src/redux/configSlice";
import { setWeb3Reader } from "src/wallet-connection";
import { connectMetamask, getConnectedWallet } from "src/wallet-connection/action";
import Footer from "./Footer";
import Header from "./Header";
import Sidebar from "./Sidebar";

const useStyle = makeStyles((theme) => ({
  baseLayout: {
    [theme.breakpoints.up("md")]: {
      marginLeft: 100,
    },
  },
}));

export default function LayoutWrapper({ children }) {
  const cls = useStyle();
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();
  const mdUp = useMediaQuery((theme) => theme.breakpoints.up("md"));

  useEffect(async () => {
    await setWeb3Reader();
    dispatch(fetchConfig(enqueueSnackbar)).then(() => {
      const wallet = getConnectedWallet();
      if (wallet === CONNECTOR.METAMASK) connectMetamask(dispatch, enqueueSnackbar);
    });
  }, []);

  const isBlur = false;

  return (
    <Box position="relative">
      {mdUp && <Sidebar />}
      <Box className={clsx({ [cls.baseLayout]: true })}>
        <Header isBlur={isBlur} />
        <Box
          display="flex"
          flexDirection="column"
          justifyContent="space-between"
          style={{ minHeight: "calc(100vh - 80px)" }}
        >
          <Box>{children}</Box>
          {/* <Footer isBlur={isBlur} /> */}
        </Box>
      </Box>
      <ScrollToTop />
    </Box>
  );
}

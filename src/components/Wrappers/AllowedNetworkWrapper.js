import { Box, Paper } from "@material-ui/core";
import { useMemo } from "react";
import { useSelector } from "react-redux";
import TitleTypography from "../Typography/TitleTypography";

export default function AllowedNetworkWrapper({ allowedNetworks, helperText, children, ...props }) {
  const { chainId } = useSelector((state) => state.configSlice);

  return (
    <Box {...props}>
      {useMemo(() => {
        if (allowedNetworks.includes(Number(chainId))) return <>{children}</>;
        else
          return (
            <Paper>
              <TitleTypography textProps={{ variant: "h5" }} title={helperText} p={1} />
            </Paper>
          );
      }, [chainId, allowedNetworks, children])}
    </Box>
  );
}

import { Box, Typography } from "@material-ui/core";
import ErrorOutlinedIcon from "@material-ui/icons/ErrorOutlined";

export default function ErrorIconBox({ des, ...props }) {
  return (
    <Box display="flex" justifyContent="center" alignItems="center" {...props}>
      <ErrorOutlinedIcon color="error" style={{ marginRight: 1 }} />
      {des && <Typography color="error">{des}</Typography>}
    </Box>
  );
}

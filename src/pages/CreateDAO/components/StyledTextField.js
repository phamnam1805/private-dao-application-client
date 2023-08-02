import { Box, makeStyles, TextField, Typography, Zoom } from "@material-ui/core";
import InfoIcon from "src/components/Icon/InfoIcon";

const useStyle = makeStyles(() => ({
  textField: {
    marginRight: "4px",
    "& .MuiFormHelperText-root": {
      display: "none",
    },
  },
  helperText: {
    fontSize: "12px",
    fontWeight: 400,
    color: "#f44336",
  },
}));

export default function StyledTextField({ info, textProps, rootProps }) {
  const cls = useStyle();

  return (
    <Box width="100%" display="flex" flexDirection="column" {...rootProps}>
      <Box width="100%" display="flex" alignItems="center">
        <TextField size="small" variant="outlined" className={cls.textField} {...textProps} />
        {info && <InfoIcon TransitionComponent={Zoom} title={info} />}
      </Box>
      {textProps?.helperText && <Typography className={cls.helperText}>{textProps?.helperText}</Typography>}
    </Box>
  );
}

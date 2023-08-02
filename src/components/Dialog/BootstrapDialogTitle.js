import { Box, IconButton, makeStyles, Typography } from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";

const useStyle = makeStyles((theme) => ({
  root: {
    borderRadius: "22px 22px 0px 0px",
    padding: "0.75rem",
  },
  disabled: {
    color: theme.palette.text.disabled,
  },
  hint: {
    color: theme.palette.text.hint,
  },
  imgHeader: {
    width: 28,
    height: 28,
    verticalAlign: "text-top",
    marginLeft: "0.25rem",
  },
}));

export default function BootstrapDialogTitle(props) {
  const cls = useStyle();
  const { actionName, hdClose } = props;

  return (
    <Box display="flex" justifyContent="space-between" alignItems="center" className={cls.root}>
      <Typography variant="h6" className={cls.disabled}>
        {actionName}
      </Typography>
      <IconButton size="small" onClick={hdClose}>
        <CloseIcon className={cls.hint} />
      </IconButton>
    </Box>
  );
}

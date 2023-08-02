import {
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  makeStyles,
  Paper,
  Typography,
  useMediaQuery,
} from "@material-ui/core";
import clsx from "clsx";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import { resetCreateDAOData } from "src/redux/createDAODataSlice";

const useStyle = makeStyles((theme) => ({
  stepText: {
    color: theme.palette.text.hint,
  },
  confirmBut: {
    marginBottom: "10px",
    width: "150px",
    [theme.breakpoints.down("sm")]: {
      width: "100%",
    },
  },
  paper: {
    filter: "blur(4px)",
    cursor: "not-allowed",
  },
}));

export default function BaseStep({ children, des, butProps, boxButProps, ...props }) {
  const cls = useStyle();
  const [open, setOpen] = useState(false);
  const mdDown = useMediaQuery((theme) => theme.breakpoints.down("md"));
  const dispatch = useDispatch();
  const history = useHistory();

  async function onConfirmCancelClick() {
    setOpen(false);
    dispatch(resetCreateDAOData());
    history.push("/daos");
  }

  return (
    <>
      <Paper
        {...props}
        style={{ borderBottomLeftRadius: 0, borderBottomRightRadius: 0, padding: "1rem 0rem 0rem 1.5rem" }}
      >
        {mdDown && (
          <Typography className={cls.stepText} variant="subtitle2">
            {des}
          </Typography>
        )}
      </Paper>
      <Paper
        {...props}
        style={{ borderTopLeftRadius: 0, borderTopRightRadius: 0, ...props?.style }}
        className={clsx({ [cls.paper]: props?.isBlur }, props?.className)}
      >
        {children}
        <Box display="flex" justifyContent="flex-end" mt={2} {...boxButProps}>
          <Button
            variant="outlined"
            color="primary"
            className={cls.confirmBut}
            style={{ marginRight: "0.5rem" }}
            onClick={() => setOpen(true)}
          >
            Cancel
          </Button>
          <Button variant="contained" color="primary" className={cls.confirmBut} {...butProps}>
            {butProps?.text ?? "Confirm"}
          </Button>
        </Box>
      </Paper>
      <Dialog PaperProps={{ elevation: 0, style: { maxWidth: 350, padding: "0px" } }} fullWidth open={open}>
        <DialogTitle>Cancel Confirm</DialogTitle>
        <DialogContent>
          <Typography>Are you sure cancel your progress?. You will loss all data when press confirm button.</Typography>
          <Box display="flex" justifyContent="flex-end">
            <Button variant="outlined" color="primary" style={{ marginRight: "0.5rem" }} onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="outlined"
              color="inherit"
              style={{ color: "rgb(234, 99, 99)" }}
              onClick={() => onConfirmCancelClick()}
            >
              Confirm
            </Button>
          </Box>
        </DialogContent>
      </Dialog>
    </>
  );
}

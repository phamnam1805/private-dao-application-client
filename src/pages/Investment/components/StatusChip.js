import { makeStyles } from "@material-ui/core";

const useStyle = makeStyles((theme) => ({
  root: {
    display: "inline-flex",
    width: "fit-content",
    height: "29px",
    paddingRight: "10px",
    alignItems: "center",
    justifyContent: "left",
    borderRadius: "5px",
    textTransform: "capitalize",
  },
  status_dot: {
    display: "inline-block",
    width: "8px",
    height: "8px",
    borderRadius: "50%",
    margin: "0px 10px",
  },
  status_text: {
    fontWeight: "400",
    fontSize: "16px",
  },
  chip_active: {
    background: theme.palette.success.light,
    color: theme.palette.success.main,
    status_dot: {
      background: theme.palette.success.main,
    },
  },
  chip_pending: {
    background: theme.palette.warning.light,
    color: theme.palette.warning.main,
    status_dot: {
      background: theme.palette.warning.main,
    },
  },
  chip_tallying: {
    background: theme.palette.success.light,
    color: theme.palette.success.main,
    status_dot: {
      background: theme.palette.success.main,
    },
  },
  chip_queued: {
    background: theme.palette.info.light,
    color: theme.palette.info.main,
    status_dot: {
      background: theme.palette.info.main,
    },
  },
  chip_finalized: {
    background: theme.palette.info.light,
    color: theme.palette.info.main,
    status_dot: {
      background: theme.palette.info.main,
    },
  },
  chip_succeeded: {
    background: theme.palette.info.light,
    color: theme.palette.info.main,
    status_dot: {
      background: theme.palette.info.main,
    },
  },
  chip_failed: {
    background: theme.palette.error.light,
    color: theme.palette.error.main,
    status_dot: {
      background: theme.palette.error.main,
    },
  },
}));

export default function StatusChip({ status }) {
  const cls = useStyle();
  const className = (_status) => {
    return cls[`chip_${_status.toString().toLowerCase()}`];
  };
  return (
    <span className={cls.root}>
      <div className={className(status)} style={{ padding: "3px 5px", borderRadius: 6 }}>
        <span className="status_dot" />
        <span className="status_text">{status}</span>
      </div>
    </span>
  );
}

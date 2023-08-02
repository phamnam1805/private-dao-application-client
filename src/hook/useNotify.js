import { useSnackbar } from "notistack";

export const ERR_TOP_CENTER = { variant: "error", anchorOrigin: { vertical: "top", horizontal: "center" } };
export const WARNING_TOP_CENTER = { variant: "warning", anchorOrigin: { vertical: "top", horizontal: "center" } };
export const INFO_TOP_CENTER = { variant: "info", anchorOrigin: { vertical: "top", horizontal: "center" } };
export const SUCCESS_TOP_CENTER = { variant: "success", anchorOrigin: { vertical: "top", horizontal: "center" } };

export function successNotify(enqueueSnackbar, message) {
  enqueueSnackbar(message, SUCCESS_TOP_CENTER);
}

export function infoNotify(enqueueSnackbar, message) {
  enqueueSnackbar(message, INFO_TOP_CENTER);
}

export function warnNotify(enqueueSnackbar, message) {
  enqueueSnackbar(message, WARNING_TOP_CENTER);
}

export function errorNotify(enqueueSnackbar, message) {
  enqueueSnackbar(message, ERR_TOP_CENTER);
}

export default function useNotify() {
  const { enqueueSnackbar } = useSnackbar();

  const errorNotify = (message) => {
    enqueueSnackbar(message, ERR_TOP_CENTER);
  };

  const successNotify = (message) => {
    enqueueSnackbar(message, SUCCESS_TOP_CENTER);
  };

  const infoNotify = (message) => {
    enqueueSnackbar(message, INFO_TOP_CENTER);
  };

  const warnNotify = (message) => {
    enqueueSnackbar(message, WARNING_TOP_CENTER);
  };

  return { errorNotify, successNotify, infoNotify, warnNotify };
}

import { Box, makeStyles } from "@material-ui/core";
import { THEME_MODE } from "src/configs/constance";
import { BorderCircle, ErrorYellowIcon, FinishStepIcon } from "../Icon";
import { LoadingIconBox } from "../Icon/LoadingIcon";

const useStyle = makeStyles((theme) => ({
  finishBox: {
    width: 25,
    height: 25,
    backgroundColor: "#FFFFFF",
    borderRadius: "50%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    boxShadow: "0px 3px 4px #0000001F",
  },
  icon: {
    width: 30,
    height: 30,
    color: "#52B95F",
  },
  loadingBox: {
    width: 30,
    height: 30,
    backgroundColor: theme.palette.background.default,
    borderRadius: "50%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  futureIcon: {
    color: theme.palette.background.paper,
  },
  errorBox: {
    border: "1px solid #FF9300",
    width: 30,
    height: 30,
    borderRadius: "50%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: theme.palette.background.paper,
  },
}));

export const FinishIconStep = () => {
  const cls = useStyle();

  return (
    <Box className={cls.finishBox}>
      <FinishStepIcon className={cls.icon} />
    </Box>
  );
};

export const LoadingStepIcon = () => {
  const cls = useStyle();

  return <LoadingIconBox className={cls.loadingBox} iconProps={{ size: 30 }} />;
};

export const FutureStepIcon = () => {
  const cls = useStyle();

  return <BorderCircle style={{ width: 30, height: 30 }} className={cls.futureIcon} />;
};

export const ErrorStepIcon = () => {
  const cls = useStyle();

  return (
    <Box className={cls.errorBox}>
      <ErrorYellowIcon style={{ width: 30, height: 30 }} />
    </Box>
  );
};

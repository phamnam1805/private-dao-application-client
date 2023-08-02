import {
  Box,
  makeStyles,
  Step,
  StepConnector,
  StepContent,
  StepLabel,
  Stepper,
  styled,
  Typography,
  useMediaQuery,
} from "@material-ui/core";
import { StepStatus } from "src/redux/createDAODataSlice";
import { ErrorStepIcon, FinishIconStep, FutureStepIcon, LoadingStepIcon } from "./StepIcon";

const ColorStepIconRoot = styled("div")(({ ownerState }) => ({
  zIndex: 1,
  color: "#FFFFFF",
  width: 30,
  height: 30,
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  borderRadius: "50%",
  cursor: "pointer",
  ...(ownerState.active && {}),
  ...(ownerState.completed && {}),
}));

const useStyle = makeStyles((theme) => ({
  stepRoot: {
    background: "transparent",
    "& .MuiStepConnector-active .MuiStepConnector-lineHorizontal": {
      borderColor: `${theme.palette.text.secondary}`,
      borderStyle: "dashed",
      borderWidth: 0.8,
    },
    "& .MuiStepConnector-completed .MuiStepConnector-lineHorizontal": {
      borderColor: `${theme.palette.text.secondary}`,
      borderStyle: "solid",
      borderWidth: 0.8,
    },
    "& .MuiStepConnector-lineHorizontal": {
      borderColor: `${theme.palette.text.secondary}`,
      borderStyle: "dashed",
      borderWidth: 0.8,
    },
    "& .MuiStepConnector-active .MuiStepConnector-lineVertical": {
      borderLeftColor: `${theme.palette.text.secondary}`,
      borderLeftStyle: "dashed",
      marginLeft: 2,
    },
    "& .MuiStepConnector-completed .MuiStepConnector-lineVertical": {
      borderLeftColor: `${theme.palette.text.secondary}`,
      borderLeftStyle: "solid",
      marginLeft: 2,
    },
    "& .MuiStepConnector-lineVertical": {
      borderLeftColor: `${theme.palette.text.secondary}`,
      borderLeftStyle: "dashed",
      marginLeft: 2,
    },
  },
  stepText: {
    color: theme.palette.text.hint,
  },
}));

export default function PAOStepper({ activeStep, activeStatus, stepCount, event, des }) {
  const cls = useStyle();
  const mdDown = useMediaQuery((theme) => theme.breakpoints.down("md"));

  function ColorStepIcon(props) {
    const { active, completed, className } = props;
    const index = Number(props.icon) - 1;

    return (
      <ColorStepIconRoot ownerState={{ completed, active }} className={className}>
        {(() => {
          if (index < activeStep) return <FinishIconStep />;
          else if (index === activeStep) {
            if (activeStatus === StepStatus.INIT) return <FutureStepIcon />;
            else if (activeStatus === StepStatus.LOADING) return <LoadingStepIcon />;
            else if (activeStatus === StepStatus.ERROR) return <ErrorStepIcon />;
            else if (activeStatus === StepStatus.FINISH) return <FinishIconStep />;
          } else return <FutureStepIcon />;
        })()}
      </ColorStepIconRoot>
    );
  }

  return (
    <Box width={mdDown ? "100%" : undefined}>
      <Stepper
        nonLinear
        alternativeLabel={mdDown}
        connector={<StepConnector />}
        orientation={mdDown ? "horizontal" : "vertical"}
        activeStep={activeStep}
        classes={{ root: cls.stepRoot }}
      >
        {Array(stepCount)
          .fill(0)
          .map((_, index) => {
            const stepProps = { completed: false };
            const labelProps = { completed: false };
            if (index < activeStep) {
              stepProps.completed = true;
              labelProps.completed = true;
            }
            return (
              <Step
                key={index}
                completed={Number(activeStep) >= index + 1}
                onClick={() => {
                  if (event.stepClick) event.stepClick(index);
                }}
              >
                <StepLabel StepIconComponent={ColorStepIcon}>
                  <Box display="flex" alignItems="center" justifyContent={mdDown ? "center" : undefined}>
                    <Typography className={cls.stepText} style={{ whiteSpace: "nowrap" }}>{`Step ${index + 1
                      }`}</Typography>
                    {!mdDown && (
                      <Typography
                        className={cls.stepText}
                        variant={activeStep >= index + 1 ? "subtitle2" : undefined}
                        style={{ marginLeft: 30 }}
                      >
                        {!mdDown && des[index]}
                      </Typography>
                    )}
                  </Box>
                </StepLabel>
                {!mdDown && <StepContent></StepContent>}
              </Step>
            );
          })}
      </Stepper>
    </Box>
  );
}

import { Box, makeStyles, useMediaQuery } from "@material-ui/core";
import clsx from "clsx";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import PAOStepper from "src/components/PAOStepper";
import { updateCreateDAOData } from "src/redux/createDAODataSlice";
import FirstStep from "./FirstStep";
import SecondStep from "./SecondStep";

const useStyle = makeStyles(() => ({
  stepForm: {
    marginTop: 0,
  },
  inactiveStepForm: {
    display: "none",
  },
}));

export default function CreateDAOLayout() {
  const cls = useStyle();
  const mdDown = useMediaQuery((theme) => theme.breakpoints.down("md"));
  const dispatch = useDispatch();

  const { activeStep, activeStatus, selectedStep } = useSelector((state) => state.createDAODataSlice);

  function onStepClick(index) {
    dispatch(updateCreateDAOData({ selectedStep: index }));
  }

  function beforeunload(e) {
    e.preventDefault();
    e.returnValue = true;
  }

  useEffect(() => {
    window.addEventListener("beforeunload", beforeunload);
    return function cleanup() {
      window.removeEventListener("beforeunload", beforeunload);
    };
  }, []);

  return (
    <Box display="flex" flexDirection={mdDown ? "column" : "row"}>
      <PAOStepper
        activeStep={activeStep}
        activeStatus={activeStatus}
        stepCount={2}
        event={{ stepClick: onStepClick }}
        des={["Provide basic information", "Set up configuration"]}
      />
      <Box sx={{ minWidth: "6rem" }}></Box>
      <Box flexGrow={1}>
        <FirstStep
          des="Provide basic information"
          className={clsx(cls.stepForm, { [cls.inactiveStepForm]: selectedStep != 0 })}
        />
        <SecondStep
          // isBlur={activeStep < 1}
          des="Set up configuration"
          className={clsx(cls.stepForm, { [cls.inactiveStepForm]: selectedStep != 1 })}
        />
      </Box>
    </Box>
  );
}

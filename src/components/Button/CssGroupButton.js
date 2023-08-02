import { Button, ButtonGroup, withStyles } from "@material-ui/core";
import clsx from "clsx";
import { useState } from "react";
import { THEME_MODE } from "src/configs/constance";

const CssButtonGroup = withStyles((theme) => ({
  root: {
    border: `1px solid ${theme.palette.type === THEME_MODE.DARK ? "#263343" : "#7994C1"}`,
    backgroundColor: theme.palette.type === THEME_MODE.DARK ? "#131C23" : "#E6EBF4",
    borderRadius: "6px",
    overflow: "hidden",
  },
}))(ButtonGroup);

const CssButton = withStyles(() => ({
  root: {
    border: "none",
  },
}))(Button);

const CssActiveButton = withStyles(() => ({
  root: {
    color: "#FFFFFF",
    backgroundColor: "#7994C1",
    "&:hover": {
      backgroundColor: "#7994C1",
    },
  },
}))(CssButton);

export default function CssGroupButton({ config = [], events, defaultActive = 0, activeBut, but, ...props }) {
  const [active, setActive] = useState(defaultActive);

  return (
    <CssButtonGroup {...props}>
      {config.map((element, index) => {
        return active == index ? (
          <CssActiveButton
            key={index}
            onClick={() => {
              if (events?.onClick) events.onClick(element, index);
              setActive(index);
            }}
            {...{ ...activeBut, ...but }}
            className={clsx(activeBut?.className, but?.className)}
          >
            {element.label}
          </CssActiveButton>
        ) : (
          <CssButton
            key={index}
            onClick={() => {
              if (events?.onClick) events.onClick(element, index);
              setActive(index);
            }}
            {...but}
          >
            {element.label}
          </CssButton>
        );
      })}
    </CssButtonGroup>
  );
}

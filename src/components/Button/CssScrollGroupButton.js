import { Box, IconButton, makeStyles } from "@material-ui/core";
import NavigateBeforeIcon from "@material-ui/icons/NavigateBefore";
import NavigateNextIcon from "@material-ui/icons/NavigateNext";
import { useState } from "react";
import CssGroupButton from "./CssGroupButton";

const useStyle = makeStyles(() => ({
  icon: {
    fontSize: "55px",
    zIndex: 100,
  },
  navigateBox: {
    width: "100%",
    height: "100%",
  },
}));

export default function CssScrollGroupButton({ isScroll = true, size = 50, ...props }) {
  const cls = useStyle();
  const defaultActive = props?.defaultActive ?? 0;
  const defaultTransform = defaultActive <= 1 ? 0 : defaultActive - 1;
  const [transform, setTransform] = useState(-defaultTransform * size * 2);
  const maxTranslate = (props.config.length - 2) * size * 2;
  const scrollStyles = isScroll
    ? { minWidth: `${size}%`, transform: `translateX(${transform}%)`, transitionDuration: "0.5s" }
    : {};

  function onBeforeClick() {
    if (transform < 0) setTransform(transform + size * 2);
  }

  function onNextClick() {
    if (transform > -maxTranslate) setTransform(transform - size * 2);
  }

  return (
    <Box position="relative">
      {isScroll && (
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          position="absolute"
          className={cls.navigateBox}
        >
          <IconButton onClick={() => onBeforeClick()}>
            {transform < 0 && <NavigateBeforeIcon className={cls.icon} />}
          </IconButton>
          <IconButton onClick={() => onNextClick()}>
            {transform > -maxTranslate && <NavigateNextIcon className={cls.icon} />}
          </IconButton>
        </Box>
      )}
      <CssGroupButton {...props} but={{ ...props?.but, style: { ...props?.style, ...scrollStyles } }} />
    </Box>
  );
}

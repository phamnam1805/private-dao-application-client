import { Box, makeStyles, TextField, Typography } from "@material-ui/core";
import { useMemo } from "react";

const useStyle = makeStyles(() => ({
  box: {
    border: "1px solid rgb(126, 148, 189, 0.5)",
    borderRadius: "5px",
    height: "24px",
  },
  absoluteBox: {
    top: 0,
    bottom: 0,
    right: 0,
    left: 0,
  },
  percentBox: {
    display: "flex",
    justifyContent: "flex-end",
    padding: "4px 10px 0px 10px",
  },
  input: {
    width: "100%",
    height: "28px",
    opacity: 0,
    cursor: "pointer",
  },
  textLabel: {
    fontSize: "14px",
  },
}));

export default function CssRangeSlider({ min = 0, max = 100, value, onChange, defaultValue = 0, mask = [], ...props }) {
  const cls = useStyle();
  const realMask = useMemo(() => {
    if (mask[0]["percent"] == 0) mask = mask.slice(1);
    const len = mask.length;
    if (mask[len - 1]["percent"] == 1) mask = mask.slice(0, len - 1);
    return mask;
  }, [mask]);

  const realValue = value > max ? max : value;

  function onInput(e) {
    const realPercent = e.target.value / 100;
    if (onChange) onChange(e, realPercent);
  }

  function onSliderClick(e, percent) {
    if (onChange) onChange(e, percent);
  }

  return (
    <Box position="relative" className={cls.box} {...props} mt={2}>
      <Box display="flex" position="absolute" className={cls.absoluteBox}>
        <div
          style={{
            backgroundColor: "rgb(126, 148, 189, 0.5)",
            flex: realValue,
            borderTopLeftRadius: "4px",
            borderBottomLeftRadius: "4px",
          }}
        />
        <div
          style={{
            flex: max - realValue,
            backgroundColor: "transparent",
            borderTopRightRadius: "4px",
            borderBottomRightRadius: "4px",
          }}
        />
      </Box>
      <Box display="flex" position="absolute" className={cls.absoluteBox}>
        <Box className={cls.percentBox} flex={0} onClick={(e) => onSliderClick(e, 0)}>
          <Typography className={cls.textLabel} color="textSecondary">
            0%
          </Typography>
        </Box>
        {realMask.map((item, index) => {
          if (index == 0)
            return (
              <Box
                key={index}
                className={cls.percentBox}
                flex={item.percent}
                onClick={(e) => onSliderClick(e, item.percent)}
              >
                <Typography className={cls.textLabel} color="textSecondary">
                  {item.label}
                </Typography>
              </Box>
            );
          else
            return (
              <Box
                key={index}
                className={cls.percentBox}
                flex={item.percent - realMask[index - 1].percent}
                onClick={(e) => onSliderClick(e, item.percent)}
              >
                <Typography className={cls.textLabel} color="textSecondary">
                  {item.label}
                </Typography>
              </Box>
            );
        })}
        <Box
          className={cls.percentBox}
          flex={1 - realMask[realMask.length - 1].percent}
          onClick={(e) => onSliderClick(e, 1)}
        >
          <Typography className={cls.textLabel} color="textSecondary">
            100%
          </Typography>
        </Box>
      </Box>
      <TextField
        type="range"
        min={min}
        max={max}
        defaultValue={defaultValue}
        value={value}
        onInput={(e) => onInput(e)}
        style={{ width: "100%", height: "100%", opacity: 0, cursor: "pointer" }}
      />
    </Box>
  );
}

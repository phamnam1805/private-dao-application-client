import { Box, makeStyles, Typography } from "@material-ui/core";
import clsx from "clsx";
import { useEffect, useState } from "react";

const useStyle = makeStyles((theme) => ({
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
    justifyContent: "center",
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
    cursor: "pointer",
    color: theme.palette.text.secondary,
  },
  textSelectedLabel: {
    fontSize: "14px",
    cursor: "pointer",
    fontWeight: 700,
    color: theme.palette.text.hint,
  },
}));

export default function RangSlider({ value, onChange, mask = [], ...props }) {
  const cls = useStyle();
  const [selected, setSelected] = useState("");

  useEffect(() => {
    setSelected(value);
  }, [value]);

  function onSliderClick(e, percent) {
    if (onChange) {
      onChange(e, percent);
      setSelected(percent);
    }
  }

  return (
    <Box position="relative" className={cls.box} {...props} mt={2}>
      <Box display="flex" position="absolute" className={cls.absoluteBox}>
        {mask.map((item, index) => {
          return (
            <Box key={index} className={cls.percentBox} flex={1}>
              <Typography
                className={clsx({
                  [cls.textLabel]: selected != item.percent,
                  [cls.textSelectedLabel]: selected == item.percent,
                })}
                onClick={(e) => onSliderClick(e, item.percent)}
              >
                {item.label}
              </Typography>
            </Box>
          );
        })}
      </Box>
    </Box>
  );
}

import { Box, List, ListItem, makeStyles, Popover, Typography, withStyles } from "@material-ui/core";
import { useEffect, useMemo, useRef, useState } from "react";
import { THEME_MODE } from "src/configs/constance";
import ArrowAnimationIcon from "../Icon/ArrowAnimationIcon";

const CssBox = withStyles((theme) => ({
  root: {
    padding: "0.5rem",
    borderRight: `1px solid ${theme.palette.type === THEME_MODE.DARK ? "#433026" : "#C1A779"}`,
    borderRadius: "6px",
    cursor: "pointer",
    boxShadow: "0px 2px 1px #0000029",
    display: "inline-flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
}))(Box);

const useStyle = makeStyles((theme) => ({
  text: {
    color: theme.palette.text.hint,
    fontSize: "14px",
    fontWeight: 500,
  },
}));

export default function CssSelector({ config = [], defaultSelectedItem, value, event, ...props }) {
  const cls = useStyle();
  const rootRef = useRef(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const id = open ? "css-selector-popover" : undefined;

  const [selectedItem, setSelectedItem] = useState(defaultSelectedItem);

  useEffect(() => {
    if (!selectedItem?.label) setSelectedItem(defaultSelectedItem);
  }, [defaultSelectedItem]);

  const rootWidth = useMemo(() => {
    if (rootRef?.current) return rootRef.current.offsetWidth;
    else return "auto";
  }, [rootRef?.current?.offsetWidth]);

  function onChooseItem(e, selectedItem) {
    setSelectedItem(selectedItem);
    if (event?.onChooseItem) event.onChooseItem(e, selectedItem);
    setAnchorEl(null);
  }

  return (
    <>
      <CssBox {...props} ref={rootRef} onClick={(event) => setAnchorEl(event.currentTarget)}>
        <Typography className={cls.text}>{value ?? selectedItem?.label}</Typography>
        <ArrowAnimationIcon
          className={cls.text}
          fontSize="small"
          isTransform={open}
          style={{ marginLeft: "0.25rem" }}
        />
      </CssBox>
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={() => setAnchorEl(null)}
        PaperProps={{ style: { padding: "0 0.25rem" } }}
      >
        <List style={{ width: rootWidth }}>
          {config.map((item, _) => {
            return (
              <ListItem
                key={item.id}
                button
                onClick={(event) => onChooseItem(event, item)}
                style={{ borderRadius: "6px" }}
              >
                {item.label}
              </ListItem>
            );
          })}
        </List>
      </Popover>
    </>
  );
}

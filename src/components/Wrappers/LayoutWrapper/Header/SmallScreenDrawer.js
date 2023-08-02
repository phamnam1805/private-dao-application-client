import { Box, Drawer, List, ListItem, makeStyles, Typography, useMediaQuery } from "@material-ui/core";
import { ArrowBack, ArrowForward, MenuOpen } from "@material-ui/icons";
import clsx from "clsx";
import { useMemo, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import NetworkButton from "src/components/Button/NetworkButton";
import { FlexibleLinkItem } from "src/components/Wrappers/LayoutWrapper/FlexibleLink";
import { LayoutConfig, LinkType, THEME_MODE } from "src/configs/constance";
import EcosystemList from "../EcosystemList";

const useStyle = makeStyles((theme) => ({
  root: {
    padding: "0rem 1rem 1rem 1rem",
    borderTopRightRadius: "10px",
    borderBottomRightRadius: "10px",
    overflowX: "hidden",
    backgroundColor: theme.palette.type === THEME_MODE.DARK ? "#331E0B" : "#FFFFFF",
    [theme.breakpoints.only("sm")]: {
      maxHeight: "660px",
    },
  },
  slideBox: {
    display: "flex",
    overflowX: "hidden",
    transform: "translate(-50%)",
    transitionDuration: "0.5s",
  },
  icon: {
    width: 25,
    fontSize: "18px",
    color: theme.palette.text.secondary,
  },
  mainIcon: {
    color: theme.palette.text.primary,
  },
}));

function Item({ element, onShowSubMenu, isActive = false }) {
  const cls = useStyle();
  const IconTag = element.icon;

  return (
    <ListItem style={{ paddingLeft: 0, paddingRight: 0 }}>
      {element.subTab.length > 0 ? (
        <FlexibleLinkItem
          isActive={isActive}
          type={LinkType.NONE}
          onClick={() => onShowSubMenu(element)}
          label={element.label}
          Component={{
            start: <IconTag className={clsx(cls.icon, { [cls.mainIcon]: element.isActive })} />,
            end: <ArrowForward className={clsx({ [cls.mainIcon]: element.isActive })} style={{ fontSize: "18px" }} />,
          }}
        />
      ) : (
        <FlexibleLinkItem
          isActive={isActive}
          type={LinkType.LINK}
          to={element.to}
          label={element.label}
          Component={{
            start: <IconTag className={cls.icon} />,
          }}
        />
      )}
    </ListItem>
  );
}

export default function SmallScreenDrawer({ open, onClose, ...props }) {
  const cls = useStyle();
  const slideRef = useRef(null);
  const [element, setElement] = useState(LayoutConfig[0]);
  const xsOnly = useMediaQuery((theme) => theme.breakpoints.only("xs"));
  const location = useLocation();

  const _width = useMemo(() => {
    if (window.innerWidth) {
      const rawWidth = window.innerWidth;
      if (rawWidth > 300) return 300;
      return rawWidth;
    } else return 300;
  }, [window.innerWidth]);

  function onShowSubMenu(item) {
    setElement(item);
    if (slideRef?.current) slideRef.current.style.transform = "translate(-50%)";
  }

  function onHideSubMenu() {
    if (slideRef?.current) slideRef.current.style.transform = "translate(0%)";
  }

  return (
    <Drawer
      anchor="left"
      open={open}
      onClose={() => {
        onClose();
        setElement(LayoutConfig[0]);
      }}
      PaperProps={{ className: cls.root, style: { width: _width } }}
      {...props}
    >
      <Box display="flex" flexDirection="column" justifyContent="space-between" height="100%">
        <Box>
          <Box display="flex" justifyContent="space-between" alignItems="center" height={65}>
            <MenuOpen onClick={() => onClose()} />
            <Box>{xsOnly && <NetworkButton />}</Box>
          </Box>
          <Box className={cls.slideBox} width={2 * _width} ref={slideRef}>
            <List style={{ width: _width - 32 }}>
              {LayoutConfig.map((element, index) => (
                <Item
                  key={index}
                  element={element}
                  onShowSubMenu={onShowSubMenu}
                  isActive={element.isActive(null, location)}
                />
              ))}
            </List>
            <Box ml={2} pl={2} mt={2} style={{ width: _width - 16 }}>
              <Box display="flex" alignItems="center" onClick={() => onHideSubMenu()}>
                <ArrowBack style={{ fontSize: "14px", marginRight: "0.5rem" }} />
                <Typography>{element?.subTitle}</Typography>
              </Box>
              {element?.subTab && (
                <List style={{ marginLeft: "0.75rem" }}>
                  {element.subTab.map((subItem, index) => {
                    return (
                      <ListItem key={index} onClick={() => onClose()} style={{ padding: "0.25rem 0rem" }}>
                        <FlexibleLinkItem
                          type={subItem.type}
                          to={subItem.to}
                          isActive={subItem?.isActive}
                          label={subItem.label}
                        />
                      </ListItem>
                    );
                  })}
                </List>
              )}
            </Box>
          </Box>
        </Box>
        <EcosystemList isCenter={false} width="100%" display="flex" flexDirection="column" alignItems="flex-start" />
      </Box>
    </Drawer>
  );
}

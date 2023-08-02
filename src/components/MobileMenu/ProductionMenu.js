import { Box, Divider, Drawer, Link, List, ListItem, makeStyles, Typography } from "@material-ui/core";
import clsx from "clsx";
import { useMemo } from "react";
import { useSelector } from "react-redux";
import { THEME_MODE } from "src/configs/constance";
import { navLinkTabConfig } from "src/configs/constance/layout";
import ToggleNetworkButton from "../Header/ToggleNetworkButton";
import ToggleThemeButton from "../Header/ToggleThemeButton";

const useStyles = makeStyles((theme) => ({
  drawer: {
    height: "60%",
    maxHeight: 350,
    width: "200px",
    top: "auto",
    bottom: theme.spacing(6),
    borderRadius: theme.spacing(1, 0, 0, 0),
    padding: 0,
    "& $navLink": {
      fontWeight: 450,
    },
  },
  listItem: {
    padding: theme.spacing(0, 1),
    "&:hover $navLink": {
      textDecoration: "none",
    },
  },
  navLink: {
    color: theme.palette.text.hint,
    display: "flex",
    flexDirection: "column",
    textDecoration: "none",
    transition: "color, fill, stroke 0.3s ease",
    width: "100%",
    padding: theme.spacing(1, 2),
  },
  activeLink: {
    color: theme.palette.text.primary,
  },
  theme: {
    color: theme.palette.text.hint,
  },
}));

export default function ProductionMenu({ open, closeMenu }) {
  const themeMode = useSelector((state) => state.themeSlice.themeMode);
  const cls = useStyles();

  const mode = useMemo(() => {
    if (themeMode === THEME_MODE.DARK) return "Dark mode";
    else return "Light mode";
  }, [themeMode]);

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={closeMenu}
      variant="temporary"
      classes={{ paper: cls.drawer }}
      ModalProps={{ onBackdropClick: closeMenu }}
      docked={false}
    >
      <Box pt={2} display="flex" flexDirection="column" height="100%">
        <List>
          {navLinkTabConfig.map((element, index) => {
            return (
              <ListItem key={index} className={cls.listItem}>
                <Link
                  href={element["link"]}
                  className={clsx(cls.navLink, { [cls.activeLink]: element["main"] })}
                  {...(element.isExternal
                    ? {
                        target: "_blank",
                        rel: "noopener",
                      }
                    : {})}
                >
                  {element["name"]}
                </Link>
              </ListItem>
            );
          })}
        </List>
        <Box pb={2} flexGrow={1} display="flex" flexDirection="column" justifyContent="flex-end">
          <Divider />
          <Box pt={2} px={2}>
            <ToggleNetworkButton fullWidth />
          </Box>
          <Box pt={1} px={2} display="flex" alignItems="center" justifyContent="space-between">
            <Typography className={cls.theme}>{mode}</Typography>
            <ToggleThemeButton />
          </Box>
        </Box>
      </Box>
    </Drawer>
  );
}

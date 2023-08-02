import { Box, Link, makeStyles, Typography } from "@material-ui/core";
import { LaunchOutlined } from "@material-ui/icons";
import clsx from "clsx";
import { NavLink, useLocation } from "react-router-dom";
import { LinkType, THEME_MODE } from "src/configs/constance";

const useStyle = makeStyles((theme) => ({
  baseLink: {
    width: "100%",
    textDecoration: "none",
    "&:hover": {
      textDecoration: "none",
    },
  },
  subBaseLink: {
    borderRadius: "3px",
    padding: "0.75rem 0rem 0.75rem 0.75rem",
    color: theme.palette.text.secondary,
    "&:hover": {
      backgroundColor: theme.palette.type == THEME_MODE.DARK ? "rgba(118, 57, 10, 0.25)" : "#F2F2F2",
    },
  },
  activeLink: {
    backgroundColor: theme.palette.background.sidebar,
    color: theme.palette.text.primary,
    "&:hover": {
      backgroundColor: theme.palette.background.sidebar,
    },
  },
}));

function BaseLink({ type, to, children, ...props }) {
  const cls = useStyle();

  return type == LinkType.NONE ? (
    <Box {...props} className={clsx(cls.subBaseLink, { [cls.activeLink]: props?.isActive })}>
      {children}
    </Box>
  ) : type == LinkType.NAV ? (
    <NavLink to={to} {...props} className={clsx(cls.baseLink, cls.subBaseLink)} activeClassName={cls.activeLink}>
      {children}
    </NavLink>
  ) : (
    <Link
      {...props}
      href={to}
      className={clsx(cls.baseLink, cls.subBaseLink)}
      target={type == LinkType.LINK ? "_self" : "_blank"}
    >
      {children}
    </Link>
  );
}

export function FlexibleLinkItem({ type, to, label, Component, ...props }) {
  return (
    <BaseLink type={type} to={to} style={{ width: "100%" }} {...props}>
      <Box display="flex" justifyContent="space-between">
        <Box display="flex">
          {Component?.start}
          <Typography>{label}</Typography>
        </Box>
        <Box mr={1}>{type == LinkType.EXTERNAL ? <LaunchOutlined fontSize="small" /> : <>{Component?.end}</>}</Box>
      </Box>
    </BaseLink>
  );
}

const useDesktopStyle = makeStyles((theme) => ({
  root: {
    padding: "0.25rem",
    borderRadius: "5px",
    "&:hover": {
      backgroundColor: theme.palette.type === THEME_MODE.DARK ? "rgba(118, 57, 10, 0.25)" : "#F2F2F2",
    },
  },
  baseLink: {
    width: "100%",
    textDecoration: "none",
  },
  icon: {
    width: 25,
    fontSize: "18px",
    color: theme.palette.text.secondary,
  },
  mainIcon: {
    color: theme.palette.text.primary,
  },
  iconBox: {
    margin: "0.25rem",
    width: "55px",
    height: "30px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: "3px",
  },
}));

export function DesktopList({ element }) {
  const cls = useDesktopStyle();
  const IconTag = element.icon;
  const location = useLocation();

  return (
    <Link
      href={element.to}
      className={cls.baseLink}
      style={{ textDecoration: "none", padding: "0.5rem 0.5rem 0rem 0.5rem", borderRadius: "3px" }}
    >
      <Box display="flex" justifyContent="center" alignItems="center" flexDirection="column" className={cls.root}>
        <Box
          className={cls.iconBox}
          style={element.isActive(null, location) ? { backgroundColor: "rgba(226, 160, 37, 0.15)" } : {}}
        >
          <IconTag className={cls.icon} />
        </Box>
        <Typography color="textSecondary" style={{ fontSize: "14px", fontWeight: 400 }}>
          {element.label}
        </Typography>
      </Box>
    </Link>
  );
}

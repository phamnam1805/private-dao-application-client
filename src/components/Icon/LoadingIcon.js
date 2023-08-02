import { Box, makeStyles } from "@material-ui/core";
import clsx from "clsx";

const useLoadingStyle = makeStyles((theme) => ({
  "@keyframes rotate1": {
    "0%": {
      transform: "rotateX(35deg) rotateY(-45deg) rotateZ(0deg)",
    },
    "100%": {
      transform: "rotateX(35deg) rotateY(-45deg) rotateZ(360deg)",
    },
  },
  "@keyframes rotate2": {
    "0%": {
      transform: "rotateX(50deg) rotateY(10deg) rotateZ(0deg)",
    },
    "100%": {
      transform: "rotateX(50deg) rotateY(10deg) rotateZ(360deg)",
    },
  },
  "@keyframes rotate3": {
    "0%": {
      transform: "rotateX(35deg) rotateY(55deg) rotateZ(0deg)",
    },
    "100%": {
      transform: "rotateX(35deg) rotateY(55deg) rotateZ(360deg)",
    },
  },
  inner: {
    position: "absolute",
    boxSizing: "border-box",
    width: "100%",
    height: "100%",
    borderRadius: "50%",
  },
  inner1: {
    left: "0%",
    top: "0%",
    borderBottom: `3px solid ${theme.palette.primary.main}`,
    animation: "$rotate1 1.2s linear infinite",
  },
  inner2: {
    right: "0%",
    top: "0%",
    borderRight: `3px solid ${theme.palette.primary.main}`,
    animation: "$rotate2 1.2s linear infinite",
  },
  inner3: {
    right: "0%",
    bottom: "0%",
    borderTop: `3px solid ${theme.palette.primary.main}`,
    animation: "$rotate3 1.2s linear infinite",
  },
}));

export function LoadingIcon({ size, ...props }) {
  const cls = useLoadingStyle();

  return (
    <Box
      {...props}
      style={{ display: "inline-block", borderRadius: "50%", perspective: 800 }}
      width={size ?? 64}
      height={size ?? 64}
    >
      <div className={clsx(cls.inner, cls.inner1)} />
      <div className={clsx(cls.inner, cls.inner2)} />
      <div className={clsx(cls.inner, cls.inner3)} />
    </Box>
  );
}

export function LoadingIconBox({ iconProps, ...props }) {
  return (
    <Box display="flex" justifyContent="center" {...props}>
      <LoadingIcon size={40} {...iconProps} />
    </Box>
  );
}

const useEllipsisStyle = makeStyles(() => ({
  "@keyframes ellipsis1": {
    from: { top: "50%", height: 0, width: 0 },
    to: { top: "41.25%", height: "16.25%", width: "16.25%" },
  },
  "@keyframes ellipsis2": {
    from: { left: "10%" },
    to: { left: "40%" },
  },
  "@keyframes ellipsis3": {
    from: { left: "40%" },
    to: { left: "70%" },
  },
  "@keyframes ellipsis4": {
    from: { top: "41.25%", height: "16.25%", width: "16.25%" },
    to: { top: "50%", height: 0, width: 0 },
  },
  ellipsis: {
    position: "absolute",
    boxSizing: "border-box",
    borderRadius: "50%",
  },
  ellipsis1: {
    left: "10%",
    animation: "$ellipsis1 0.6s linear infinite",
  },
  ellipsis2: {
    top: "41.25%",
    height: "16.25%",
    width: "16.25%",
    animation: "$ellipsis2 0.6s linear infinite",
  },
  ellipsis3: {
    top: "41.25%",
    height: "16.25%",
    width: "16.25%",
    animation: "$ellipsis3 0.6s linear infinite",
  },
  ellipsis4: {
    left: "70%",
    animation: "$ellipsis4 0.6s linear infinite",
  },
}));

export function EllipsisBox({ size, color, ...props }) {
  const cls = useEllipsisStyle();

  return (
    <Box
      {...props}
      style={{ position: "relative", display: "inline-block", boxSizing: "border-box" }}
      width={size ?? 80}
      height={size ?? 80}
    >
      <div style={{ background: color }} className={clsx(cls.ellipsis, cls.ellipsis1)} />
      <div style={{ background: color }} className={clsx(cls.ellipsis, cls.ellipsis2)} />
      <div style={{ background: color }} className={clsx(cls.ellipsis, cls.ellipsis3)} />
      <div style={{ background: color }} className={clsx(cls.ellipsis, cls.ellipsis4)} />
    </Box>
  );
}

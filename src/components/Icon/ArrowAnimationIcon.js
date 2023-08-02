import { makeStyles } from "@material-ui/core";
import ArrowForwardIosIcon from "@material-ui/icons/ArrowForwardIos";
import clsx from "clsx";

const useStyle = makeStyles(() => ({
  open: {
    transform: "rotate(-90deg)",
    transition: "0.5s",
  },
  close: {
    transform: "rotate(90deg)",
    transition: "0.5s",
  },
}));

export default function ArrowAnimationIcon({ isTransform, ...props }) {
  const cls = useStyle();

  return (
    <ArrowForwardIosIcon
      {...props}
      className={clsx({ [cls.close]: !isTransform, [cls.open]: isTransform }, props?.className)}
    />
  );
}

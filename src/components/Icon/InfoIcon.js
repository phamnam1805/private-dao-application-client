import { makeStyles, Tooltip } from "@material-ui/core";
import InfoOutlinedIcon from "@material-ui/icons/InfoOutlined";
import clsx from "clsx";

const useStyle = makeStyles(() => ({
  muiSvgIconRoot: {
    fontSize: 16,
    color: "#566474",
    cursor: "pointer",
  },
}));

export default function InfoIcon({ TooltipComponent, iconProps, ...props }) {
  const cls = useStyle();

  return (
    <Tooltip {...props}>
      {TooltipComponent ? (
        TooltipComponent
      ) : (
        <InfoOutlinedIcon {...iconProps} className={clsx(cls.muiSvgIconRoot, iconProps?.className)} />
      )}
    </Tooltip>
  );
}

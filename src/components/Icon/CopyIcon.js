import { IconButton, Tooltip } from "@material-ui/core";
import FileCopyOutlinedIcon from "@material-ui/icons/FileCopyOutlined";
import { useState } from "react";
import CopyToClipboard from "react-copy-to-clipboard";

export default function CopyIcon({
  copyText,
  defaultText = "Copy",
  successText = "Copied!",
  size,
  butProps,
  ...props
}) {
  const [tooltip, setTooltip] = useState(defaultText);

  return (
    <CopyToClipboard
      text={copyText}
      onCopy={() => {
        setTooltip(successText);
        setTimeout(() => {
          setTooltip(defaultText);
        }, 1000);
      }}
    >
      <Tooltip title={tooltip}>
        <IconButton {...butProps}>
          <FileCopyOutlinedIcon {...props} fontSize={size} />
        </IconButton>
      </Tooltip>
    </CopyToClipboard>
  );
}

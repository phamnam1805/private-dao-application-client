import { Box } from "@material-ui/core";
import StarFillIcon from "@material-ui/icons/Star";
import StarOutlineOutlinedIcon from "@material-ui/icons/StarOutlineOutlined";

export default function StarIcon({ isFill = true, ...props }) {
  return (
    <Box display="flex" alignItems="center" {...props}>
      {isFill ? <StarFillIcon color="primary" /> : <StarOutlineOutlinedIcon color="primary" />}
    </Box>
  );
}

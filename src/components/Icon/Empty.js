import { Box, makeStyles, Typography } from "@material-ui/core";
import { EmptyBoxIcon } from ".";

const useStyle = makeStyles((theme) => ({
  disabled: {
    color: theme.palette.text.secondary,
  },
}));

export default function Empty({ title, iconProps, titleProps, ...props }) {
  const cls = useStyle();

  return (
    <Box display="flex" flexDirection="column" alignItems="center" py={2} {...props}>
      <EmptyBoxIcon className={cls.disabled} {...iconProps} />
      {title && (
        <Typography color="textSecondary" display="inline" {...titleProps}>
          {title}
        </Typography>
      )}
    </Box>
  );
}

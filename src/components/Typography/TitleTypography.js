import { Box, Typography, useTheme } from "@material-ui/core";

export default function TitleTypography({ title, textProps, ...props }) {
  const theme = useTheme();

  return (
    <Box display="flex" alignItems="center" {...props}>
      <Typography variant="subtitle2" style={{ color: theme.palette.text.hint }} {...textProps}>
        {title}
      </Typography>
    </Box>
  );
}

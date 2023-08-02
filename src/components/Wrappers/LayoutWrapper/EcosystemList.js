import { Box, Link, List, ListItem, makeStyles, Typography } from "@material-ui/core";
import ThemeButton from "src/components/Button/ThemeButton";
import { EcosystemConfig, THEME_MODE } from "src/configs/constance";

const useStyle = makeStyles((theme) => ({
  baseLink: {
    width: "100%",
    textDecoration: "none",
  },
  divider: {
    backgroundColor: theme.palette.type === THEME_MODE.DARK ? "#203858" : "#D9DEE3",
    height: "1px",
    width: "100%",
  },
}));

export default function EcosystemList({ isCenter = true, ...props }) {
  const cls = useStyle();

  return (
    <Box {...props}>
      <Typography color="textSecondary" style={{ fontSize: "14px", fontWeight: 500 }}>
        Ecosystem
      </Typography>
      <Box mt={1} className={cls.divider} />
      <List style={{ width: "100%" }}>
        {EcosystemConfig.map((element, index) => {
          return (
            <ListItem key={index} style={{ paddingLeft: 0, paddingRight: 0 }}>
              <Link href={element.to} className={cls.baseLink} target="_blank" style={{ textDecoration: "none" }}>
                <Typography color="textSecondary" style={{ textAlign: isCenter ? "center" : "left", fontSize: "14px" }}>
                  {element.label}
                </Typography>
              </Link>
            </ListItem>
          );
        })}
      </List>
      <ThemeButton />
    </Box>
  );
}

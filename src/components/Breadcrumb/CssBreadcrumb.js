import { Box, makeStyles, Typography } from "@material-ui/core";
import Breadcrumbs from "@material-ui/core/Breadcrumbs";
import Link from "@material-ui/core/Link";
import NavigateNextIcon from "@material-ui/icons/NavigateNext";
import { Link as RouterLink } from "react-router-dom";
import CopyIcon from "../Icon/CopyIcon";

const useStyle = makeStyles((theme) => ({
  box: {
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-start",
    [theme.breakpoints.down("xs")]: {
      flexDirection: "column",
      alignItems: "flex-start",
    },
  },
  iconCopy: {
    color: theme.palette.text.secondary,
    fontSize: "14px",
  },
}));

export default function CssBreadcrumb({ config = [], ...props }) {
  const cls = useStyle();

  const UpperTheFirstLetter = (text) => {
    const textArray = text.split(" ");
    let result = "";
    for (let subText of textArray) result += subText[0].toUpperCase() + subText.substring(1).toLowerCase() + " ";
    const _len = result.length;
    return result.slice(0, _len - 1);
  };

  return (
    <Box className={cls.box} {...props}>
      <Breadcrumbs separator={<NavigateNextIcon fontSize="small" />}>
        {config.map((item, index) => {
          const formatter = item.formatter;
          return (
            <Box key={index} display="flex" justifyContent="center" alignItems="center">
              {item.link ? (
                <Link key={index} component={RouterLink} to={item.link}>
                  <Typography color="textSecondary">
                    {formatter ? formatter(item.text) : UpperTheFirstLetter(item.text)}
                  </Typography>
                </Link>
              ) : (
                <Typography color="textSecondary">
                  {formatter ? formatter(item.text) : UpperTheFirstLetter(item.text)}
                </Typography>
              )}
              {item.isCopy && (
                <CopyIcon
                  copyText={item.copy.textCopy}
                  defaultText={item.copy.textDefault}
                  successText={item.copy.textSuccess}
                  className={cls.iconCopy}
                />
              )}
            </Box>
          );
        })}
      </Breadcrumbs>
    </Box>
  );
}

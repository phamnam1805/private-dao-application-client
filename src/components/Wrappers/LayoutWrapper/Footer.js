import { Box, Link, makeStyles, Typography, useMediaQuery } from "@material-ui/core";
import {
  DiscordIcon,
  GithubIcon,
  LinkedinIcon,
  MediumIcon,
  RedditIcon,
  TelegramIcon,
  TwitterIcon,
  YoutubeIcon,
} from "src/components/Icon";

const config = [
  { to: "", icon: TwitterIcon },
  { to: "", icon: TelegramIcon },
  { to: "", icon: RedditIcon },
  { to: "", icon: MediumIcon },
  { to: "", icon: DiscordIcon },
  { to: "", icon: GithubIcon },
  { to: "", icon: YoutubeIcon },
  { to: "", icon: LinkedinIcon },
];

const useStyle = makeStyles((theme) => ({
  root: {
    padding: "0.5rem 3rem",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    [theme.breakpoints.down("md")]: {
      padding: "1rem 2rem",
    },
    [theme.breakpoints.only("xs")]: {
      alignItems: "center",
      flexDirection: "column-reverse",
      padding: "1rem",
    },
  },
}));

export default function Footer({ isBlur }) {
  const cls = useStyle();
  const xsOnly = useMediaQuery((theme) => theme.breakpoints.only("xs"));

  return (
    <Box className={cls.root} style={isBlur ? { opacity: 0.1 } : {}}>
      <Typography color="textSecondary" style={{ fontSize: "14px" }}>
        COPYRIGHT © {new Date().getFullYear()}&nbsp;
        <Link
          target="_blank"
          href="https://zkvn.tech/"
          style={{ fontSize: "14px", textDecoration: "none", color: "#D97719", fontWeight: 500 }}
        >
          zkVN.
        </Link>
        &nbsp;All right reserved
      </Typography>
      <Box mb={xsOnly ? 1 : 0}>
        <Box>
          {config.slice(0, 4).map((element, index) => {
            const Icon = element.icon;
            return (
              <Link key={index} target="_blank" href={element.to} style={{ marginRight: "1rem" }}>
                <Icon size="24px" style={{ color: "#D97719" }} />
              </Link>
            );
          })}
        </Box>
        <Box mt={0.5}>
          {config.slice(4).map((element, index) => {
            const Icon = element.icon;
            return (
              <Link key={index} target="_blank" href={element.to} style={{ marginRight: "1rem" }}>
                <Icon size="24px" style={{ color: "#D97719" }} />
              </Link>
            );
          })}
        </Box>
      </Box>
    </Box>
  );
}

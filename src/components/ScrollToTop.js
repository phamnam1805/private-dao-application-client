import { Box, makeStyles } from "@material-ui/core";
import ArrowUpwardIcon from "@material-ui/icons/ArrowUpward";
import { useEffect, useRef } from "react";

const useStyle = makeStyles((theme) => ({
  scrollContainer: {
    cursor: "pointer",
    position: "fixed",
    transitionDuration: "0.5s",
    transform: "translateY(100%)",
    right: 0,
    bottom: 0,
    margin: "0rem 1.25rem 0rem 0rem",
    zIndex: 1000000,
  },
  scrollIcon: {
    fontSize: "30px",
    backgroundColor: "#77BEFF",
    color: "#FFFFFF",
    borderRadius: "20%",
    [theme.breakpoints.down("sm")]: {
      marginBottom: "2rem",
    },
  },
}));

export default function ScrollToTop() {
  const cls = useStyle();
  const scrollRef = useRef();

  useEffect(() => {
    if (scrollRef?.current) window.addEventListener("scroll", listenToScroll);
    return function cleanup() {
      window.removeEventListener("scroll", listenToScroll);
    };
  }, [scrollRef]);

  const listenToScroll = () => {
    if (scrollRef?.current) {
      const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
      if (winScroll > 10) {
        scrollRef.current.style.transform = "translateY(0)";
        scrollRef.current.style.margin = "0rem 1.25rem 2.5rem 0rem";
      } else {
        scrollRef.current.style.transform = "translateY(100%)";
        scrollRef.current.style.margin = "0rem 1.25rem 0rem 0rem";
      }
    }
  };

  const onScrollToTopClick = () => {
    window.scroll({ top: 0, behavior: "smooth" });
  };

  return (
    <Box ref={scrollRef} className={cls.scrollContainer}>
      <ArrowUpwardIcon className={cls.scrollIcon} onClick={onScrollToTopClick} />
    </Box>
  );
}

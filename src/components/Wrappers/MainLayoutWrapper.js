import { Box, makeStyles, Typography } from "@material-ui/core";
import { useSelector } from "react-redux";
import { QUERY_STATE, THEME_MODE } from "src/configs/constance";
import ErrorIconBox from "../Icon/ErrorIconBox";
import { LoadingIconBox } from "../Icon/LoadingIcon";

const useStyle = makeStyles((theme) => ({
  mountain: {
    height: 200,
    flexDirection: "column",
    backgroundColor: "#391902",
    position: "sticky",
    top: 65,
    zIndex: 1,
    [theme.breakpoints.only("xs")]: {
      top: 87,
      backgroundPosition: "bottom, top",
      backgroundSize: "100% 100px, cover",
      margin: "1rem",
      borderRadius: "10px",
    },
  },
  overviewMountain: {
    paddingTop: "1rem",
    margin: "0rem 3rem",
    [theme.breakpoints.only("xs")]: {
      margin: "0rem 1rem",
    },
  },
  title: {
    color: "#FCF3EB",
    fontSize: "50px",
    fontWeight: 400,
  },
  des: {
    color: "#FAD3B6",
  },
  children: {
    padding: "1.5rem 3rem",
    zIndex: 1000,
    position: "relative",
    backgroundColor: theme.palette.type === THEME_MODE.DARK ? "#271203" : "#FCF3EB",
    [theme.breakpoints.down("md")]: {
      padding: "1rem 2rem",
    },
    [theme.breakpoints.only("xs")]: {
      padding: "1rem",
    },
  },
}));

export default function MainLayoutWrapper({ overview, children, ...props }) {
  const cls = useStyle();
  const { queryingStatus } = useSelector((state) => state.configSlice);

  return (
    <Box {...props}>
      <Box className={cls.mountain}>
        <Box className={cls.overviewMountain}>
          <Box mb={1} display="flex" alignItems="center">
            {/* {overview?.back && (
              <IconButton onClick={() => history.push(overview.back)}>
                <ChevronLeftIcon fontSize="medium" style={{ color: "#FFFFFF" }} />
              </IconButton>
            )} */}
            {overview?.title && <Typography className={cls.title}>{overview.title}</Typography>}
          </Box>
          {overview?.des && (
            <Typography variant="body2" className={cls.des}>
              {overview?.des}
            </Typography>
          )}
        </Box>
      </Box>
      <Box className={cls.children}>
        {queryingStatus === QUERY_STATE.FETCHING && <LoadingIconBox />}
        {queryingStatus === QUERY_STATE.FAIL && <ErrorIconBox des="Something wrong!" />}
        {queryingStatus === QUERY_STATE.SUCCESS && <>{children}</>}
      </Box>
    </Box>
  );
}

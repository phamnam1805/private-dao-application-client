import { Box, Button, makeStyles, useMediaQuery } from "@material-ui/core";
import AddCircleIcon from "@material-ui/icons/AddCircle";
import { useSnackbar } from "notistack";
import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { FUNDING_STATE, QUERY_STATE, THEME_MODE } from "src/configs/constance";
import useSearchData from "src/hook/useSearchData";
import { fetchDAOData } from "src/redux/daoDataSlice";
import { fetchFundingRoundsData } from "src/redux/fundingDataSlice";
import CssSelector from "src/components/Selector/CssSelector";
import SearchTextField from "src/components/TextField/SearchTextField";
import MainLayoutWrapper from "src/components/Wrappers/MainLayoutWrapper";
import ErrorIconBox from "src/components/Icon/ErrorIconBox";
import { LoadingIconBox } from "src/components/Icon/LoadingIcon";
import Empty from "src/components/Icon/Empty";
import DAOGrid from "./DAOGrid";

const useStyle = makeStyles((theme) => ({
  searchBox: {
    display: "flex",
    alignItems: "center",
    border: `1px solid ${theme.palette.type === THEME_MODE.DARK ? "#433026" : "#C1A779"}`,
    borderRadius: "4px",
    height: "36px",
    [theme.breakpoints.only("xs")]: {
      width: "100%",
    },
  },
  selector: {
    backgroundColor: "transparent",
    borderTop: "none",
    borderBottom: "none",
    borderLeft: "none",
    borderTopRightRadius: 0,
    borderBottomRightRadius: 0,
  },
}));

function DAOListLayout() {
  const cls = useStyle();
  const history = useHistory();
  const [searchText, setSearchText] = useState("");
  const [option, setOption] = useState("DAO");
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();
  const { fetchingDAOsStatus, daos } = useSelector((state) => state.daoDataSlice);
  const { fetchingFundingRoundsStatus, funding } = useSelector((state) => state.fundingDataSlice);
  const matches = useMediaQuery((theme) => theme.breakpoints.only("xs"));
  const mdUp = useMediaQuery((theme) => theme.breakpoints.up("md"));

  useEffect(() => {
    if (fetchingDAOsStatus === QUERY_STATE.INITIAL) dispatch(fetchDAOData(enqueueSnackbar));
  }, [fetchingDAOsStatus]);

  useEffect(() => {
    if (fetchingFundingRoundsStatus === QUERY_STATE.INITIAL) dispatch(fetchFundingRoundsData(enqueueSnackbar));
  }, [fetchingFundingRoundsStatus]);

  const daoListData = useMemo(() => {
    if (fetchingDAOsStatus === QUERY_STATE.SUCCESS && fetchingFundingRoundsStatus == QUERY_STATE.SUCCESS) {
      const daoList = daos.map(dao => ({
        ...dao,
        ...{
          state: funding.currentRound !== null
            ? (funding.currentRound.listDAO.includes(dao.address.toLowerCase()) ? 2 : 0)
            : (funding.queue.includes(dao.address.toLowerCase()) ? 1 : 0)
        }
      }));
      return daoList;
    } else return [];
  }, [fetchingDAOsStatus, fetchingFundingRoundsStatus, daos]);

  function searchDAO(element, _, searchText) {
    const realSearchText = searchText.replace(/\s+/g, " ").trim().toLowerCase();
    if (realSearchText !== "") {
      const _name = element.name.toLowerCase().includes(realSearchText);
      const _description = element.description.toLowerCase().includes(realSearchText);
      return _name || _description;
    }
    return true;
  }

  function searchTag(element, _, searchText) {
    const realSearchText = searchText.replace(/\s+/g, " ").trim().toLowerCase();
    if (realSearchText !== "") return element.tags.toString().toLowerCase().includes(realSearchText);
    return true;
  }

  const searchAction = useMemo(() => {
    if (option == "DAO") return searchDAO;
    else return searchTag;
  }, [option]);

  const searchData = useSearchData(daoListData, searchText, searchAction);

  return (
    <>
      {(fetchingDAOsStatus === QUERY_STATE.FETCHING || fetchingFundingRoundsStatus === QUERY_STATE.FETCHING) && <LoadingIconBox />}
      {(fetchingDAOsStatus === QUERY_STATE.FAIL || fetchingFundingRoundsStatus === QUERY_STATE.FAIL) && <ErrorIconBox des="Something wrong!" />}
      {(fetchingDAOsStatus === QUERY_STATE.SUCCESS && fetchingFundingRoundsStatus === QUERY_STATE.SUCCESS) && <>
        <Box display="flex" justifyContent="space-between" flexDirection={matches ? "column" : "row"} mb={2}>
          <Box className={cls.searchBox} width={mdUp ? "50%" : "auto"}>
            <CssSelector
              value={option}
              config={[
                { id: "dao", label: "DAO" },
                { id: "tag", label: "Tag" },
              ]}
              event={{ onChooseItem: (_, item) => setOption(item.label) }}
              className={cls.selector}
            />
            <SearchTextField
              style={{ marginLeft: "0.5rem" }}
              {...{ searchText, setSearchText }}
              placeholder={`Search by ${option}…`}
              variant="standard"
              fullWidth
              InputProps={{ disableUnderline: true, startAdornment: <></> }}
            />
          </Box>
          <Box
            display="inline-flex"
            justifyContent="flex-end"
            alignItems="center"
            flexDirection={matches ? "column" : "row"}
            width={mdUp ? "calc(100% - 130px)" : "auto"}
          >
            <Button
              style={matches ? { marginTop: "1rem" } : { marginLeft: "0.5rem" }}
              fullWidth={matches}
              variant="contained"
              color="primary"
              startIcon={<AddCircleIcon />}
              onClick={() => history.push("/create-dao")}
            >
              Create DAO
            </Button>
          </Box>
        </Box>
        {daoListData.length > 0 ? <DAOGrid daoListData={searchData} /> : (
          <Box py={2} display="flex" justifyContent="center">
            <Empty title="No Data" iconProps={{ style: { fontSize: "60px" } }} />
          </Box>
        )}
      </>
      }

    </>
  );
}

export default function DAOList() {
  return (
    <MainLayoutWrapper
      overview={{
        title: "DAOs",
        des: "Explore existing DAOs in the ecosystem, their details and funding status.",
      }}
    >
      <DAOListLayout />
    </MainLayoutWrapper>
  );
}

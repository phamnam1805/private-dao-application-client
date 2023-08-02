import { Box, Button, Grid } from "@material-ui/core";
import { useMemo, useState } from "react";
import { useSelector } from "react-redux";
import Empty from "src/components/Icon/Empty";
import ErrorIconBox from "src/components/Icon/ErrorIconBox";
import { LoadingIconBox } from "src/components/Icon/LoadingIcon";
import StarIcon from "src/components/Icon/StarIcon";
import CssPagination from "src/components/Pagination/CssPagination";
import { QUERY_STATE } from "src/configs/constance";
import usePagination from "src/hook/usePagination";
import useSortData from "src/hook/useSortData";
import DAOItem from "./DAOItem";

export default function DAOGrid({ daoListData }) {

  const { fetchingApiDAOStatus } = useSelector((state) => state.daoDataSlice);
  const { update, data: sortData, sortType, sortKey } = useSortData(daoListData, "desc", "tvl");
  const { data, jump, maxPage, currentPage } = usePagination(sortData);

  return (
    <Box mt={3}>
      <Grid container spacing={3}>
        {data.map((dao, index) => {
          return (
            <Grid key={index} item lg={4} sm={6} xs={12}>
              <DAOItem dao={dao} />
            </Grid>
          );
        })}
      </Grid>
      {(() => {
        if (fetchingApiDAOStatus === QUERY_STATE.SUCCESS && data.length == 0)
          return (
            <Box py={2} display="flex" justifyContent="center">
              <Empty title="No Data" iconProps={{ style: { fontSize: "60px" } }} />
            </Box>
          );
        else if (fetchingApiDAOStatus == QUERY_STATE.FETCHING) return <LoadingIconBox mt={2} />;
        else if (fetchingApiDAOStatus == QUERY_STATE.FAIL) return <ErrorIconBox />;
      })()}
      <CssPagination
        mt={1}
        paginationProps={{ page: currentPage, count: maxPage, onChange: (_, page) => jump(page) }}
      />
    </Box>
  );
}

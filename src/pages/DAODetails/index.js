import { Box, Button, Typography, makeStyles, useMediaQuery } from "@material-ui/core";
import AddCircleIcon from "@material-ui/icons/AddCircle";
import { useSnackbar } from "notistack";
import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import CssSelector from "src/components/Selector/CssSelector";
import SearchTextField from "src/components/TextField/SearchTextField";
import MainLayoutWrapper from "src/components/Wrappers/MainLayoutWrapper";
import { QUERY_STATE, THEME_MODE } from "src/configs/constance";
import useLowerAddressParam from "src/hook/useLowerAddressParam";
import GroupTabButton from "./components/GroupTabButton";
import DAOInfo from "./DAOInfo";
import DAOLayoutWrapper from "./components/DAOLayoutWrapper";
import { fetchDAOData } from "src/redux/daoDataSlice";

export default function DAODetails() {
  const { daoAddress } = useLowerAddressParam();
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();
  const { fetchingParticularDAOStatus, daos } = useSelector((state) => state.daoDataSlice);

  useEffect(() => {
    if (fetchingParticularDAOStatus === QUERY_STATE.INITIAL) dispatch(fetchDAOData(enqueueSnackbar));
  }, [fetchingParticularDAOStatus]);
  const mockData = {
    name: "The PAO",
    address: "0xD5745a490f14CdA24bed11156d91Eb7A77c8CB1B",
    logoUrl:
      "https://lh3.googleusercontent.com/u/0/drive-viewer/AITFw-ww9lkjcQGAe9pBTgpxtKx0Af2mZsVDNDGM_PsAoBZHQifZ34fDGptTqex3-gPGxBCPXq11ZOp8rwK-Ncb1eD5CJhr3JQ=w3024-h1666",
    description:
      "The protocol addresses the privacy issue for investors, encompassing both the privacy of the amount of money they have invested and the privacy of voting on project operations through proposals.",
    website: "https://thepao.fund",
    tags: ["Investment", "Financial"],
    status: "0",
  };

  return (
    <DAOLayoutWrapper>
      <GroupTabButton defaultActive={0} />
      <DAOInfo dao={mockData} />
    </DAOLayoutWrapper>
  );
}

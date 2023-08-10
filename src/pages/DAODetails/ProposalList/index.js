import { Box, Button, Paper, Typography, makeStyles, useMediaQuery } from "@material-ui/core";
import AddCircleIcon from "@material-ui/icons/AddCircle";
import { useSnackbar } from "notistack";
import { useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import useNotify from "src/hook/useNotify";
import useLowerAddressParam from "src/hook/useLowerAddressParam";
import { web3Sender } from "src/wallet-connection";
import DAOContract from "src/contract/DAOContract";
import { fetchParticularDAOData } from "src/redux/daoDataSlice";
import { generateApplyFundingRoundProposal } from "src/configs/constance";
import DAOLayoutWrapper from "../components/DAOLayoutWrapper";
import GroupTabButton from "../components/GroupTabButton";
import ProposalItem from "./Proposal/ProposalItem";
import { LoadingIconBox } from "src/components/Icon/LoadingIcon";
import Empty from "src/components/Icon/Empty";
import { parseBigIntObject } from "src/services/utility";

function ProposalListLayout() {
  const dispatch = useDispatch();
  const { errorNotify } = useNotify();
  const { enqueueSnackbar } = useSnackbar();
  const { daoAddress } = useLowerAddressParam();
  const { accountAddress } = useSelector((state) => state.accountDataSlice);
  const { daos } = useSelector((state) => state.daoDataSlice);
  const { addresses, investments } = useSelector((state) => state.configSlice);
  const matches = useMediaQuery((theme) => theme.breakpoints.only("xs"));
  const mdUp = useMediaQuery((theme) => theme.breakpoints.up("md"));
  const [isLoading, setIsLoading] = useState(false);

  const daoData = useMemo(() => {
    return daos.filter(dao => dao.address.toLowerCase() == daoAddress)[0];
  }, [daos]);

  const notes = useMemo(() => {
    return Object.values(investments)
      .filter(note => parseBigIntObject(note).dao == daoAddress)
      .map(note => parseBigIntObject(note));
  }, [investments]);

  async function onCreateProposalClick() {
    try {
      setIsLoading(true);
      const daoSender = new DAOContract(web3Sender, daoAddress);
      const proposals = generateApplyFundingRoundProposal(addresses.DAO_MANAGER);
      // console.log(proposals.descriptionHash);
      const _promise = daoSender.propose(proposals.actions, proposals.descriptionHash, accountAddress);

      // On transactionHash
      _promise.on("transactionHash", (_) => {

      });
      // Then
      _promise.then(async (receipt) => {
        dispatch(fetchParticularDAOData(daoAddress, enqueueSnackbar));
        setIsLoading(false);
      });
      // Catch
      _promise.catch(async (error) => {
        setIsLoading(false);
        throw error;
      });
    } catch (error) {
      setIsLoading(false);
      errorNotify(JSON.stringify(error.message));
    }
  }

  return (
    <>
      <GroupTabButton defaultActive={1} />
      <Box
        display="flex" justifyContent="space-between" flexDirection={matches ? "column-reverse" : "row"}
        mb={2} minHeight={matches ? "120px" : "auto"}
      >
        <Typography variant="h2" gutterBottom>
          Proposals
        </Typography>
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
            startIcon={isLoading ? <></> : <AddCircleIcon />}
            onClick={onCreateProposalClick}
            disabled={isLoading}
          >
            {isLoading ?
              <LoadingIconBox
                // width={"100%"}
                iconProps={{ sx: { height: 25 } }}
              /> : "Create Proposal"}
          </Button>
        </Box>
      </Box>
      {(daoData.proposals && Object.keys(daoData.proposals).length > 0) ? (
        <>
          {Object.values(daoData.proposals).reverse().map((proposal, index) => {
            console.log(proposal);
            return <ProposalItem
              key={index} style={{ marginTop: "1rem" }}
              proposal={proposal}
              notes={notes}
            />;
          })}
        </>
      ) : (
        <Box py={2} display="flex" justifyContent="center">
          <Empty title="No Data" iconProps={{ style: { fontSize: "60px" } }} />
        </Box>
      )}</>
  );
}

export default function ProposalList() {
  return (
    <DAOLayoutWrapper>
      <ProposalListLayout />
    </DAOLayoutWrapper>
  );
}

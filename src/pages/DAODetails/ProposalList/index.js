import { Box, Button, Paper, Typography, makeStyles, useMediaQuery } from "@material-ui/core";
import DAOLayoutWrapper from "../components/DAOLayoutWrapper";
import GroupTabButton from "../components/GroupTabButton";
import ProposalItem from "./Proposal/ProposalItem";

export default function ProposalList() {
  const proposals = [
    // {
    //   id: "0",
    //   title: "Test Proposal 0",
    //   createdAt: "1689591000",
    //   status: "Pending",
    //   ipfsHash: "Qmasdasd",
    //   forVotes: "0",
    //   againstVotes: "0",
    //   abstainVotes: "0",
    // },
    {
      id: "1",
      title: "Test Proposal 1",
      createdAt: "1689591001",
      status: "Active",
      ipfsHash: "Qmasdasd",
      forVotes: "0",
      againstVotes: "0",
      abstainVotes: "0",
    },
    // {
    //   id: "2",
    //   title: "Test Proposal 2",
    //   createdAt: "1689591002",
    //   status: "Tallying",
    //   ipfsHash: "Qmasdasd",
    //   forVotes: "0",
    //   againstVotes: "0",
    //   abstainVotes: "0",
    // },
    // {
    //   id: "3",
    //   title: "Test Proposal 3",
    //   createdAt: "1689591003",
    //   status: "Canceled",
    //   ipfsHash: "Qmasdasd",
    //   forVotes: "0",
    //   againstVotes: "0",
    //   abstainVotes: "0",
    // },
    // {
    //   id: "4",
    //   title: "Test Proposal 4",
    //   createdAt: "1689591004",
    //   status: "Defeated",
    //   ipfsHash: "Qmasdasd",
    //   forVotes: "1000",
    //   againstVotes: "2000",
    //   abstainVotes: "0",
    // },
    {
      id: "5",
      title: "Test Proposal 5",
      createdAt: "1689591005",
      status: "Succeeded",
      ipfsHash: "Qmasdasd",
      forVotes: "4000",
      againstVotes: "2000",
      abstainVotes: "0",
    },
    {
      id: "6",
      title: "Test Proposal 6",
      createdAt: "1689591006",
      status: "Queued",
      ipfsHash: "Qmasdasd",
      forVotes: "4000",
      againstVotes: "2000",
      abstainVotes: "0",
    },
    {
      id: "7",
      title: "Test Proposal 7",
      createdAt: "1689591007",
      status: "Expired",
      ipfsHash: "Qmasdasd",
      forVotes: "4000",
      againstVotes: "2000",
      abstainVotes: "0",
    },
    {
      id: "8",
      title: "Test Proposal 8",
      createdAt: "1689591008",
      status: "Executed",
      ipfsHash: "Qmasdasd",
      forVotes: "4000",
      againstVotes: "2000",
      abstainVotes: "500",
    },
  ];
  const notes = [
    {
      commitment: "123",
      daoAddress: "0x1234",
      amount: "1000",
      status: "1",
    },
    {
      commitment: "456",
      daoAddress: "0x1234",
      amount: "1000",
      status: "0",
    },
  ];
  return (
    <DAOLayoutWrapper>
      <GroupTabButton defaultActive={1} />
      <Typography variant="h2" gutterBottom>
        Proposals
      </Typography>
      {proposals.map((proposal, index) => {
        return <ProposalItem key={index} proposal={proposal} style={{ marginTop: "1rem" }} />;
      })}
    </DAOLayoutWrapper>
  );
}

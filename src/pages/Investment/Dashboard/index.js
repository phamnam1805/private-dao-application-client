import { Avatar, Box, Button, Divider, Grid, Paper, Typography, makeStyles, useMediaQuery } from "@material-ui/core";
import { useEffect, useMemo, useRef, useState } from "react";
import MainLayoutWrapper from "src/components/Wrappers/MainLayoutWrapper";
import LatestCampaign from "../Campaigns/LatestCampaign";
import CampaignList from "../Campaigns/CampaignList";

const useStyle = makeStyles((theme) => ({}));

const daoListData = [
  {
    name: "The PAO",
    address: "0xD5745a490f14CdA24bed11156d91Eb7A77c8CB1B",
    logoUrl:
      "https://lh3.googleusercontent.com/u/0/drive-viewer/AITFw-ww9lkjcQGAe9pBTgpxtKx0Af2mZsVDNDGM_PsAoBZHQifZ34fDGptTqex3-gPGxBCPXq11ZOp8rwK-Ncb1eD5CJhr3JQ=w3024-h1666",
    description:
      "The protocol addresses the privacy issue for investors, encompassing both the privacy of the amount of money they have invested and the privacy of voting on project operations through proposals.",
    website: "https://thepao.fund",
    tags: ["Investment", "Financial"],
  },
  {
    name: "Gitcoin",
    address: "0xD5745a490f14CdA24bed11156d91Eb7A77c8CB1B",
    logoUrl: "https://user-images.githubusercontent.com/23297747/40148910-112c56d4-5936-11e8-95df-aa9796b33bf3.png",
    description:
      "Gitcoin's mission is to grow and sustain open source development. Gitcoin believes that open source software developers create billions of dollars in value, but don't get to capture that value.",
    website: "https://gitcoin.co",
    tags: ["Investment", "Public Goods"],
  },
  {
    name: "Openzeppelin",
    address: "0xD5745a490f14CdA24bed11156d91Eb7A77c8CB1B",
    logoUrl: "https://avatars.githubusercontent.com/u/20820676?s=280&v=4",
    description:
      "OpenZeppelin provides security products to build, automate, and operate decentralized applications. We also protect leading organizations by performing security audits on their systems and products.",
    website: "https://www.openzeppelin.com/",
    tags: ["Programming", "Security"],
  },
  {
    name: "Ethereum Foundation",
    address: "0xD5745a490f14CdA24bed11156d91Eb7A77c8CB1B",
    logoUrl: "https://cdn4.iconfinder.com/data/icons/logos-brands-5/24/ethereum-512.png",
    description:
      "Fugiat laborum incididunt officia quis nisi irure. Eiusmod reprehenderit qui laboris voluptate quis laborum eu cupidatat ut qui sit do esse consectetur. Est nulla nulla excepteur magna proident magna sunt esse magna aliquip dolor duis. Dolore pariatur velit nulla proident dolor.",
    website: "https://google.com",
    tags: ["Education", "Society"],
  },
  {
    name: "zkSync",
    address: "0xD5745a490f14CdA24bed11156d91Eb7A77c8CB1B",
    logoUrl:
      "https://img.evbuc.com/https%3A%2F%2Fcdn.evbuc.com%2Fimages%2F451300809%2F1144705849263%2F1%2Foriginal.20230221-185620?w=400&auto=format%2Ccompress&q=75&sharp=10&rect=0%2C0%2C400%2C400&s=6be70815fc7d7b0da0ed6d53c81cdd68",
    description:
      "Fugiat laborum incididunt officia quis nisi irure. Eiusmod reprehenderit qui laboris voluptate quis laborum eu cupidatat ut qui sit do esse consectetur. Est nulla nulla excepteur magna proident magna sunt esse magna aliquip dolor duis. Dolore pariatur velit nulla proident dolor.",
    website: "https://google.com",
    tags: ["Investment", "Profit"],
  },
  {
    name: "Polygon",
    address: "0xD5745a490f14CdA24bed11156d91Eb7A77c8CB1B",
    logoUrl: "https://seeklogo.com/images/P/polygon-matic-logo-1DFDA3A3A8-seeklogo.com.png",
    description:
      "Fugiat laborum incididunt officia quis nisi irure. Eiusmod reprehenderit qui laboris voluptate quis laborum eu cupidatat ut qui sit do esse consectetur. Est nulla nulla excepteur magna proident magna sunt esse magna aliquip dolor duis. Dolore pariatur velit nulla proident dolor.",
    website: "https://google.com",
    tags: ["Science", "Research"],
  },
];

const campaignListData = [
  {
    id: 0,
    state: 4,
    listDAO: [
      "0x0E80c0aB999228caB1f77b8714dB10d22C8D9eC8",
      "0x12928f95333A486E5E6eCf52ea28245571423b13",
      "0x1AD841EA7A95C2Fd3BBA0812E538E9061A9F743b",
    ],
    result: [2000, 4000, 5000],
    totalFunded: 11000,
    launchedAt: 1690129908000,
    finalizedAt: 1690129908000,
    failedAt: 1690129908000,
  },
];

export default function Dashboard() {
  return (
    <MainLayoutWrapper
      overview={{
        title: "Dashboard",
        des: "Explore investment opportunities in the latest campaign and checkout previously funded projects.",
      }}
    >
      <Box mb={2}>
        <Typography variant="h2">Latest Funding Round</Typography>
      </Box>
      <Box mb={2}>
        <LatestCampaign daos={daoListData} />
      </Box>
      <Box mb={2}>
        <Typography variant="h2">Previous Funding Rounds</Typography>
      </Box>
      <Box mb={2}>
        <CampaignList campaigns={campaignListData} />
      </Box>
    </MainLayoutWrapper>
  );
}

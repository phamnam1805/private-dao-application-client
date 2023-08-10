import {
  Avatar,
  Box,
  Collapse,
  Grid,
  Hidden,
  IconButton,
  makeStyles,
  Paper,
  Tooltip,
  Typography,
  useMediaQuery,
  useTheme,
} from "@material-ui/core";
import { useState } from "react";
import CampaignItem from "./CampaignItem";

const useStyle = makeStyles((theme) => ({}));

export default function CampaignList({ campaigns }) {
  return (
    <div>
      {[...campaigns].reverse().map((e, i) => (
        <CampaignItem key={i} campaign={e} />
      ))}
    </div>
  );
}

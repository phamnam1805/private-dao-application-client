import { Box, LinearProgress, Tooltip } from "@material-ui/core";

export default function ResultBar({ option, value, ratio }) {
  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "3px" }}>
        <span>
          <span style={{ marginRight: "18px", display: "inline-block", width: "55px" }}>{option}</span>
          <Tooltip title={Number(value)} arrow placement="right">
            <span style={{}}>{value} {value > 0 && "ETH"}</span>
          </Tooltip>
        </span>
        <span>{Math.round(ratio * 100) / 100}%</span>
      </div>
      <Box sx={{ width: "100%", mr: 1, paddingY: 0.3 }}>
        <LinearProgress variant="determinate" color="primary" value={ratio} />
      </Box>
    </div>
  );
}

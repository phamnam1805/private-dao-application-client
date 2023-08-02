import { Box, Typography } from "@material-ui/core";
import ReactTextTransition from "react-text-transition";
import { splitDecimalNumber, toFixed } from "src/services/utility";

export default function TransitionTypography({ animatedText, moreText, ...props }) {
  return (
    <Box display="inline-flex">
      <Typography {...props}>{moreText.start}</Typography>
      <Box>
        {String(animatedText)
          .split("")
          .map((n, index) => (
            <ReactTextTransition key={index} text={n} overflow inline />
          ))}
      </Box>
      <Typography {...props}>{moreText.end}</Typography>
    </Box>
  );
}

export function HealthFactorTypography({ healthFactor, ...props }) {
  return healthFactor ? (
    <>
      {healthFactor > 100 ? (
        <Typography {...props}>Health Factor: 100+</Typography>
      ) : (
        <>
          {(() => {
            const splitArr = splitDecimalNumber(toFixed(healthFactor, 4));
            return (
              <TransitionTypography
                {...props}
                moreText={{ start: `Health Factor: ${splitArr[1]}.` }}
                animatedText={splitArr[2]}
              />
            );
          })()}
        </>
      )}
    </>
  ) : (
    <Typography {...props}>Health Factor: ---</Typography>
  );
}

import { Box, useMediaQuery } from "@material-ui/core";
import { useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import AllowedNetworkWrapper from "src/components/Wrappers/AllowedNetworkWrapper";
import MainLayoutWrapper from "src/components/Wrappers/MainLayoutWrapper";
import { CHAIN_ALIASES } from "src/configs/connection-config";
import { StepStatus } from "src/redux/createDAODataSlice";
import FirstStep from "./FirstStep";
import CreateDAOLayout from "./CreateDAOLayout";
import PAOStepper from "src/components/PAOStepper";

function CreateDAOComponent() {
  const changeTarget = useRef();
  const { chainId } = useSelector((state) => state.configSlice);
  const { accountAddress } = useSelector((state) => state.accountDataSlice);

  useEffect(() => {
    if (accountAddress && (chainId == CHAIN_ALIASES.HARDHAT_LOCAL || chainId == CHAIN_ALIASES.SEPOLIA_TESTNET)) {
      if (!changeTarget.current) {
        changeTarget.current = [accountAddress];
      } else if ((changeTarget.current[0] !== changeTarget.current[1]) !== accountAddress) {
        changeTarget.current = [accountAddress];
      }
    }
  }, [chainId, accountAddress]);

  return (
    <MainLayoutWrapper
      overview={{
        title: "DAO Creation",
        des: "Create a DAO for your team/organization with custom configuration",
      }}
    >
      <AllowedNetworkWrapper
        allowedNetworks={[CHAIN_ALIASES.HARDHAT_LOCAL, CHAIN_ALIASES.SEPOLIA_TESTNET]}
        helperText="Please switch network"
      >
        <CreateDAOLayout />
      </AllowedNetworkWrapper>
    </MainLayoutWrapper>
  );
}

export default function CreateDAO() {
  const { chainId } = useSelector((state) => state.configSlice);
  const mdDown = useMediaQuery((theme) => theme.breakpoints.down("md"));

  return chainId == CHAIN_ALIASES.HARDHAT_LOCAL || chainId == CHAIN_ALIASES.SEPOLIA_TESTNET ? (
    <CreateDAOComponent />
  ) : (
    <MainLayoutWrapper
      overview={{
        title: "DAO Creation",
        des: "Create a DAO for your team/organization with custom configuration",
      }}
    >
      <Box display="flex" flexDirection={mdDown ? "column" : "row"}>
        <PAOStepper
          activeStep={0}
          activeStatus={StepStatus.INIT}
          stepCount={2}
          des={["Provide basic information", "Set up configuration"]}
        />
        <Box flexGrow={1}>
          <FirstStep des="Provide basic information" />
        </Box>
      </Box>
    </MainLayoutWrapper>
  );
}

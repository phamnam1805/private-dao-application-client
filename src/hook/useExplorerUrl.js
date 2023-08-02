import { useMemo } from "react";
import { useSelector } from "react-redux";
import { CHAIN_ALIASES } from "src/configs/connection-config";

export const EXPLORER_TYPE = {
  ADDRESS: "address",
  TRANSACTION: "transaction",
};

const exploreConfig = {
  [CHAIN_ALIASES.ETH_MAINNET]: {
    address: "https://etherscan.io/address",
    transaction: "https://etherscan.io/tx",
    label: "etherscan",
  },
  [CHAIN_ALIASES.GOERLI_TESTNET]: {
    address: "https://goerli.etherscan.io/address",
    transaction: "https://goerli.etherscan.io/tx",
    label: "goerliscan",
  },
  [CHAIN_ALIASES.SEPOLIA_TESTNET]: {
    address: "https://sepolia.etherscan.io/address",
    transaction: "https://sepolia.etherscan.io/tx",
    label: "sepoliascan",
  },
  [CHAIN_ALIASES.HARDHAT_LOCAL]: {
    address: "",
    transaction: "",
    label: "",
  },
};

export default function useExplorerUrl(hash, config = {}) {
  const { chainId: stateChainId } = useSelector((state) => state.configSlice);
  const { chainId: configChainId, type: configType, baseLink } = config;

  const chainId = configChainId ?? stateChainId;
  const type = configType ?? EXPLORER_TYPE.ADDRESS;

  return useMemo(() => {
    if (exploreConfig[chainId]) {
      const _config = exploreConfig[chainId];
      if (baseLink) return { link: `${_config[type]}`, text: _config["label"] };
      return { link: `${_config[type]}/${hash}`, text: _config["label"] };
    } else return { link: "", text: "" };
  }, [hash, chainId, type]);
}

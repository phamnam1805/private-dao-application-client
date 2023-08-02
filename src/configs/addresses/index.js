import EthMainnetAddresses from "./ethMainnet";
import GoerliTestnetAddresses from "./goerliTestnet";
import SepoliaTestnetAddresses from "./sepoliaTestnet";
import HardhatLocalAddresses from "./hardhatLocal";
import { getChainId } from "src/wallet-connection/action";
import { CHAIN_ALIASES } from "src/configs/connection-config";

export const getCurrentContractAddresses = () => {
  const chainId = Number(getChainId());
  if (chainId == CHAIN_ALIASES.ETH_MAINNET) return EthMainnetAddresses;
  else if (chainId == CHAIN_ALIASES.GOERLI_TESTNET) return GoerliTestnetAddresses;
  else if (chainId == CHAIN_ALIASES.SEPOLIA_TESTNET) return SepoliaTestnetAddresses;
  else if (chainId == CHAIN_ALIASES.HARDHAT_LOCAL) return HardhatLocalAddresses;
  else throw Error("Invalid Network!");
};

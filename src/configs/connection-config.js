import EthImage from "src/assets/images/tokens/ETH.png";

const ETH = { name: "Ethereum", symbol: "ETH", decimals: 18 };
export const CONNECTOR = { METAMASK: "metamask", WALLET_CONNECT: "walletconnect" };
export const CHAIN_ALIASES = {
  ETH_MAINNET: 1,
  GOERLI_TESTNET: 5,
  SEPOLIA_TESTNET: 11155111,
  HARDHAT_LOCAL: 31337,
};

export const CHAINS = {
  [CHAIN_ALIASES.ETH_MAINNET]: {
    name: "ETH Mainnet",
    image: EthImage,
    blockExplorerUrls: ["https://etherscan.io"],
    nativeCurrency: ETH,
    urls: ["https://nd-867-350-180.p2pify.com/783c7718e05463aa0828656842db85a7"],
  },
  [CHAIN_ALIASES.GOERLI_TESTNET]: {
    name: "Goerli Testnet",
    image: EthImage,
    blockExplorerUrls: ["https://goerli.etherscan.io"],
    nativeCurrency: ETH,
    urls: [
      "https://rpc.ankr.com/eth_goerli",
      "https://goerli.blockpi.network/v1/rpc/public",
      "https://eth-goerli.public.blastapi.io",
    ],
  },
  [CHAIN_ALIASES.SEPOLIA_TESTNET]: {
    name: "Sepolia Testnet",
    image: EthImage,
    blockExplorerUrls: ["https://sepolia.etherscan.io"],
    nativeCurrency: ETH,
    urls: [
      "https://eth-sepolia.public.blastapi.io",
      "https://gateway.tenderly.co/public/sepolia",
      "https://ethereum-sepolia.blockpi.network/v1/rpc/public",
    ],
  },
  [CHAIN_ALIASES.HARDHAT_LOCAL]: {
    name: "Hardhat Local",
    image: EthImage,
    blockExplorerUrls: [""],
    nativeCurrency: ETH,
    urls: ["https://thepao-node.auxo.fund"],
  },
};

import BigNumber from "bignumber.js";
import { BridgeIcon, GovernanceIcon, MarketsIcon, StakingIcon } from "src/components/Icon";

export const LS = {
  THEME: "theme",
  CONNECTOR: "connector",
  CHAIN_ID: "chainId",
};

export const NETWORK = {
  ETH_MAINNET: "eth",
  GOERLI_TESTNET: "goerli",
  SEPOLIA_TESTNET: "sepolia",
  HARDHAT_LOCAL: "local",
};

export const QUERY_STATE = {
  INITIAL: "INITIAL",
  FETCHING: "FETCHING",
  SUCCESS: "SUCCESS",
  FAIL: "FAIL",
  UPDATING: "UPDATING",
};

export const TX_STATE = {
  INITIAL: "INITIAL",
  WAIT_WALLET: "WAIT_WALLET",
  WALLET_REJECT: "WALLET_REJECT",
  TX_EXECUTING: "TX_EXECUTING",
  TX_FAIL: "TX_FAIL",
  TX_SUCCESS: "TX_SUCCESS",
};

export const ASSET_UNIT = {
  USD: 0,
  NATIVE: 1,
};

export const DEFAULT_ADDRESS = "0x0000000000000000000000000000000000000000";
export const SOLIDITY_MAX_INT = "115792089237316195423570985008687907853269984665640564039457584007913129639935";
export const ONE_RAY = 10 ** 27;

export const BASE18 = BigNumber("1000000000000000000");
export const BASE9 = BigNumber("1000000000");
export const BASE8 = BigNumber("100000000");
export const BASE6 = BigNumber("1000000");
export const BASE_FUNDING = BigNumber("10000000000000000");

export const BASE_E4 = 1e4;
export const BASE_E6 = 1e6;
export const BASE_E8 = 1e8;
export const BASE_E18 = 1e18;

export const THEME_MODE = {
  DARK: "dark",
  LIGHT: "light",
};

export const TX_FEE = "0.005";
export const LOCAL_RPC = "https://thepao-node.auxo.fund";
export const BACKEND_ROOT_URL = "https://thepao-server.auxo.fund";
export const IPFS_GATEWAY = "https://the-pao.infura-ipfs.io/ipfs";
export const IPFS_INFURA = "https://ipfs.infura.io:5001/api/v0";
export const IPFS_AUTH = "Basic " + btoa("2ShBHqwhCM8JAF1z9q26uXxdP0N" + ":" + "e772f39e769704e27a3e07b3a7caeae9");
export const IPFS_HASHES = {
  DEFAULT_LOGO: "QmZQv8kYZuudFdczKSN16WvfYbszxFaoczSjVCew7HWFTj",
};
export const generateApplyFundingRoundProposal = (address) => ({
  actions: [
    {
      target: address,
      value: 0,
      signature: "applyForFunding()",
      data: "0x",
    },
  ],
  descriptionHash: "0x" + [...Array(64)].map(() => Math.floor(Math.random() * 16).toString(16)).join(""),
});

export const LinkType = {
  NAV: "navLink",
  LINK: "link",
  EXTERNAL: "externalLink",
  NONE: "none",
};

export const LayoutConfig = [
  {
    label: "DAOs",
    icon: GovernanceIcon,
    to: "/daos",
    isActive: (_, location) => location.pathname.includes("dao"),
    subTitle: "DAOs",
    subTab: [],
  },
  {
    label: "Investment",
    icon: MarketsIcon,
    to: "/investments",
    isActive: (_, location) => location.pathname.includes("investment"),
    subTitle: "Investments Management",
    subTab: [
      { label: "Dashboard", to: "/investment-dashboard", type: LinkType.NAV },
      { label: "Portfolio", to: "/investment-portfolio", type: LinkType.NAV },
    ],
  },
  {
    label: "Committee",
    icon: StakingIcon,
    to: "/committee",
    isActive: (_, location) => location.pathname.includes("committee") || location.pathname.includes("contribution"),
    subTitle: "DKG Contribution",
    subTab: [
      { label: "Key Generation", to: "/contribution-keygen", type: LinkType.NAV },
      { label: "Key Requests", to: "/contribution-request", type: LinkType.NAV },
    ],
  },
];

export const EcosystemConfig = [];

export const COMMITTEE = {
  T: 3,
  N: 5,
};

export const KEY_TYPE = {
  FUNDING: 0,
  VOTING: 1,
};

export const KEY_TYPE_ALIAS = {
  [KEY_TYPE.FUNDING]: "Funding",
  [KEY_TYPE.VOTING]: "Voting",
};

export const CONTRIBUTION_TYPE = {
  KEY_GENERATION: 0,
  KEY_REQUEST: 1,
};

export const CONTRIBUTION_TYPE_ALIAS = {
  [CONTRIBUTION_TYPE.KEY_GENERATION]: "Key Generation Contribution",
  [CONTRIBUTION_TYPE.KEY_REQUEST]: "Key Request Contribution",
};

export const KEY_STATE = {
  CONTRIBUTION_ROUND_1: 0,
  CONTRIBUTION_ROUND_2: 1,
  ACTIVE: 2,
  DISABLED: 3,
};

export const KEY_STATE_ALIAS = {
  [KEY_STATE.CONTRIBUTION_ROUND_1]: "Round 1",
  [KEY_STATE.CONTRIBUTION_ROUND_2]: "Round 2",
  [KEY_STATE.ACTIVE]: "Active",
  [KEY_STATE.DISABLED]: "Disabled",
};

export const KEY_REQUEST_STATE = {
  CONTRIBUTION: 0,
  RESULT_AWAITING: 1,
  RESULT_SUBMITTED: 2,
};

export const KEY_REQUEST_STATE_ALIAS = {
  [KEY_REQUEST_STATE.CONTRIBUTION]: "Contribution",
  [KEY_REQUEST_STATE.RESULT_AWAITING]: "Waiting Result",
  [KEY_REQUEST_STATE.RESULT_SUBMITTED]: "Result Submitted",
};

export const FUNDING_STATE = {
  PENDING: 0,
  ACTIVE: 1,
  TALLYING: 2,
  SUCCEEDED: 3,
  FINALIZED: 4,
  FAILED: 5,
};

export const FUNDING_STATE_ALIAS = {
  [FUNDING_STATE.PENDING]: "Pending",
  [FUNDING_STATE.ACTIVE]: "Active",
  [FUNDING_STATE.TALLYING]: "Tallying",
  [FUNDING_STATE.SUCCEEDED]: "Succeeded",
  [FUNDING_STATE.FINALIZED]: "Finalized",
  [FUNDING_STATE.FAILED]: "Failed",
};

export const PROPOSAL_STATE = {
  PENDING: 0,
  ACTIVE: 1,
  TALLYING: 2,
  CANCELED: 3,
  DEFEATED: 4,
  SUCCEEDED: 5,
  QUEUED: 6,
  EXPIRED: 7,
  EXECUTED: 8,
};

export const PROPOSAL_STATE_ALIAS = {
  [PROPOSAL_STATE.PENDING]: "Pending",
  [PROPOSAL_STATE.ACTIVE]: "Active",
  [PROPOSAL_STATE.TALLYING]: "Tallying",
  [PROPOSAL_STATE.CANCELED]: "Canceled",
  [PROPOSAL_STATE.DEFEATED]: "Defeated",
  [PROPOSAL_STATE.SUCCEEDED]: "Succeeded",
  [PROPOSAL_STATE.QUEUED]: "Queued",
  [PROPOSAL_STATE.EXPIRED]: "Expired",
  [PROPOSAL_STATE.EXECUTED]: "Executed",
};

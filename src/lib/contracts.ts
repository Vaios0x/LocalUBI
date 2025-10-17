// Contract addresses and ABIs
export const TANDA_ADDRESS = (process.env.NEXT_PUBLIC_TANDA_ADDRESS || "0x0000000000000000000000000000000000000000") as `0x${string}`;
export const GOODDOLLAR_ADDRESS = "0x62B8B11039FcfE5aB0C56E502b1C372A3d2a9c7A" as `0x${string}`;
export const CUSD_ADDRESS = "0x765DE816845861e75A25fCA122bb6898B8B1282a" as `0x${string}`;

export const TANDA_ABI = [
  {
    "inputs": [
      {"internalType": "uint256", "name": "_monthlyAmount", "type": "uint256"},
      {"internalType": "uint8", "name": "_maxMembers", "type": "uint8"},
      {"internalType": "uint256", "name": "_cycleFrequency", "type": "uint256"}
    ],
    "name": "createTanda",
    "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "uint256", "name": "_tandaId", "type": "uint256"}],
    "name": "joinTanda",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "uint256", "name": "_tandaId", "type": "uint256"}],
    "name": "payRound",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "uint256", "name": "_tandaId", "type": "uint256"}],
    "name": "getTandaDetails",
    "outputs": [
      {"internalType": "uint256", "name": "id", "type": "uint256"},
      {"internalType": "address", "name": "creator", "type": "address"},
      {"internalType": "uint256", "name": "monthlyAmount", "type": "uint256"},
      {"internalType": "uint8", "name": "maxMembers", "type": "uint8"},
      {"internalType": "uint8", "name": "currentMembers", "type": "uint8"},
      {"internalType": "uint8", "name": "currentRound", "type": "uint8"},
      {"internalType": "bool", "name": "isActive", "type": "bool"},
      {"internalType": "bool", "name": "isCompleted", "type": "bool"},
      {"internalType": "uint256", "name": "startTime", "type": "uint256"}
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "address", "name": "_user", "type": "address"}],
    "name": "getUserTandas",
    "outputs": [{"internalType": "uint256[]", "name": "", "type": "uint256[]"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {"internalType": "uint256", "name": "_tandaId", "type": "uint256"},
      {"internalType": "uint8", "name": "_round", "type": "uint8"},
      {"internalType": "address", "name": "_user", "type": "address"}
    ],
    "name": "hasUserPaidRound",
    "outputs": [{"internalType": "bool", "name": "", "type": "bool"}],
    "stateMutability": "view",
    "type": "function"
  }
] as const;

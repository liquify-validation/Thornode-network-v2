import {
  BlockIcon,
  BondIcon,
  BondOverTimeIcon,
  ChurnTimeUntilIcon,
  DayHighIcon,
  DayLowIcon,
  DayVolumeIcon,
  MarketCapIcon,
  MarketCapRankingIcon,
  MaxEffectiveBondIcon,
  PriceIcon,
  TotalSupplyIcon,
} from "../assets";

const statsData = [
  {
    title: "Current Block",
    stat: "123,456",
    icon: BlockIcon,
  },
  {
    title: "Total Bonded Value",
    stat: "$1,234,567",
    icon: BondIcon,
  },
  {
    title: "24hr Volume",
    stat: "$12,345",
    icon: DayVolumeIcon,
  },
  {
    title: "Total Bond Over Time",
    stat: "$5,678,910",
    icon: BondOverTimeIcon,
  },
  {
    title: "24 HR High",
    stat: "$15,000",
    icon: DayHighIcon,
  },
  {
    title: "Market Cap Rank",
    stat: "#123",
    icon: MarketCapRankingIcon,
  },
  {
    title: "(Churn) Time Until",
    stat: "2h 34m",
    icon: ChurnTimeUntilIcon,
  },
  {
    title: "Market Cap",
    stat: "$1,000,000,000",
    icon: MarketCapIcon,
  },
  {
    title: "Max Effective Bond",
    stat: "$100,000",
    icon: MaxEffectiveBondIcon,
  },
  {
    title: "Price",
    stat: "$1.23",
    icon: PriceIcon,
  },
  {
    title: "24hr Low",
    stat: "$0.90",
    icon: DayLowIcon,
  },
  {
    title: "Total Supply",
    stat: "1,000,000",
    icon: TotalSupplyIcon,
  },
];

export default statsData;

export const maxEffectiveBondData = [
  { blockHeight: 6729521, bondValue: 98000 },
  { blockHeight: 6729521, bondValue: 75000 },
  { blockHeight: 6729521, bondValue: 85000 },
  { blockHeight: 14729521, bondValue: 95000 },
  { blockHeight: 16729521, bondValue: 105000 },
  { blockHeight: 18729521, bondValue: 120000 },
];

export const totalBondOverTimeData = [
  { blockHeight: 1, bondValue: 200 },
  { blockHeight: 2, bondValue: 210 },
  { blockHeight: 3, bondValue: 220 },
  { blockHeight: 4, bondValue: 230 },
];

export const priceChartData = [
  { blockHeight: 1, bondValue: 50 },
  { blockHeight: 2, bondValue: 52 },
  { blockHeight: 3, bondValue: 54 },
  { blockHeight: 4, bondValue: 53 },
];

export const locationData = [
  { name: "United States", value: 400 },
  { name: "Canada", value: 300 },
  { name: "United Kingdom", value: 300 },
  { name: "Germany", value: 200 },
  { name: "France", value: 100 },
  { name: "Australia", value: 100 },
  { name: "India", value: 50 },
  { name: "China", value: 50 },
  { name: "Brazil", value: 30 },
  { name: "South Africa", value: 20 },
];

export const ispData = [
  { name: "Comcast", value: 500 },
  { name: "AT&T", value: 400 },
  { name: "Verizon", value: 300 },
  { name: "Charter", value: 200 },
  { name: "Cox", value: 100 },
  { name: "Spectrum", value: 50 },
  { name: "CenturyLink", value: 50 },
  { name: "Frontier", value: 30 },
  { name: "Windstream", value: 20 },
  { name: "Mediacom", value: 10 },
];

export const generateRandomNodeAddress = () => {
  const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
  let result = "thor1";
  for (let i = 0; i < 16; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

export const topNodes = Array.from({ length: 5 }, () => ({
  address: generateRandomNodeAddress(),
}));

export const bottomNodes = Array.from({ length: 5 }, () => ({
  address: generateRandomNodeAddress(),
}));

export const networkConfigTableColumns = [
  {
    Header: "Source",
    accessor: "source",
  },
  {
    Header: "Key",
    accessor: "key",
  },
  {
    Header: "Value",
    accessor: "value",
  },
  {
    Header: "Default",
    accessor: "default",
  },
  {
    Header: "Type",
    accessor: "type",
  },
  {
    Header: "Change",
    accessor: "change",
  },
];

export const networkConfigTableData = [
  {
    source: "MIMIR",
    key: "ADR012",
    value: "1",
    default: "-",
    type: "Number",
    change: "-",
  },
  {
    source: "CONST",
    key: "theme",
    value: "20",
    default: "-",
    type: "String",
    change: "-",
  },
  {
    source: "MIMIR",
    key: "autoUpdate",
    value: "1",
    default: "-",
    type: "String",
    change: "-",
  },
  {
    source: "MIMIR",
    key: "maxConnections",
    value: "100",
    default: "50",
    type: "Number",
    change: "Yes",
  },
  {
    source: "CONST",
    key: "theme",
    value: "720",
    default: "90",
    type: "Number",
    change: "No",
  },
  {
    source: "CONST",
    key: "autoUpdate",
    value: "1",
    default: "-",
    type: "Number",
    change: "Yes",
  },
  {
    source: "MIMIR",
    key: "maxConnections",
    value: "100",
    default: "50",
    type: "Integer",
    change: "Yes",
  },
  {
    source: "MIMIR",
    key: "theme",
    value: "5000",
    default: "100",
    type: "String",
    change: "-",
  },
  {
    source: "CONST",
    key: "autoUpdate",
    value: "1",
    default: "-",
    type: "Number",
    change: "Yes",
  },
  {
    source: "MIMIR",
    key: "maxConnections",
    value: "100",
    default: "50",
    type: "Number",
    change: "Yes",
  },
  {
    source: "MIMIR",
    key: "theme",
    value: "1",
    default: "0",
    type: "String",
    change: "-",
  },
  {
    source: "MIMIR",
    key: "autoUpdate",
    value: "500",
    default: "40",
    type: "Number",
    change: "-",
  },
];

export const networkChurnsTableColumns = [
  {
    Header: "Churn",
    accessor: "churn",
  },
  {
    Header: "Height",
    accessor: "height",
  },
  {
    Header: "Blocks",
    accessor: "blocks",
  },
  {
    Header: "Event",
    accessor: "event",
  },
  {
    Header: "Duration",
    accessor: "duration",
  },
];

export const networkChurnsTableData = [
  {
    churn: "276",
    height: "18,743,311",
    blocks: "45,064",
    event: "Tue, Nov 26, 2024, 11:38 AM	",
    duration: "3.19 days",
  },
  {
    churn: "275",
    height: "18,698,247",
    blocks: "44,859",
    event: "Sat, Nov 23, 2024, 07:04 AM",
    duration: "3.18 days",
  },
  {
    churn: "274",
    height: "18,653,388",
    blocks: "45,576",
    event: "Wed, Nov 20, 2024, 02:47 AM	",
    duration: "3.22 days",
  },
  {
    churn: "273",
    height: "18,607,812",
    blocks: "71,510",
    event: "Sat, Nov 16, 2024, 09:30 PM	",
    duration: "5.04 days",
  },
  {
    churn: "272",
    height: "18,536,302",
    blocks: "58,431",
    event: "Mon, Nov 11, 2024, 08:29 PM",
    duration: "4.11 days",
  },
  {
    churn: "271",
    height: "18,477,871",
    blocks: "153,257",
    event: "Thu, Nov 07, 2024, 05:56 PM	",
    duration: "10.90 days",
  },
  {
    churn: "270",
    height: "18,324,614",
    blocks: "46,193",
    event: "Sun, Oct 27, 2024, 08:21 PM",
    duration: "3.22 days",
  },
  {
    churn: "269",
    height: "18,278,421",
    blocks: "44,955",
    event: "Thu, Oct 24, 2024, 04:00 PM",
    duration: "3.15 days",
  },
  {
    churn: "268",
    height: "18,233,466",
    blocks: "52,774	",
    event: "Mon, Oct 21, 2024, 12:22 PM",
    duration: "3.69 days",
  },
  {
    churn: "267",
    height: "18,180,692",
    blocks: "51,855",
    event: "Thu, Oct 17, 2024, 07:44 PM",
    duration: "3.62 days",
  },
  {
    churn: "266",
    height: "18,128,837",
    blocks: "49,468",
    event: "Mon, Oct 14, 2024, 04:44 AM",
    duration: "3.46 days",
  },
];

export const MAX_VOTES = 100;

export const votingData = [
  {
    id: 1,
    title: "Mimir Setting 1",
    consensus: 60,
    votesNeeded: 60,
    options: [
      { name: "Yes", value: 40 },
      { name: "No", value: 15 },
    ],
  },
  {
    id: 2,
    title: "Mimir Setting 2",
    consensus: 75,
    votesNeeded: 75,
    options: [
      { name: "Choice A", value: 25 },
      { name: "Choice B", value: 10 },
      { name: "Choice C", value: 15 },
    ],
  },
  {
    id: 3,
    title: "Mimir Setting 3",
    consensus: 50,
    votesNeeded: 50,
    options: [{ name: "SingleOption", value: 30 }],
  },
  {
    id: 4,
    title: "Gas Fee Param",
    consensus: 66,
    votesNeeded: 66,
    options: [
      { name: "Lower", value: 20 },
      { name: "Increase", value: 30 },
    ],
  },
  {
    id: 5,
    title: "Chain Pause/Resume",
    consensus: 80,
    votesNeeded: 80,
    options: [
      { name: "Pause", value: 30 },
      { name: "Resume", value: 40 },
    ],
  },
  {
    id: 6,
    title: "Network Upgrade X",
    consensus: 55,
    votesNeeded: 55,
    options: [
      { name: "Approve", value: 10 },
      { name: "Reject", value: 5 },
    ],
  },
  {
    id: 7,
    title: "Whitelist Asset",
    consensus: 70,
    votesNeeded: 70,
    options: [
      { name: "BTC", value: 25 },
      { name: "ETH", value: 30 },
      { name: "None", value: 5 },
    ],
  },
  {
    id: 8,
    title: "Validator Slash Rule",
    consensus: 50,
    votesNeeded: 50,
    options: [
      { name: "Strict", value: 35 },
      { name: "Lenient", value: 10 },
    ],
  },
  {
    id: 9,
    title: "Block Size Increase",
    consensus: 60,
    votesNeeded: 60,
    options: [
      { name: "Yes", value: 50 },
      { name: "No", value: 5 },
    ],
  },
  {
    id: 10,
    title: "Custom Param Y",
    consensus: 90,
    votesNeeded: 90,
    options: [
      { name: "Option1", value: 40 },
      { name: "Option2", value: 30 },
      { name: "Option3", value: 10 },
    ],
  },
];

export const runepoolTableColumns = [
  {
    Header: "Asset",
    accessor: "asset",
  },
  {
    Header: "Price",
    accessor: "price",
  },
  {
    Header: "Balance",
    accessor: "balance",
  },
  {
    Header: "Valuation",
    accessor: "valuation",
  },
  {
    Header: "Trade Pool (%)",
    accessor: "tradePoolPercentage",
  },
];

export const runepoolTableData = [
  {
    asset: "BTC",
    price: "$28,600",
    balance: "100",
    valuation: "$2,860,000",
    tradePoolPercentage: "40%",
  },
  {
    asset: "ETH",
    price: "$1,800",
    balance: "300",
    valuation: "$540,000",
    tradePoolPercentage: "20%",
  },
  {
    asset: "AVAX",
    price: "$15",
    balance: "5,000",
    valuation: "$75,000",
    tradePoolPercentage: "10%",
  },
  {
    asset: "BCH",
    price: "$120",
    balance: "500",
    valuation: "$60,000",
    tradePoolPercentage: "10%",
  },
  {
    asset: "LTC",
    price: "$90",
    balance: "300",
    valuation: "$27,000",
    tradePoolPercentage: "5%",
  },
  {
    asset: "USDT",
    price: "$1.00",
    balance: "50,000",
    valuation: "$50,000",
    tradePoolPercentage: "5%",
  },
  {
    asset: "BNB",
    price: "$300",
    balance: "100",
    valuation: "$30,000",
    tradePoolPercentage: "5%",
  },
  {
    asset: "USDC",
    price: "$1.00",
    balance: "20,000",
    valuation: "$20,000",
    tradePoolPercentage: "5%",
  },
];

export const vaultsTableColumns = [
  {
    Header: "Status",
    accessor: "status",
  },
  {
    Header: "Vault",
    accessor: "vaultName",
  },
  {
    Header: "Favorite",
    accessor: "favorite",
  },
  {
    Header: "Age",
    accessor: "age",
  },
  {
    Header: "Height",
    accessor: "height",
  },
  {
    Header: "Chains",
    accessor: "chains",
  },
  {
    Header: "Nodes",
    accessor: "nodes",
  },
  {
    Header: "In",
    accessor: "inValue",
  },
  {
    Header: "Out",
    accessor: "outValue",
  },
  {
    Header: "Valuation",
    accessor: "valuation",
  },
];

export const vaultsTableData = [
  {
    id: 1,
    status: "active",
    vaultName: "Thor Vault #1",
    age: "12d",
    height: "730,000",
    chains: "BTC, ETH",
    nodes: "24",
    inValue: "1,200",
    outValue: "800",
    valuation: "$50,000",
  },
  {
    id: 2,
    status: "retired",
    vaultName: "Thor Vault #2",
    age: "100d",
    height: "600,000",
    chains: "ETH",
    nodes: "12",
    inValue: "400",
    outValue: "300",
    valuation: "$18,000",
  },
  {
    id: 3,
    status: "active",
    vaultName: "Thor Vault #3",
    age: "5d",
    height: "950,000",
    chains: "BTC, AVAX",
    nodes: "30",
    inValue: "2,000",
    outValue: "1,700",
    valuation: "$75,000",
  },
  {
    id: 4,
    status: "retired",
    vaultName: "Thor Vault #4",
    age: "20d",
    height: "660,000",
    chains: "BCH",
    nodes: "5",
    inValue: "250",
    outValue: "400",
    valuation: "$12,000",
  },
];

export const vaultDetailColumns = [
  { Header: "Asset", accessor: "asset" },
  { Header: "Address", accessor: "address" },
  { Header: "Balance", accessor: "balance" },
  { Header: "Price", accessor: "price" },
  { Header: "Valuation", accessor: "valuation" },
];

export const vaultDetailMap = {
  1: [
    {
      asset: "BTC",
      address: "thor1vwqz5hhh5un28qlz6x5f8zczj39jqwel38q2kc",
      balance: "2.0",
      price: "$28,600",
      valuation: "$57,200",
    },
    {
      asset: "ETH",
      address: "thor1h6h54d7jutljwt46qzt2w7nnyuswwv045kmshl",
      balance: "50",
      price: "$1,800",
      valuation: "$90,000",
    },
  ],
  2: [
    {
      asset: "ETH",
      address: "thor1m45tc3uw4egzw9v2j39x47ds926ynfducvt9fx",
      balance: "10",
      price: "$1,800",
      valuation: "$18,000",
    },
    {
      asset: "BCH",
      address: "thor12jrhy6mqxtff6utq4kkavtvmqz4qxtztxxnk4j",
      balance: "100",
      price: "$120",
      valuation: "$12,000",
    },
  ],
  3: [
    {
      asset: "BTC",
      address: "thor12jrhy6mqxtff6utq4kkavtvmqz4qxtztxxnk4j",
      balance: "5.0",
      price: "$28,600",
      valuation: "$143,000",
    },
    {
      asset: "AVAX",
      address: "thor12jrhy6mqxtff6utq4kkavtvmqz4qxtztxxnk4j",
      balance: "250",
      price: "$15",
      valuation: "$3,750",
    },
  ],
  4: [
    {
      asset: "BCH",
      address: "thor12jrhy6mqxtff6utq4kkavtvmqz4qxtztxxnk4j",
      balance: "200",
      price: "$120",
      valuation: "$24,000",
    },
  ],
};

export const vaultDetailData = [
  {
    asset: "BTC",
    address: "thor12jrhy6mqxtff6utq4kkavtvmqz4qxtztxxnk4j",
    balance: "5.0",
    price: "$28,600",
    valuation: "$143,000",
  },
  {
    asset: "ETH",
    address: "thor12jrhy6mqxtff6utq4kkavtvmqz4qxtztxxnk4j",
    balance: "100",
    price: "$1,800",
    valuation: "$180,000",
  },
  {
    asset: "USDC",
    address: "thor12jrhy6mqxtff6utq4kkavtvmqz4qxtztxxnk4j",
    balance: "2,000",
    price: "$1.00",
    valuation: "$2,000",
  },
];

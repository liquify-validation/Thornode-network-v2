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

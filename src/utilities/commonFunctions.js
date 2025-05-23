import {
  BitcoinIcon,
  EthIcon,
  LitecoinLogo,
  BaseIcon,
  BitcoinCashIcon,
  AvalancheIcon,
  BnbIcon,
  DogeIcon,
  DigitalOceanIcon,
  LeasewebIcon,
  AwsLogo,
  ComCastIcon,
  HetznerIcon,
  DataCampIcon,
  ChoopaIcon,
  ZenLayerIcon,
  HostingerIcon,
  GoogleIcon,
  CogentIcon,
  MicrosoftAzureIcon,
  CloudzyIcon,
  Level3Icon,
  ConstantCompanyIcon,
  OvhIcon,
  MevSpaceIcon,
  IpaxIcon,
  ScaleawayIcon,
  AussieBroadbandIcon,
  EarthLinkIcon,
  TimeWarpIcon,
} from "../assets";

export const ispLogos = {
  "Cogent Communications": CogentIcon,
  "Google LLC": GoogleIcon,
  DigitalOcean: DigitalOceanIcon,
  DIGITALOCEAN: DigitalOceanIcon,
  "DigitalOcean, LLC": DigitalOceanIcon,
  "Hetzner Online GmbH": HetznerIcon,
  "Microsoft Corporation": MicrosoftAzureIcon,
  "RouterHosting LLC": CloudzyIcon, // Cloudzy
  Choopa: ChoopaIcon,
  Amazon: AwsLogo,
  "Amazon Technologies Inc.": AwsLogo,
  "Amazon.com, Inc.": AwsLogo,
  "Amazon.com": AwsLogo,
  "Level 3 Coummincations, Inc.": Level3Icon,
  "Level 3 Communications, Inc.	": Level3Icon,
  "Level 3 Communications, Inc.": Level3Icon,
  "The Constant Company": ConstantCompanyIcon,
  "The Constant Company, LLC": ConstantCompanyIcon,
  "Comcast Cable Communications, LLC": ComCastIcon,
  "OVH SAS": OvhIcon,
  Leasweb: LeasewebIcon,
  "Leaseweb UK Limited": LeasewebIcon,
  "Leaseweb DE": LeasewebIcon,
  "Leaseweb USA, Inc.": LeasewebIcon,
  "Zenlayer Inc": ZenLayerIcon,
  "DataCamp Limited": DataCampIcon,
  "Datacamp Limited": DataCampIcon,
  "MEVSPACE sp. z o.o": MevSpaceIcon,
  "MEVSPACE sp. z o.o.": MevSpaceIcon,
  "IPAX OG": IpaxIcon,
  "Online S.A.S.": ScaleawayIcon, //Scaleway
  "Aussie Broadband": AussieBroadbandIcon,
  EarthLink: EarthLinkIcon,
  Hostinger: HostingerIcon,
  "Hostinger International Limited": HostingerIcon,
  HOSTINGER: HostingerIcon,
  "TIMEWARP IT Consulting GmbH": TimeWarpIcon,
};

export const chainIcons = {
  BTC: BitcoinIcon,
  ETH: EthIcon,
  LTC: LitecoinLogo,
  BCH: BitcoinCashIcon,
  DOGE: DogeIcon,
  AVAX: AvalancheIcon,
  BASE: BaseIcon,
  BSC: BnbIcon,
};

// Helper function to convert seconds to a time object
export const secondsToTimeObject = (seconds) => {
  const absSeconds = Math.abs(seconds);
  const days = Math.floor(absSeconds / (3600 * 24));
  const hours = Math.floor((absSeconds % (3600 * 24)) / 3600);
  const minutes = Math.floor((absSeconds % 3600) / 60);
  const secs = Math.floor(absSeconds % 60);
  return { days, hours, minutes, seconds: secs };
};

// Helper function to calculate APY
export const calculateApy = (item, ratioRewardsAPY, churnsInYear) => {
  const currentAward = item.current_award / ratioRewardsAPY / 1e8;
  const bond = item.bond / 1e8;

  if (bond === 0) return "0.00%"; // Prevent division by zero

  const apy = ((currentAward * churnsInYear) / bond) * 100;
  return `${apy.toFixed(2)}%`;
};

// Helper function to parse and structure observe chains
export const parseObserveChains = (observeChains) => {
  if (!observeChains) return {};
  return observeChains.reduce((obj, chain) => {
    obj[chain.chain] = chain.height;
    return obj;
  }, {});
};

// Helper function to get max height for a chain
export const getMaxHeightForChain = (data, chain) => {
  const heights = data
    .map((item) => item.find((chainData) => chainData.chain === chain))
    .filter(Boolean)
    .map((chainData) => chainData.height);
  return heights.length ? Math.max(...heights) : null;
};

export const getChurnTitle = (globalData) => {
  if (globalData.churnTry && globalData.retiring === "false") {
    return "(CHURN) RETRY IN";
  } else if (globalData.retiring === "true") {
    return "(CHURN) CURRENTLY CHURNING";
  } else {
    return "(CHURN) TIME UNTIL";
  }
};

export const getTimeToDisplay = (globalData) => {
  if (globalData.churnTry && globalData.retiring === "false") {
    const { days, hours, minutes } = globalData.timeUntilRetry;
    return `${days}d ${hours}h ${minutes}m`;
  } else if (globalData.retiring === "true") {
    return "Churning";
  } else {
    const { days, hours, minutes } = globalData.timeUntilChurn;
    return `${days}d ${hours}h ${minutes}m`;
  }
};

export const calculateTotalBondedValue = (nodesData, globalData) => {
  const activeNodes = nodesData.filter((node) => node.status === "Active");

  const totalBondedRune =
    activeNodes.length > 0
      ? activeNodes.reduce((sum, node) => sum + (node.bond || 0), 0) / 1e8
      : 0;

  return totalBondedRune;
};

export const copyToClipboard = (text) => {
  navigator.clipboard
    .writeText(text)
    .then(() => {
      alert("Node address copied to clipboard!");
    })
    .catch(() => {
      alert("Failed to copy node address.");
    });
};

export const transformGraphData = (graphData) => {
  if (!graphData || !graphData.Xticks) return [];

  return graphData.Xticks.map((block, idx) => ({
    blockHeight: block,
    bond: graphData.bond?.[idx] || 0,
    position: graphData.position?.[idx] || 0,
    maxPosition: graphData.maxPosition?.[idx] || 0,
    rewards: graphData.rewards?.[idx] || 0,
  }));
};

export function getISPsData(nodes) {
  const ispMap = {};

  nodes.forEach((node) => {
    const rawISP = node.isp?.trim() || "Unknown";

    const mappedISP = ispNameMapping[rawISP] || rawISP;

    if (!ispMap[mappedISP]) {
      ispMap[mappedISP] = 0;
    }
    ispMap[mappedISP]++;
  });

  return Object.keys(ispMap).map((isp) => ({
    name: isp,
    value: ispMap[isp],
  }));
}

export const ispNameMapping = {
  "DigitalOcean, LLC": "DigitalOcean",
  DIGITALOCEAN: "DigitalOcean",
  DigitalOcean: "DigitalOcean",

  "The Constant Company, LLC": "The Constant Company",
  "The Constant Company": "The Constant Company",
  "The Constant Company LLC": "The Constant Company",

  "Hostinger International Limited": "Hostinger",
  HOSTINGER: "Hostinger",
  Hostinger: "Hostinger",

  "Amazon.com, Inc.": "Amazon",
  "Amazon Technologies Inc.": "Amazon",
  "Amazon.com": "Amazon",

  "Leaseweb UK Limited": "Leaseweb",
  "Leaseweb DE": "Leaseweb",
  "Leaseweb USA, Inc.": "Leaseweb",

  "DataCamp Limited": "DataCamp",
  "Datacamp Limited": "DataCamp",
  Datacamp: "DataCamp",
};

export function getISPsDataWithTotal(nodes) {
  const isps = getISPsData(nodes);
  const total = isps.reduce((sum, item) => sum + item.value, 0);
  return { isps, total };
}

export function getDollarValue(runeAmount, currentPrice) {
  const runes = parseInt((runeAmount / 1e8).toFixed());
  return runes * (currentPrice || 0);
}

export function parseCoingeckoData(coingeckoStr) {
  try {
    const arr = JSON.parse(coingeckoStr || "[]");
    return arr[0] || {};
  } catch {
    return {};
  }
}

// TO DO - Clean up and use throughout delete other two functions

export const ispMappings = {
  "Cogent Communications": {
    shortName: "Cogent",
    icon: CogentIcon,
  },
  "Google LLC": {
    shortName: "Google",
    icon: GoogleIcon,
  },
  DigitalOcean: {
    shortName: "DigitalOcean",
    icon: DigitalOceanIcon,
  },
  "DigitalOcean, LLC": {
    shortName: "DigitalOcean",
    icon: DigitalOceanIcon,
  },
  "Hetzner Online GmbH": {
    shortName: "Hetzner",
    icon: HetznerIcon,
  },
  "Microsoft Corporation": {
    shortName: "Microsoft",
    icon: MicrosoftAzureIcon,
  },
  "RouterHosting LLC": {
    shortName: "RouterHosting",
    icon: CloudzyIcon,
  }, // Cloudzy
  Choopa: {
    shortName: "Choopa",
    icon: ChoopaIcon,
  },
  Amazon: {
    shortName: "Amazon",
    icon: AwsLogo,
  },
  "Amazon Technologies Inc.": {
    shortName: "Amazon",
    icon: AwsLogo,
  },
  "Amazon.com, Inc.": {
    shortName: "Amazon",
    icon: AwsLogo,
  },
  "Level 3 Communications, Inc.": {
    shortName: "Level3",
    icon: Level3Icon,
  },
  "Level 3 Coummincations, Inc.": {
    shortName: "Level3",
    icon: Level3Icon,
  },
  "Level 3 Communications, Inc. ": {
    shortName: "Level3",
    icon: Level3Icon,
  },
  "The Constant Company": {
    shortName: "Constant Co.",
    icon: ConstantCompanyIcon,
  },
  "The Constant Company, LLC": {
    shortName: "Constant Co.",
    icon: ConstantCompanyIcon,
  },
  "Comcast Cable Communications, LLC": {
    shortName: "Comcast",
    icon: ComCastIcon,
  },
  "OVH SAS": {
    shortName: "OVH",
    icon: OvhIcon,
  },
  Leasweb: {
    shortName: "Leaseweb",
    icon: LeasewebIcon,
  },
  "Leaseweb UK Limited": {
    shortName: "Leaseweb",
    icon: LeasewebIcon,
  },
  "Leaseweb DE": {
    shortName: "Leaseweb",
    icon: LeasewebIcon,
  },
  "Leaseweb USA, Inc.": {
    shortName: "Leaseweb",
    icon: LeasewebIcon,
  },
  "Zenlayer Inc": {
    shortName: "Zenlayer",
    icon: ZenLayerIcon,
  },
  "DataCamp Limited": {
    shortName: "Datacamp",
    icon: DataCampIcon,
  },
  "Datacamp Limited": {
    shortName: "Datacamp",
    icon: DataCampIcon,
  },
  "MEVSPACE sp. z o.o": {
    shortName: "MevSpace",
    icon: MevSpaceIcon,
  },
  "MEVSPACE sp. z o.o.": {
    shortName: "MevSpace",
    icon: MevSpaceIcon,
  },
  "IPAX OG": {
    shortName: "IPAX",
    icon: IpaxIcon,
  },
  "Online S.A.S.": {
    shortName: "Scaleway",
    icon: ScaleawayIcon,
  },
  "Aussie Broadband": {
    shortName: "AussieBB",
    icon: AussieBroadbandIcon,
  },
  EarthLink: {
    shortName: "EarthLink",
    icon: EarthLinkIcon,
  },
  Hostinger: {
    shortName: "Hostinger",
    icon: HostingerIcon,
  },
  "Hostinger International Limited": {
    shortName: "Hostinger",
    icon: HostingerIcon,
  },
  HOSTINGER: {
    shortName: "Hostinger",
    icon: HostingerIcon,
  },
  "TIMEWARP IT Consulting GmbH": {
    shortName: "Timewarp",
  },
};

export function shortenIspData(ispArray) {
  return ispArray.map((item) => {
    const trimmed = (item.name || "").trim();
    const match = ispMappings[trimmed];
    if (match) {
      return {
        ...item,
        name: match.shortName,
        icon: match.icon,
      };
    } else {
      return {
        ...item,
        name: trimmed,
      };
    }
  });
}

export function chainSort(rowA, rowB, columnId) {
  const valA = convertChainValue(rowA.values[columnId]);
  const valB = convertChainValue(rowB.values[columnId]);

  if (valA === valB) return 0;
  return valA > valB ? 1 : -1;
}

function convertChainValue(value) {
  if (value === "OK") return 0;
  const parsed = Number(value);
  if (isNaN(parsed)) return Infinity;
  return parsed;
}

export function getCookieValue(name) {
  const match = document.cookie.match(new RegExp(`(^| )${name}=([^;]+)`));
  return match ? decodeURIComponent(match[2]) : null;
}

export function setCookie(name, value, days = 365) {
  const date = new Date();
  date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
  document.cookie = `${name}=${encodeURIComponent(
    value
  )}; expires=${date.toUTCString()}; path=/`;
}

export const cityToCountryMap = {
  Adelaide: "AU",
  "San Jose": "US",
  Amsterdam: "NL",
  "Santa Clara": "US",
  Bengaluru: "IN",
  Hollywood: "US",
  Vienna: "AT",
  Falkenstein: "DE",
  Dublin: "IE",
  Clifton: "US",
  Warsaw: "PL",
  Sydney: "AU",
  Osaka: "JP",
  Shinagawa: "JP",
  Paris: "FR",
  Melbourne: "AU",
  Toronto: "CA",
  Singapore: "SG",
  Zaandam: "NL",
  Helsinki: "FI",
  "Council Bluffs": "US",
  Lappeenranta: "FI",
  "Frankfurt am Main": "DE",
  Ashburn: "US",
  Monroe: "US",
  "North Charleston": "US",
  "San Francisco": "US",
  Nuremberg: "DE",
  Roubaix: "FR",
  Slough: "UK",
  Bradenton: "US",
};

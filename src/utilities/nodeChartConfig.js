export const NODE_CHART_ORDER = ["bond", "rewards", "position", "slashes"];

const NODE_CHART_CONFIGS = {
  bond: {
    title: "Bond Over Time",
    chartComponent: "line",
    chartProps: {
      xAxisKey: "blockHeight",
      yAxisLabel: "Bond",
      lines: [
        {
          dataKey: "bondValue",
          name: "Bond",
          strokeColor: "#28F3B0",
          gradientStartColor: "#28F3B0",
        },
      ],
    },
  },
  rewards: {
    title: "Rewards Over Time",
    chartComponent: "line",
    chartProps: {
      xAxisKey: "blockHeight",
      yAxisLabel: "Rewards",
      lines: [
        {
          dataKey: "rewardsValue",
          name: "Rewards",
          strokeColor: "#C45985",
          gradientStartColor: "#C45985",
        },
      ],
    },
  },
  position: {
    title: "Position Over Time",
    chartComponent: "scatter",
    chartProps: {
      xAxisKey: "blockHeight",
      yAxisKey: "position",
      xAxisLabel: "Block Height",
      yAxisLabel: "Position",
      scatterPoints: [
        {
          dataKey: "position",
          name: "Position",
          fillColor: "#FFAE4C",
        },
        {
          dataKey: "maxPosition",
          name: "Max Position",
          fillColor: "#8884d8",
        },
      ],
    },
  },
  slashes: {
    title: "Slashes Over Time",
    chartComponent: "line",
    chartProps: {
      xAxisKey: "blockHeight",
      yAxisLabel: "Slashes",
      lines: [
        {
          dataKey: "slashesValue",
          name: "Slashes",
          strokeColor: "#FF5733",
          gradientStartColor: "#FF5733",
        },
      ],
    },
  },
};

export const getNodeChartConfig = (chartType) =>
  NODE_CHART_CONFIGS[chartType] || null;

import { NODE_CHART_ORDER } from "../utilities/nodeChartConfig";
import NodeChartSection from "./NodeChartSection";

const NodeDrawerCharts = ({ address, chartQueries, isDark }) =>
  NODE_CHART_ORDER.map((chartType, index) => (
    <NodeChartSection
      key={chartType}
      chartType={chartType}
      queryState={chartQueries[chartType]}
      isDark={isDark}
      modalSubtitle={`Node ${address}`}
      activateImmediately={index < 2}
    />
  ));

export default NodeDrawerCharts;

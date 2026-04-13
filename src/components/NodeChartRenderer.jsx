/* eslint-disable react/prop-types */
import { getNodeChartConfig } from "../utilities/nodeChartConfig";
import ModernLineChart from "./ModernLineChart";
import ModernScatterChart from "./ModernScatterChart";

const NodeChartRenderer = ({
  chartType,
  data,
  isDark,
  title,
  showHeader = true,
  showRangeControls = true,
  showExportButton = true,
}) => {
  const chartConfig = getNodeChartConfig(chartType);

  if (!chartConfig) {
    return null;
  }

  const chartTitle = title ?? chartConfig.title;

  if (chartConfig.chartComponent === "scatter") {
    return (
      <ModernScatterChart
        data={data}
        title={chartTitle}
        isDark={isDark}
        showHeader={showHeader}
        showRangeControls={showRangeControls}
        {...chartConfig.chartProps}
      />
    );
  }

  return (
    <ModernLineChart
      data={data}
      title={chartTitle}
      isDark={isDark}
      showHeader={showHeader}
      showRangeControls={showRangeControls}
      showExportButton={showExportButton}
      {...chartConfig.chartProps}
    />
  );
};

export default NodeChartRenderer;

/* eslint-disable react/prop-types */
import { useEffect, useRef, useState } from "react";
import { getNodeChartConfig } from "../utilities/nodeChartConfig";
import LoadingSpinner from "./LoadingSpinner";
import NodeChartModal from "./NodeChartModal";
import NodeChartRenderer from "./NodeChartRenderer";

const NodeChartSection = ({
  chartType,
  queryState,
  isDark,
  modalSubtitle,
  activateImmediately = false,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isActivated, setIsActivated] = useState(activateImmediately);
  const sectionRef = useRef(null);
  const chartConfig = getNodeChartConfig(chartType);
  const { data, isLoading, isFetching, isFetched, error } = queryState || {};
  const hasData = Boolean(data?.length);
  const isWaitingForInitialData =
    Boolean(queryState) && !error && (isLoading || (isFetching && !hasData));
  const shouldShowEmptyState = isFetched && !isFetching && !hasData;

  useEffect(() => {
    if (activateImmediately) {
      setIsActivated(true);
      return undefined;
    }

    const sectionElement = sectionRef.current;
    if (!sectionElement || isActivated || typeof IntersectionObserver === "undefined") {
      return undefined;
    }

    const scrollRoot = sectionElement.closest(".node-drawer-scroll");
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsActivated(true);
          observer.disconnect();
        }
      },
      {
        root: scrollRoot,
        rootMargin: "400px 0px",
      },
    );

    observer.observe(sectionElement);

    return () => observer.disconnect();
  }, [activateImmediately, isActivated]);

  if (!chartConfig) {
    return null;
  }

  return (
    <>
      <div ref={sectionRef} className="node-drawer-chart-section mb-4">
        <div className="mb-2 flex items-center justify-between">
          <h3 className="text-sm font-bold uppercase text-gray-400">
            {chartConfig.title}
          </h3>
          {isActivated && hasData && (
            <button
              onClick={() => setIsExpanded(true)}
              className="icon-button rounded-md border border-gray-600 bg-transparent px-2 py-0.5 text-[11px] text-gray-400 hover:border-[#28f3b0] hover:text-[#28f3b0]"
              title="Expand chart"
            >
              Expand
            </button>
          )}
        </div>

        {!isActivated ? (
          <div className="node-drawer-chart-placeholder chart-card flex min-h-[440px] items-center justify-center px-12 py-10">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Chart will load as you scroll
            </p>
          </div>
        ) : isWaitingForInitialData ? (
          <LoadingSpinner />
        ) : error ? (
          <p className="text-sm text-red-400">
            {error.message || "Error loading chart data."}
          </p>
        ) : shouldShowEmptyState ? (
          <p className="text-sm text-gray-500">No data</p>
        ) : (
          <NodeChartRenderer
            chartType={chartType}
            data={data}
            isDark={isDark}
            title={chartConfig.title}
            showHeader={false}
          />
        )}
      </div>

      {isExpanded && hasData && (
        <NodeChartModal
          title={chartConfig.title}
          subtitle={modalSubtitle}
          onClose={() => setIsExpanded(false)}
        >
          <NodeChartRenderer
            chartType={chartType}
            data={data}
            isDark={isDark}
            title={chartConfig.title}
            showHeader={false}
          />
        </NodeChartModal>
      )}
    </>
  );
};

export default NodeChartSection;

/* eslint-disable react/prop-types */
import { useMemo, useState } from "react";
import { useChurnsForNode } from "../hooks/useChurnsForNode";
import { useGenerateReport } from "../hooks/useGenerateReport";
import LoadingSpinner from "./LoadingSpinner";
import {
  normalizeNodeAddress,
  parsePositiveInteger,
} from "../utilities/commonFunctions";
import { showErrorToast } from "../services/toastService";

const ReportFilter = ({ thornodeAddress, onReportGenerated }) => {
  const safeThornodeAddress = normalizeNodeAddress(thornodeAddress);
  const [fromBlock, setFromBlock] = useState("");
  const [toBlock, setToBlock] = useState("");
  const [isFromOpen, setIsFromOpen] = useState(false);
  const [isToOpen, setIsToOpen] = useState(false);

  const {
    data: churns = [],
    isLoading: churnsLoading,
    isError: churnsError,
    error: churnsErrObj,
  } = useChurnsForNode(safeThornodeAddress);

  const {
    mutate: generateReportMutation,
    isLoading: generatingReport,
  } = useGenerateReport();

  const possibleToChurns = useMemo(() => {
    if (!churns.length || !fromBlock) return churns;
    return churns.filter((c) => Number(c.churnHeight) > Number(fromBlock));
  }, [churns, fromBlock]);

  const toggleFrom = () => {
    setIsFromOpen(!isFromOpen);
    setIsToOpen(false);
  };

  const toggleTo = () => {
    setIsToOpen(!isToOpen);
    setIsFromOpen(false);
  };

  function selectFromBlock(height) {
    setFromBlock(height);
    setIsFromOpen(false);
    if (Number(toBlock) <= Number(height)) {
      setToBlock("");
    }
  }

  function selectToBlock(height) {
    setToBlock(height);
    setIsToOpen(false);
  }

  function handleSubmit() {
    const startBlock = parsePositiveInteger(fromBlock);
    const endBlock = parsePositiveInteger(toBlock);

    if (!safeThornodeAddress) {
      showErrorToast("Please use a valid THORChain node address.");
      return;
    }

    if (!startBlock || !endBlock) {
      showErrorToast("Please select both FROM and TO block heights.");
      return;
    }

    if (startBlock >= endBlock) {
      showErrorToast("The end block must be greater than the start block.");
      return;
    }

    const payload = {
      start: startBlock,
      end: endBlock,
      node: safeThornodeAddress,
    };

    generateReportMutation(payload, {
      onSuccess: (result) => {
        onReportGenerated(result);
      },
      onError: (err) => {
        console.error("Error generating report:", err);
        showErrorToast(`Failed to generate the report: ${err.message}`);
      },
    });
  }

  if (churnsLoading) return <LoadingSpinner />;
  if (churnsError) {
    return (
      <div className="text-red-500">
        Error loading churns: {churnsErrObj?.message}
      </div>
    );
  }

  return (
    <div className="flex flex-wrap items-center gap-4 mt-6 ">
      {!safeThornodeAddress && (
        <div className="text-sm text-red-500">
          A valid THORChain node address is required before generating a report.
        </div>
      )}
      <div className="relative">
        <button
          type="button"
          onClick={toggleFrom}
          className="
            inline-flex items-center px-4 py-2
            rounded-lg bg-[#17364CCC] text-white
            hover:bg-[#17364ce0] focus:outline-none
          "
        >
          {fromBlock ? `From: Block ${fromBlock}` : "From (Start Block)"}
          <svg
            className="w-4 h-4 ml-2"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path
              d="M19 9l-7 7-7-7"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>

        {isFromOpen && (
          <div
            className="
              absolute z-10 mt-2 w-52 bg-[#17364CCC]
              text-white rounded-none shadow-lg
            "
          >
            <ul className="scrollbar-custom  max-h-64 overflow-auto">
              {churns.map((c) => (
                <li key={c.churnHeight}>
                  <button
                    type="button"
                    className="
                      block rounded-none w-full text-left px-4 py-2 text-sm
                      hover:bg-[#1E4860]
                    "
                    onClick={() => selectFromBlock(String(c.churnHeight))}
                  >
                    Block {c.churnHeight} ({c.date})
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <div className="relative">
        <button
          type="button"
          onClick={toggleTo}
          className="
            inline-flex items-center px-4 py-2
            rounded-lg bg-[#17364CCC] text-white
            hover:bg-[#17364ce0] focus:outline-none
          "
        >
          {toBlock ? `To: Block ${toBlock}` : "To (End Block)"}
          <svg
            className="w-4 h-4 ml-2"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path
              d="M19 9l-7 7-7-7"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>

        {isToOpen && (
          <div
            className="
              absolute z-10 mt-2 w-52 bg-[#17364CCC]
              text-white rounded-lg shadow-lg
            "
          >
            <ul className="scrollbar-custom max-h-64 overflow-auto">
              {possibleToChurns.map((c) => (
                <li key={c.churnHeight}>
                  <button
                    type="button"
                    className="
                      block rounded-none w-full text-left px-4 py-2 text-sm
                      hover:bg-[#1E4860]
                    "
                    onClick={() => selectToBlock(String(c.churnHeight))}
                  >
                    Block {c.churnHeight} ({c.date})
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <button
        onClick={handleSubmit}
        disabled={generatingReport}
        className="
          bg-gray-900 dark:bg-[#28f3b0] text-gray-50 dark:text-black px-4 py-2
          rounded hover:shadow-md focus:outline-none
        "
      >
        {generatingReport ? "Generating..." : "Submit"}
      </button>
    </div>
  );
};

export default ReportFilter;

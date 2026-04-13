/* eslint-disable react/prop-types */
import { createPortal } from "react-dom";

const NodeChartModal = ({ title, subtitle, onClose, children }) => {
  const portalRoot = document.getElementById("popover-root");

  if (!portalRoot) {
    return null;
  }

  return createPortal(
    <div className="fixed inset-0 z-[60] flex items-center justify-center">
      <div className="absolute inset-0 bg-black/80" onClick={onClose} />
      <div className="relative z-10 mx-4 max-h-[90vh] w-full max-w-6xl overflow-y-auto rounded-xl bg-gray-100 shadow-2xl dark:bg-[#132a3c]">
        <div className="sticky top-0 z-10 flex items-start justify-between gap-4 border-b border-gray-300 bg-gray-100 px-6 py-4 dark:border-gray-700 dark:bg-[#132a3c]">
          <div>
            <h2 className="text-lg font-bold text-gray-800 dark:text-white">
              {title}
            </h2>
            {subtitle && (
              <p className="mt-1 break-all text-sm text-gray-500 dark:text-gray-400">
                {subtitle}
              </p>
            )}
          </div>
          <button
            onClick={onClose}
            className="icon-button p-1 text-2xl text-gray-500 hover:text-[#28f3b0] dark:text-gray-300"
          >
            &#x2715;
          </button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>,
    portalRoot,
  );
};

export default NodeChartModal;

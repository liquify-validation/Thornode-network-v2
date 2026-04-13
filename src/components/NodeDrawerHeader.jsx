/* eslint-disable react/prop-types */
import { copyToClipboard } from "../utilities/commonFunctions";

const NodeDrawerHeader = ({ address, onClose }) => (
  <div className="sticky top-0 z-10 flex items-center justify-between border-b border-gray-300 bg-gray-100 px-5 py-4 dark:border-gray-700 dark:bg-[#1e3344]">
    <div>
      <h2 className="text-lg font-bold text-gray-800 dark:text-white">
        Node Details
      </h2>
      <button
        onClick={() => copyToClipboard(address)}
        className="icon-button mt-0.5 bg-transparent p-0 text-xs text-[#28f3b0] hover:text-[#7EF7D6] hover:underline"
        title="Click to copy"
      >
        {address.slice(0, 10)}...{address.slice(-6)}
      </button>
    </div>
    <button
      onClick={onClose}
      className="icon-button p-1 text-2xl text-gray-500 hover:text-[#28f3b0] dark:text-gray-300"
    >
      &#x2715;
    </button>
  </div>
);

export default NodeDrawerHeader;

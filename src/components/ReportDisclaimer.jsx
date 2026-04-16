/* eslint-disable react/prop-types */
import { LiquifyLogo, LiquifyLogoLight } from "../assets";

export const REPORT_DISCLAIMER =
  "This report is provided for reference purposes only. While reasonable care has been taken in its preparation, the accuracy and completeness of the data cannot be guaranteed.";

function ReportDisclaimer({ isDark = false }) {
  return (
    <div className="mt-10 border-t border-gray-200 pt-4 text-gray-500 dark:border-white/10 dark:text-gray-400">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <img
          src={isDark ? LiquifyLogo : LiquifyLogoLight}
          alt="Liquify"
          className="h-5 w-auto self-start"
        />
        <p className="max-w-3xl text-xs leading-relaxed sm:text-right">
          {REPORT_DISCLAIMER}
        </p>
      </div>
    </div>
  );
}

export default ReportDisclaimer;

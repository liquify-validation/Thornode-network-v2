import { Helmet } from "react-helmet";
import { NetworkStatsCardSection } from "../components";

function NetworkOverview() {
  return (
    <>
      <Helmet>
        <title>THORChain Network Explorer | Network</title>
      </Helmet>
      <div className="p-2 mt-12">
        <div className="mb-8">
          <h1 className="text-2xl text-gray-800 dark:text-white font-bold mb-3">
            Network Statistics
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-300 max-w-3xl">
            Live network statistics
          </p>
        </div>

        <NetworkStatsCardSection />
      </div>
    </>
  );
}

export default NetworkOverview;

import React, { useMemo, useState } from "react";
import { votingData, MAX_VOTES } from "../constants/data";
import { ModernBarChart, VotingStatusFilter, VotingTable } from "../components";

function Voting() {
  const [currentTab, setCurrentTab] = useState("all");

  const filteredData = useMemo(() => {
    if (currentTab === "all") {
      return votingData;
    }
    return votingData.filter((item) => item.status === currentTab);
  }, [currentTab]);

  const chartData = useMemo(() => {
    return votingData.map((item) => {
      const total = item.options.reduce((sum, opt) => sum + opt.value, 0);
      const missing = MAX_VOTES - total;

      // Build an object with each option name as a key
      const optionsObject = item.options.reduce((acc, opt) => {
        acc[opt.name] = opt.value;
        return acc;
      }, {});

      return {
        title: item.title,
        consensus: item.consensus,
        votesNeeded: item.votesNeeded,
        ...optionsObject,
        missing: missing > 0 ? missing : 0,
      };
    });
  }, []);

  const chartKeys = useMemo(() => {
    const uniqueKeys = new Set();
    votingData.forEach((item) => {
      item.options.forEach((opt) => {
        uniqueKeys.add(opt.name);
      });
    });
    return [...uniqueKeys, "missing"];
  }, []);

  return (
    <div className="mt-20 mx-4">
      <ModernBarChart
        chartData={chartData}
        keys={chartKeys}
        maxVotes={MAX_VOTES}
        title="Mimir Votes"
      />
      <div className="mt-8">
        <VotingStatusFilter
          currentTab={currentTab}
          onTabChange={setCurrentTab}
        />
      </div>

      {/* Voting table */}
      <VotingTable
        data={filteredData}
        title="Mimir Votes Overview"
        maxVotes={100}
      />
    </div>
  );
}

export default Voting;

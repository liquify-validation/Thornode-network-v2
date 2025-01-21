import React, { useState } from "react";
import { Modal, Filter, ModernPieChart } from "../components";
import { LocationsIcon, FilterIcon, VersionIcon } from "../assets";

import { getCountriesData, getVersionData } from "../services/dataService";

const SearchBar = ({ searchTerm, setSearchTerm, allColumns, nodes }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState(null);

  const handleIconClick = (iconType) => {
    switch (iconType) {
      case "piechart": {
        const countriesData = getCountriesData(nodes);

        const totalCountries = countriesData.length;

        setModalContent(
          <ModernPieChart
            data={countriesData}
            title="Locations"
            subtitle="Countries"
            centerValue={totalCountries}
          />
        );
        setIsModalOpen(true);
        break;
      }
      case "version": {
        const versionData = getVersionData(nodes);

        const totalVersions = versionData.length;

        setModalContent(
          <ModernPieChart
            data={versionData}
            title="Versions"
            subtitle="Version"
            centerValue={totalVersions}
          />
        );
        setIsModalOpen(true);
        break;
      }
      case "filter":
        setModalContent(
          <Filter
            allColumns={allColumns}
            onClose={() => setIsModalOpen(false)}
          />
        );
        setIsModalOpen(true);
        break;
    }
  };

  return (
    <>
      <div className="search-bar flex items-center space-x-4 w-[30%] mr-8">
        <input
          className="border rounded p-2 w-full glass-effect"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search nodes..."
        />
        <div className="icons flex space-x-2">
          <img
            src={LocationsIcon}
            alt="Locations Piechart Icon"
            onClick={() => handleIconClick("piechart")}
            className="cursor-pointer w-12 h-12"
          />
          <img
            src={FilterIcon}
            alt="Filter Table Icon"
            onClick={() => handleIconClick("filter")}
            className="cursor-pointer w-12 h-12"
          />
          <img
            src={VersionIcon}
            alt="Version Table Icon"
            onClick={() => handleIconClick("version")}
            className="cursor-pointer w-12 h-12"
          />
        </div>
      </div>
      {isModalOpen && (
        <Modal onClose={() => setIsModalOpen(false)}>{modalContent}</Modal>
      )}
    </>
  );
};

export default SearchBar;

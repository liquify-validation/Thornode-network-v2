import React, { useState } from "react";
import { Modal, Filter, ModernPieChart } from "../components";
import {
  MagnifyingGlass,
  LocationsIcon,
  FilterIcon,
  VersionIcon,
} from "../assets";
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
      case "filter": {
        setModalContent(
          <Filter
            allColumns={allColumns}
            onClose={() => setIsModalOpen(false)}
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
      default:
        break;
    }
  };

  return (
    <>
      <div className="search-bar flex items-center space-x-4 w-[30%] mr-8">
        <div className="relative w-full">
          <img
            src={MagnifyingGlass}
            alt="Search Icon"
            className="
              pointer-events-none
              absolute 
              left-2 
              top-1/2 
              -translate-y-1/2 
              transform
              w-5 
              h-5
              z-10
              invert
              dark:invert-0
            "
          />
          <input
            className="
              border 
              border-black 
              rounded 
              p-2 
              w-full 
              glass-effect 
              pl-10 
              relative 
              z-0
            "
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search nodes..."
          />
        </div>

        <div className="icons flex space-x-2">
          <img
            src={LocationsIcon}
            alt="Locations Piechart Icon"
            onClick={() => handleIconClick("piechart")}
            className="cursor-pointer w-12 h-12 invert dark:invert-0"
          />
          <img
            src={FilterIcon}
            alt="Filter Table Icon"
            onClick={() => handleIconClick("filter")}
            className="cursor-pointer w-12 h-12 invert dark:invert-0"
          />
          <img
            src={VersionIcon}
            alt="Version Icon"
            onClick={() => handleIconClick("version")}
            className="cursor-pointer w-12 h-12 invert dark:invert-0"
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

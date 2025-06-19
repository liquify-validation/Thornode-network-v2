import { useState } from "react";
import { SearchBar } from "../components";
import { Modal, Filter, ModernPieChart } from "../components";
import { LocationsIcon, FilterIcon, VersionIcon } from "../assets";
import { getCountriesData, getVersionData } from "../services/dataService";

const NodeSearchBar = ({
  searchTerm,
  setSearchTerm,
  nodes,
  allColumns,
  hiddenColumns,
  setHiddenColumns,
}) => {
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
            initialHidden={hiddenColumns}
            onSave={(newHidden) => {
              setHiddenColumns(newHidden);
              setIsModalOpen(false);
            }}
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

  const icons = [
    {
      src: LocationsIcon,
      alt: "Locations Piechart Icon",
      onClick: () => handleIconClick("piechart"),
    },
    {
      src: FilterIcon,
      alt: "Filter Table Icon",
      onClick: () => handleIconClick("filter"),
    },
    {
      src: VersionIcon,
      alt: "Version Icon",
      onClick: () => handleIconClick("version"),
    },
  ];

  return (
    <>
      {/* BaseSearchBar with node-specific icons & placeholder */}
      <SearchBar
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        placeholder="Search nodes..."
        icons={icons}
      />

      {isModalOpen && (
        <Modal onClose={() => setIsModalOpen(false)}>{modalContent}</Modal>
      )}
    </>
  );
};

export default NodeSearchBar;

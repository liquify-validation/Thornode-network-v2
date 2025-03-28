import React from "react";
import PropTypes from "prop-types";
import Box from "../ui/Box";

const StatsCard = ({ icon, title, stat }) => {
  return (
    <Box className="flex items-center w-full p-4">
      <img
        src={icon}
        alt={`${title} icon`}
        className="w-8 h-8 mr-4 invert dark:invert-0"
      />
      <div>
        <h3 className="text-gray-700 dark:text-white font-bold uppercase text-sm">
          {title}
        </h3>
        <p className="text-gray-500 dark:text-[#A9F3DB] text-base">{stat}</p>
      </div>
    </Box>
  );
};

StatsCard.propTypes = {
  icon: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  stat: PropTypes.string.isRequired,
};

export default StatsCard;

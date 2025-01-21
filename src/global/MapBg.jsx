import React from "react";
import { HexMapBg } from "../assets";

const MapBg = () => {
  return (
    <div className="absolute inset-24 -z-10">
      <div
        className="w-full h-full bg-contain bg-no-repeat bg-center "
        style={{ backgroundImage: `url(${HexMapBg})` }}
      ></div>

      <div className="absolute top-10 right-10 w-40 h-40 rounded-full bg-gradient-to-br from-green-400 to-blue-500 opacity-50 blur-2xl"></div>

      <div className="absolute top-1/3 left-10 w-60 h-60 rounded-full bg-gradient-to-br from-green-400 to-blue-500 opacity-50 blur-2xl"></div>

      <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 w-80 h-80 rounded-full bg-gradient-to-br from-green-400 to-blue-500 opacity-50 blur-2xl"></div>
    </div>
  );
};

export default MapBg;

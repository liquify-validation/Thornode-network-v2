import React from "react";
import {
  GithubIcon,
  TwitterIcon,
  FooterMailIcon,
  LiquifyLogo,
} from "../assets";

const Footer = () => {
  return (
    <footer className=" bg-[#17364C] py-4 ">
      <div className="flex w-full items-center justify-between px-4 pl-10">
        <div className="flex items-center">
          <span className=" font-medium text-md text-gray-300">Built by:</span>
          <a
            href="https://www.liquify.io/"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img src={LiquifyLogo} alt="Logo" className="h-8 w-24 ml-3" />
          </a>
        </div>
        <div className="flex space-x-4">
          <a
            href="https://github.com/liquify-validation"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img src={GithubIcon} alt="Github Icon" className="h-6 w-6" />
          </a>
          <a
            href="https://x.com/Liquify_ltd?ref_src=twsrc%5Egoogle%7Ctwcamp%5Eserp%7Ctwgr%5Eauthor"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img src={TwitterIcon} alt="X Icon" className="h-6 w-6" />
          </a>
          <a
            href="mailto:contact@liquify.io"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img src={FooterMailIcon} alt="Mail icon" className="h-6 w-6" />
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

import { MagnifyingGlass } from "../assets";

const SearchBar = ({
  searchTerm,
  setSearchTerm,
  placeholder = "Search...",
  icons = [],
}) => {
  return (
    <div className="search-bar flex items-center space-x-4 w-full sm:w-[40%] md:w-[30%] min-w-[200px]">
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
          "
        />
        <input
          className="
            border 
            text-black
            border-black 
            rounded 
            p-2 
            w-full 
            pl-10 
            relative 
            z-0
          "
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder={placeholder}
        />
      </div>

      <div className="icons flex space-x-2">
        {icons.map(({ src, alt, onClick }, idx) => (
          <img
            key={idx}
            src={src}
            alt={alt}
            onClick={onClick}
            className="cursor-pointer w-12 h-12 invert dark:invert-0"
          />
        ))}
      </div>
    </div>
  );
};

export default SearchBar;

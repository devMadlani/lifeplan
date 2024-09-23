import React, { useState } from "react";

function JournalList() {
  const [showSearch, setShowSearch] = useState(false);

  // Handler to toggle search bar visibility
  const handleSearchClick = () => {
    setShowSearch(true);
  };

  // Handler to close the search bar
  const handleCloseSearch = () => {
    setShowSearch(false);
  };
  return (
    <div className="flex flex-col w-[254px] gap-2 ">
      <div>
        <div className="flex justify-between items-center mt-4 mx-3 ">
          {!showSearch && (
            <h1 className="text-[18px] text-[rgba(16,24,40,1)] font-medium">
              Journal
            </h1>
          )}

          <div
            className={`flex items-center ${
              showSearch ? "w-full" : ""
            } transition-all duration-300 ease-in-out gap-2`}
          >
            <div className="flex items-center">
              <img
                src="../images/icons/add.png"
                className="w-[22px] object-contain cursor-pointer"
                alt="Add"
              />
            </div>
            {showSearch && (
              <div className="relative flex w-full">
                <img
                  src="../images/icons/search-lg.png"
                  className="absolute left-2 top-[6px] w-[16px] object-contain"
                  alt="Search"
                />
                <input
                  type="text"
                  placeholder="search"
                  className={`pl-8 py-[5px] pr-10 border border-gray-300 rounded ${
                    showSearch ? "w-full" : ""
                  } transition-all duration-300 ease-in-out text-xs`}
                  autoFocus
                />
                <button
                  onClick={handleCloseSearch}
                  className=" right-2 text-gray-600 cursor-pointer "
                >
                  <img
                    src="../images/icons/close.png"
                    className="absolute object-contain w-2 right-2 top-[10px]"
                    alt=""
                  />
                </button>
              </div>
            )}

            {/* Search Icon (click to open search input) */}
            {!showSearch && (
              <img
                src="../images/icons/search-lg.png"
                className="w-[19px] object-contain cursor-pointer"
                alt="Search"
                onClick={handleSearchClick} // Show search input on click
              />
            )}
          </div>
        </div>
      </div>
      <div>
        <div className="flex flex-col  w-[232px] mx-auto mt-2 pb-1">
          <h1 className="text-sm text-[rgba(152,162,179,1)] font-medium ">
            Today
          </h1>
          <div className="flex flex-col justify-center gap-3 w-[208px] border-b  py-[6px] mb-2">
            <h1 className="text-sm text-[rgba(12,17,29,1)] font-semibold">
              Home dashboard
            </h1>
            <div className="flex gap-2">
              <h1 className="text-xs text-[rgba(71,84,103,1)] font-medium">
                Home dashboard
              </h1>
              <h1 className="text-xs text-[rgba(152,162,179,1)] font-medium">
                Home dashboard
              </h1>
            </div>
          </div>
          <div className="flex flex-col justify-center gap-3 w-[208px] border-b  py-[6px] mb-2">
            <h1 className="text-sm text-[rgba(12,17,29,1)] font-semibold">
              Home dashboard
            </h1>
            <div className="flex gap-2">
              <h1 className="text-xs text-[rgba(71,84,103,1)] font-medium">
                Home dashboard
              </h1>
              <h1 className="text-xs text-[rgba(152,162,179,1)] font-medium">
                Home dashboard
              </h1>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default JournalList;

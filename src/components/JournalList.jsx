// JournalList.js
import React, { useEffect, useState } from "react";
import { useJournal } from "../context/JournalContext"; // Import the context

function JournalList({ onAddClick }) {
  const { setSelectedEntry } = useJournal(); // Use the context
  const [showSearch, setShowSearch] = useState(false);
  const [entries, setEntries] = useState([]);
  const [searchTerm, setSearchTerm] = useState(""); // State to store the search term

  const handleSearchClick = () => {
    setShowSearch(true);
  };

  const handleCloseSearch = () => {
    setShowSearch(false);
    setSearchTerm(""); // Clear search term when closing
  };

  const fetchEntries = async () => {
    const dbRequest = indexedDB.open("JournalDB", 1);

    dbRequest.onsuccess = (event) => {
      const db = event.target.result;
      const transaction = db.transaction(["journals"], "readonly");
      const objectStore = transaction.objectStore("journals");
      const allEntriesRequest = objectStore.getAll();

      allEntriesRequest.onsuccess = (event) => {
        setEntries(event.target.result);
      };
    };

    dbRequest.onerror = (event) => {
      console.error("Database error:", event.target.error);
    };
  };

  useEffect(() => {
    setInterval(() => {
      
      fetchEntries(); // Initial fetch when component mounts
    }, 100);
  }, []);
  
  // Filter entries based on the search term
  const filteredEntries = entries.filter((entry) =>
    entry.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex flex-col w-[254px] gap-2 border-r ">
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
                onClick={onAddClick} // Call the onAddClick prop
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
                  value={searchTerm} // Controlled input
                  onChange={(e) => setSearchTerm(e.target.value)} // Update search term
                  autoFocus
                />
                <button
                  onClick={handleCloseSearch}
                  className="right-2 text-gray-600 cursor-pointer"
                >
                  <img
                    src="../images/icons/close.png"
                    className="absolute object-contain w-2 right-2 top-[10px]"
                    alt=""
                  />
                </button>
              </div>
            )}
            {!showSearch && (
              <img
                src="../images/icons/search-lg.png"
                className="w-[19px] object-contain cursor-pointer"
                alt="Search"
                onClick={handleSearchClick}
              />
            )}
          </div>
        </div>
      </div>
      <div>
        <div className="flex flex-col w-[232px] mx-auto mt-2 pb-1">
          <h1 className="text-sm text-[rgba(152,162,179,1)] font-medium">
            Today
          </h1>
          {filteredEntries.length > 0 ? ( // Use filtered entries here
            filteredEntries.map((entry) => (
              <div
                key={entry.id}
                className="flex flex-col justify-center gap-3 w-[208px] border-b py-[6px] mb-2 cursor-pointer"
                onClick={() => setSelectedEntry(entry)} // Set the selected entry
              >
                <h1 className="text-sm text-[rgba(12,17,29,1)] font-semibold">
                  {entry.title}
                </h1>
                <div className="flex gap-2">
                  <h1 className="text-xs text-[rgba(71,84,103,1)] font-medium">
                    {entry.date}
                  </h1>
                  <h1 className="text-xs text-[rgba(152,162,179,1)] font-medium">
                    {entry.sometext}
                  </h1>
                </div>
              </div>
            ))
          ) : (
            <p className="text-sm text-[rgba(152,162,179,1)] font-medium">
              No entries found.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default JournalList;

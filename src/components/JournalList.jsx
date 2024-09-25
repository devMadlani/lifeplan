import React, { useEffect, useState } from "react";

function JournalList() {
  const [showSearch, setShowSearch] = useState(false);
  const [entries, setEntries] = useState([]);

  const handleSearchClick = () => {
    setShowSearch(true);
  };

  const handleCloseSearch = () => {
    setShowSearch(false);
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
  fetchEntries(); // Initial fetch when component mounts

  const intervalId = setInterval(fetchEntries, 100); 

  return () => {
    clearInterval(intervalId); // Clean up the interval on unmount
  };
}, []);
  useEffect(() => {
    fetchEntries();

    const handleJournalUpdate = () => {
      fetchEntries();
    };

    document.addEventListener("journalUpdated", handleJournalUpdate);

    return () => {
      document.removeEventListener("journalUpdated", handleJournalUpdate);
    };
  }, []);

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
          {entries.length > 0 ? (
            entries.map((entry) => (
              <div
                key={entry.id}
                className="flex flex-col justify-center gap-3 w-[208px] border-b py-[6px] mb-2"
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

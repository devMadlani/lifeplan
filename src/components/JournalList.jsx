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

  // Fetch entries from IndexedDB and sort by the order field
  const fetchEntries = async () => {
    const dbRequest = indexedDB.open("myJournal", 1);

    dbRequest.onsuccess = (event) => {
      const db = event.target.result;
      const transaction = db.transaction(["allJournal"], "readonly");
      const objectStore = transaction.objectStore("allJournal");
      const allEntriesRequest = objectStore.getAll();

      allEntriesRequest.onsuccess = (event) => {
        const fetchedEntries = event.target.result;

        // Sort entries based on the 'order' field
        const sortedEntries = fetchedEntries.sort((a, b) => a.order - b.order);

        setEntries(sortedEntries);
      };
    };

    dbRequest.onerror = (event) => {
      console.error("Database error:", event.target.error);
    };
  };

  useEffect(() => {
    fetchEntries(); // Fetch entries when the component mounts
  });

  // DND logic
  const handleDragStart = (e, entryIndex) => {
    e.dataTransfer.setData("text/plain", entryIndex); // Store the index of the dragged item
  };

  const handleDragOver = (e) => {
    e.preventDefault(); // Allow dropping by preventing default behavior
  };

  const handleDrop = (e, dropIndex) => {
    e.preventDefault();
    const draggedIndex = e.dataTransfer.getData("text/plain");
    const draggedEntry = entries[draggedIndex];
    const updatedEntries = [...entries];
    updatedEntries.splice(draggedIndex, 1);
    updatedEntries.splice(dropIndex, 0, draggedEntry);
    setEntries(updatedEntries);

    const dbRequest = indexedDB.open("myJournal", 1);
    dbRequest.onsuccess = (event) => {
      const db = event.target.result;
      const transaction = db.transaction(["allJournal"], "readwrite");
      const objectStore = transaction.objectStore("allJournal");

      // Update each entry's order field based on the new positions
      updatedEntries.forEach((entry, index) => {
        const updatedEntry = { ...entry, order: index }; // Update the 'order' field

        // Put the updated entry back into the store (IndexedDB)
        const updateRequest = objectStore.put(updatedEntry);

        updateRequest.onerror = (event) => {
          console.error("Error updating entry order:", event.target.error);
        };
      });
    };

    dbRequest.onerror = (event) => {
      console.error("Database error:", event.target.error);
    };
  };

  // Filter entries based on the search term
  const filteredEntries = entries.filter((entry) =>
    entry.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
                    alt="Close"
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
          {filteredEntries.length > 0 ? (
            filteredEntries.map((entry, index) => (
              <div
                key={entry.id}
                draggable
                className="flex flex-col justify-center gap-3  w-full border-b py-[6px] mb-2 cursor-pointer hover:bg-[#f0f0f0] rounded pl-2"
                onClick={() => setSelectedEntry(entry)} // Set the selected entry
                onDragStart={(e) => handleDragStart(e, index)} // Start dragging with the index
                onDragOver={handleDragOver} // Allow dragging over
                onDrop={(e) => handleDrop(e, index)} // Drop logic
              >
                <h1 className="text-sm text-[rgba(12,17,29,1)] font-semibold truncate">
                  {entry.title}
                </h1>
                <div className="flex gap-2">
                  <h1 className="text-xs text-[rgba(71,84,103,1)] font-medium">
                    {entry.date}
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

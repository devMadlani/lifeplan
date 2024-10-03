import React, { useState } from "react";
import ShowJournal from "./ShowJournal";
import NewJournal from "./NewJournal";
import JournalList from "./JournalList";
import JournalNav from "./JournalNav";
import { useJournal } from "../context/JournalContext";

function JournalHome() {
  const { selectedEntry, setSelectedEntry, journals } = useJournal(); // Use context for journals and selectedEntry
  const [isNewJournalVisible, setIsNewJournalVisible] = useState(false);

  const handleAddJournalClick = () => {
    setSelectedEntry(null); // Clear selected entry
    setIsNewJournalVisible(true); // Show NewJournal for adding a new entry
  };

  const handleSaveJournal = (entry) => {
    if (entry.id) {
      // Update existing entry
      setSelectedEntry(entry);
    } else {
      // Add new entry
      setSelectedEntry(entry);
      // Uncomment the next line if you want to maintain the list
      // setJournals((prevJournals) => [...prevJournals, entry]);
    }
    setIsNewJournalVisible(false); // Hide NewJournal after saving
  };

  const handleEditJournal = (entry) => {
    setSelectedEntry(entry); // Set the selected entry for editing
    setIsNewJournalVisible(true); // Show NewJournal for editing
  };

  // Function to handle back click
  const handleBackClick = () => {
    setSelectedEntry(null); // Clear the selected entry
  };

  // Determine whether to show JournalList or the selected entry
  const isJournalListVisible = !isNewJournalVisible && !selectedEntry;

  return (
    <div className="flex flex-col">
      <JournalNav />
      <div className="flex flex-col md:flex-row">
        {/* Show JournalList only on small devices */}
        <div
          className={`${
            isJournalListVisible ? "block" : "hidden sm:block"
          } w-full `}
        >
          <JournalList
            onAddClick={handleAddJournalClick}
            setSelectedEntry={setSelectedEntry}
            onEditClick={handleEditJournal} // Pass the edit function
            journals={journals} // Pass journals to JournalList if needed
          />
        </div>

        {/* Conditional rendering for NewJournal or ShowJournal */}
        <div
          className={`flex ${
            isNewJournalVisible || selectedEntry ? "flex  " : "hidden"
          }`}
        >
          {isNewJournalVisible ? (
            <NewJournal
              onSave={handleSaveJournal}
              existingData={selectedEntry}
            />
          ) : (
            <ShowJournal
              newEntry={selectedEntry}
              journals={journals}
              onEdit={handleEditJournal} // Pass the edit function to ShowJournal
              onBackClick={handleBackClick} // Pass back click handler
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default JournalHome;

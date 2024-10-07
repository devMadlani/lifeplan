import React, { useState } from "react";
import ShowJournal from "./ShowJournal";
import NewJournal from "./NewJournal";
import JournalList from "./JournalList";
import JournalNav from "./JournalNav";
import { useJournal } from "../context/JournalContext";

function JournalHome() {
  const { selectedEntry, setSelectedEntry, journals } = useJournal();
  const [isNewJournalVisible, setIsNewJournalVisible] = useState(false);

  const handleAddJournalClick = () => {
    setSelectedEntry(null);
    setIsNewJournalVisible(true);
  };

  const handleSaveJournal = (entry) => {
    if (entry.id) {
      setSelectedEntry(entry);
    } else {
      setSelectedEntry(entry);
      // Uncomment the next line if you want to maintain the list
      // setJournals((prevJournals) => [...prevJournals, entry]);
    }
    setIsNewJournalVisible(false);
  };

  const handleEditJournal = (entry) => {
    setSelectedEntry(entry);
    setIsNewJournalVisible(true);
  };
  const handleBackClick = () => {
    setSelectedEntry(null);
  };

  const isJournalListVisible = !isNewJournalVisible && !selectedEntry;

  return (
    <div className="flex flex-col">
      <JournalNav />
      <div className="flex flex-col md:flex-row">
        <div
          className={`${
            isJournalListVisible ? "block" : "hidden sm:block"
          } w-full `}
        >
          <JournalList
            onAddClick={handleAddJournalClick}
            setSelectedEntry={setSelectedEntry}
            onEditClick={handleEditJournal}
          />
        </div>

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
              onEdit={handleEditJournal}
              l
              onBackClick={handleBackClick}
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default JournalHome;

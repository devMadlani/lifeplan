import React, { useState } from "react";
import Sidebar from "./Sidebar";
import JournalNav from "./JournalNav";
import JournalList from "./JournalList";
import NewJournal from "./NewJournal";
import ShowJournal from "./showJournal"; // Ensure the component name is consistent

function Main() {
  const [journals, setJournals] = useState([]); // State to hold journal entries
  const [selectedEntry, setSelectedEntry] = useState(null);
  const [isNewJournalVisible, setIsNewJournalVisible] = useState(false);

  const handleAddJournalClick = () => {
    setIsNewJournalVisible(true);
  };

  const handleSaveJournal = (newEntry) => {
    setJournals((prevJournals) => [...prevJournals, newEntry]); // Add new entry to journals
    setSelectedEntry(newEntry); // Set the newly added entry as the selected entry
    setIsNewJournalVisible(false); // Hide NewJournal and show ShowJournal after saving
  };

  return (
    <div className="flex">
      <div>
        <Sidebar />
      </div>
      <div className="flex flex-col">
        <JournalNav />
        <div className="flex gap-4">
          <JournalList
            onAddClick={handleAddJournalClick}
            setSelectedEntry={setSelectedEntry}
          />
          {isNewJournalVisible ? (
            <NewJournal onSave={handleSaveJournal} />
          ) : (
            <ShowJournal entry={selectedEntry} journals={journals} />
          )}
        </div>
      </div>
    </div>
  );
}

export default Main;

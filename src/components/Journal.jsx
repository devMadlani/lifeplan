import React, { useState } from "react";
import ShowJournal from "./ShowJournal";
import NewJournal from "./NewJournal";
import JournalList from "./JournalList";
import JournalNav from "./JournalNav";
import { useJournal } from "../context/JournalContext";
function Journal() {
  const { selectedEntry, setSelectedEntry, journals, setJournals } =
    useJournal(); // Use context for journals and selectedEntry
  const [isNewJournalVisible, setIsNewJournalVisible] = useState(false);

  const handleAddJournalClick = () => {
     setSelectedEntry(null); 
    setIsNewJournalVisible(true);
  };

  const handleSaveJournal = (entry) => {
    if (entry.id) {
      // Update existing entry
      // setJournals((prevJournals) =>
      //   prevJournals.map((journal) =>
      //     journal.id === entry.id ? entry : journal
      //   )
      // );
      setSelectedEntry(entry);
    } else {
      // Add new entry
      selectedEntry(entry);
      // setJournals((prevJournals) => [...prevJournals, entry]);
    }
    setSelectedEntry(entry); // Set the newly added/edited entry as the selected entry
    setIsNewJournalVisible(false); // Hide NewJournal and show ShowJournal after saving
  };
  const handleEditJournal = (entry) => {
    setSelectedEntry(entry); // Set the selected entry for editing
    setIsNewJournalVisible(true); // Show NewJournal for editing
  };
  return (
    <div className="flex flex-col">
      <JournalNav />
      <div className="flex">
        {/* <JournalList
          onAddClick={handleAddJournalClick}
          setSelectedEntry={setSelectedEntry}
          onEditClick={handleEditJournal} // Pass the edit function
          journals={journals} // Make sure to pass journals to JournalList if needed
        /> */}
        {true ? (
          <NewJournal onSave={handleSaveJournal} existingData={selectedEntry} />
        ) : (
          <ShowJournal
            newEntry={selectedEntry}
            journals={journals}
            onEdit={handleEditJournal} // Pass the edit function to ShowJournal
          />
        )}
      </div>
    </div>
  );
}

export default Journal;

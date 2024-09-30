import React, { createContext, useContext, useState } from "react";
import { deleteJournalEntryFromIndexedDB } from "../indexedDB/OpenDB";
const JournalContext = createContext();

export const JournalProvider = ({ children }) => {
  const [selectedEntry, setSelectedEntry] = useState(null);
  const [journals, setJournals] = useState([]);
  const deleteJournal = async (id) => {
    const userConfirmed = window.confirm(
      "Are you sure you want to delete this journal entry?"
    );
    if (userConfirmed) {
      try {
        await deleteJournalEntryFromIndexedDB(id); // Delete from IndexedDB
        const updatedJournals = journals.filter((journal) => journal.id !== id); // Update state
        setJournals(updatedJournals);
        setSelectedEntry(null); // Optionally, clear the selected entry
      } catch (error) {

        console.error("Error deleting journal:", error);
      }
    }
  };
  return (
    <JournalContext.Provider
      value={{
        selectedEntry,
        setSelectedEntry,
        journals,
        setJournals,
        deleteJournal,
        setJournals,
      }}
    >
      {children}
    </JournalContext.Provider>
  );
};

export const useJournal = () => useContext(JournalContext);

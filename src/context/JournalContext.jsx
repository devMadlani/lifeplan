
import React, { createContext, useContext, useState } from "react";

const JournalContext = createContext();

export const JournalProvider = ({ children }) => {
  const [selectedEntry, setSelectedEntry] = useState(null);

  return (
    <JournalContext.Provider value={{ selectedEntry, setSelectedEntry }}>
      {children}
    </JournalContext.Provider>
  );
};

export const useJournal = () => useContext(JournalContext);

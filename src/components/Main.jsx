import React from 'react'
import Sidebar from "./Sidebar";
import JournalNav from "./JournalNav";
import JournalList from "./JournalList";
import NewJournal from "./NewJournal";
function Main() {
  return (
    
    <div className="flex ">
      <div>
        <Sidebar />
      </div>
      <div className="flex flex-col">
        <JournalNav />
        <div className="flex gap-8">
          <JournalList />
          <NewJournal />
        </div>
      </div>
    </div>
  );
}

export default Main
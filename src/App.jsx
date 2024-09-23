import React from "react";
import VideoRecorder from "./components/VideoRecorder";
import JournalNav from "./components/JournalNav";
import NewJournal from "./components/NewJournal";
import Sidebar from "./components/Sidebar";
import JournalList from "./components/JournalList";
import Audio from "./components/Audio";

function App() {
  return (
    
    <div className="flex ">
      <div>
        <Sidebar />
      </div>
      <div className="flex flex-col">
        <JournalNav />
        <div className="flex">
          <JournalList />
          <NewJournal />
        </div>
      </div>
        
    </div>
  );
}

export default App;

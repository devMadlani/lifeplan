import React from 'react'
import Sidebar from "./Sidebar";
import JournalNav from "./JournalNav";
import JournalList from "./JournalList";
import NewJournal from "./NewJournal";
import ShowJournal from './showJournal';
function Main() {
  return (
    // <div className="flex ">
    //   <div>
    //     <Sidebar />
    //   </div>
    //   <div className="flex flex-col">
    //     <JournalNav />
    //     <div className="flex gap-4">
    //       <JournalList />
    //       {/* <NewJournal /> */}
    //     </div>
    //   </div>
    // </div>
          <ShowJournal />
  );
}

export default Main
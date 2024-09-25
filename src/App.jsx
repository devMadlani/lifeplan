import React from "react";
import { JournalProvider } from "./context/JournalContext";
import Main from "./components/Main";

function App() {
  return (

    <JournalProvider>
      <Main/>
    </JournalProvider>
   
  );
}

export default App;

import React, { useEffect, useState } from "react";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import Sidebar from "./Sidebar";
import Empty from "./Empty";
import { openDatabase } from "../indexedDB/OpenDB";
import JournalHome from "./JournalHome";

function Main() {
  useEffect(() => {
    openDatabase();
  }, []);
  return (
    <Router>
      <div className="flex">
        <div>
          <Sidebar />
        </div>
        <div>
          <Routes>
            <Route path="/journal" element={<JournalHome />} />
            <Route path="/empty" element={<Empty />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default Main;

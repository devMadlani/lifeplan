import React, { useState } from "react";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import Sidebar from "./Sidebar";
import Journal from "./journal";
import Empty from "./Empty";

function Main() {
  

  return (
    <Router>
      <div className="flex">
        <div>
          <Sidebar />
        </div>
        <div>
          <Routes>
            <Route path="/journal" element={<Journal />} />
            <Route path="/empty" element={<Empty />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default Main;

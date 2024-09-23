import React, { useState, useEffect, useRef } from "react";
import { openDB } from "idb";

function NewJournal({ entries }) {
  return (
    <div className="mt-4">
      <h2 className="text-lg font-semibold">Journal Entries</h2>
      <ul className="list-disc pl-5">
        {entries.map((entry, index) => (
          <li key={index} className="mb-2">
            <h3 className="font-bold">{entry.title}</h3>
            <p>{entry.description}</p>
            <div className="flex flex-wrap gap-1">
              {entry.tags.map((tag, i) => (
                <span
                  key={i}
                  className="bg-blue-200 text-blue-800 rounded-full px-2 py-1 text-sm"
                >
                  {tag}
                </span>
              ))}
            </div>
            {entry.audio && (
              <audio controls src={entry.audio} className="mt-2" />
            )}
            {entry.video && (
              <video controls src={entry.video} className="mt-2" />
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}


export default NewJournal;

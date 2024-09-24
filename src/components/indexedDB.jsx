// indexedDB.js
const DB_NAME = "JournalDB";
const DB_VERSION = 1;
const STORE_NAME = "journals";

let db;

const initDB = () => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event) => {
      db = event.target.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, {
          keyPath: "id",
          autoIncrement: true,
        });
      }
    };

    request.onsuccess = (event) => {
      db = event.target.result;
      resolve();
    };

    request.onerror = (event) => {
      reject("Database error: " + event.target.errorCode);
    };
  });
};

const addJournalEntry = (entry) => {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORE_NAME], "readwrite");
    const store = transaction.objectStore(STORE_NAME);
    const request = store.add(entry);

    request.onsuccess = () => {
      resolve();
    };

    request.onerror = (event) => {
      reject("Error adding entry: " + event.target.errorCode);
    };
  });
};

const fetchJournalsFromIndexedDB = async () => {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORE_NAME], "readonly");
    const store = transaction.objectStore(STORE_NAME);
    const request = store.getAll();

    request.onsuccess = (event) => {
      resolve(event.target.result);
    };

    request.onerror = (event) => {
      reject("Error fetching entries: " + event.target.errorCode);
    };
  });
};

export { initDB, addJournalEntry, fetchJournalsFromIndexedDB };

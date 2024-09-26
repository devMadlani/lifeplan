// indexedDB.js
const DATABASE_NAME = "myJournal";
const STORE_NAME = "allJournal";

// Function to open the database
export const openDatabase = (version = 1) => {
  return new Promise((resolve, reject) => {
    const dbRequest = indexedDB.open(DATABASE_NAME, version);

    dbRequest.onupgradeneeded = (event) => {
      const db = event.target.result;
      db.createObjectStore(STORE_NAME, { keyPath: "id", autoIncrement: true });
    };

    dbRequest.onsuccess = (event) => {
      resolve(event.target.result);
    };

    dbRequest.onerror = (event) => {
      reject(event.target.error);
    };
  });
};

// Function to fetch all journals
export const fetchJournals = (db) => {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, "readonly");
    const store = transaction.objectStore(STORE_NAME);
    const request = store.getAll();

    request.onsuccess = () => {
      resolve(request.result);
    };

    request.onerror = () => {
      reject(request.error);
    };
  });
};

// Function to save a journal entry
export const saveJournal = (db, journalData) => {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, "readwrite");
    const store = transaction.objectStore(STORE_NAME);
    const request = store.add(journalData);

    request.onsuccess = () => {
      resolve();
    };

    request.onerror = () => {
      reject(request.error);
    };
  });
};

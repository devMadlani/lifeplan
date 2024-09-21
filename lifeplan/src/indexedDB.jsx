// src/indexedDB.js
import { openDB } from 'idb';

const DB_NAME = 'MyDB';
const STORE_NAME = 'videos';
const DB_VERSION = 1;

// Function to open the IndexedDB
export const openDatabase = async () => {
  return await openDB(DB_NAME, DB_VERSION, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
      }
    },
  });
};

// Save video blob to IndexedDB
export const saveVideo = async (key, videoBlob) => {
  const db = await openDatabase();
  await db.put(STORE_NAME, videoBlob, key);
  console.log(`Video saved with key: ${key}`);
};

// Retrieve video blob from IndexedDB
export const getVideo = async (key) => {
  const db = await openDatabase();
  const videoBlob = await db.get(STORE_NAME, key);
  if (!videoBlob) {
    console.log(`No video found for key: ${key}`);
  }
  return videoBlob;
};

// Delete video blob from IndexedDB
export const deleteVideo = async (key) => {
  const db = await openDatabase();
  await db.delete(STORE_NAME, key);
  console.log(`Video deleted with key: ${key}`);
};

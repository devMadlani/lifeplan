import React, { useState, useEffect, useCallback } from "react";
// import { FaCloudUploadAlt } from "react-icons/fa";

// Function to open IndexedDB
const openIndexedDB = () => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open("FileStorageDB", 1);

    request.onerror = (event) => {
      reject("Database error: " + event.target.errorCode);
    };

    request.onsuccess = (event) => {
      resolve(event.target.result);
    };

    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      db.createObjectStore("files", { keyPath: "id", autoIncrement: true });
    };
  });
};

// File Upload Component
const FileUpload = () => {
  const [fileData, setFileData] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0); // State for progress
  const [currentFile, setCurrentFile] = useState(null); // State to store the current file being uploaded

  const loadFiles = async () => {
    const db = await openIndexedDB();
    const transaction = db.transaction("files", "readonly");
    const store = transaction.objectStore("files");
    const request = await store.getAll();
    request.onsuccess = (event) => {
      const allFiles = event.target.result;
      setFileData(allFiles);
    };

    request.onerror = (event) => {
      console.error("Error retrieving files:", event.target.error);
    };
  };

  useEffect(() => {
    loadFiles();
  }, []);

  const handleDrop = useCallback((event) => {
    event.preventDefault();
    const files = event.dataTransfer.files;
    handleFiles(files);
  }, []);

  const handleFiles = (files) => {
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (validateFile(file)) {
        setCurrentFile(file); // Set the current file being uploaded
        uploadFile(file);
      }
    }
  };

  const validateFile = (file) => {
    if (file.size > 5 * 1024 * 1024) {
      setErrorMessage("File size exceeds 5 MB");
      return false;
    }
    setErrorMessage("");
    return true;
  };

  const uploadFile = async (file) => {
    setUploading(true);
    const reader = new FileReader();

    reader.onload = async (event) => {
      const fileContent = event.target.result;
      const db = await openIndexedDB();
      const transaction = db.transaction("files", "readwrite");
      const store = transaction.objectStore("files");

      const fileRecord = {
        name: file.name,
        size: file.size,
        uploadDate: new Date().toLocaleString(),
        content: fileContent,
      };

      const request = store.add(fileRecord);

      request.onsuccess = () => {
        console.log("File stored successfully:", fileRecord);
        setUploadProgress(100); // Set progress to 100% once upload is done
        setTimeout(() => {
          setUploading(false);
          setUploadProgress(0); // Reset progress
          loadFiles(); // Refresh the file list after upload
          setCurrentFile(null); // Clear the current file
        }, 1000);
      };

      request.onerror = (event) => {
        console.error("Error storing file:", event.target.error);
        setUploading(false);
      };
    };

    reader.onprogress = (event) => {
      if (event.lengthComputable) {
        const progress = Math.round((event.loaded / event.total) * 100);
        setUploadProgress(progress); // Update progress
      }
    };

    reader.readAsArrayBuffer(file);
  };

  const handleDelete = async (id) => {
    const db = await openIndexedDB();
    const transaction = db.transaction("files", "readwrite");
    const store = transaction.objectStore("files");
    const request = store.delete(id);

    request.onsuccess = () => {
      console.log("File deleted:", id);
      setFileData((prevData) => prevData.filter((file) => file.id !== id));
    };

    request.onerror = (event) => {
      console.error("Error deleting file:", event.target.error);
    };
  };

  return (
    <div className="max-w-lg mx-auto p-4 border rounded-lg shadow-lg bg-white">
      <h2 className="text-lg font-semibold mb-4">Files</h2>
      {errorMessage && <p className="text-red-600 text-sm">{errorMessage}</p>}
      <div
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
        className="border-2 border-dashed border-gray-300 p-6 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:bg-gray-100 transition"
      >
        <p className="text-gray-600">
          Drag and drop files here or{" "}
          <span
            className="text-blue-600 cursor-pointer"
            onClick={() => document.getElementById("fileInput").click()}
          >
            click to upload
          </span>
        </p>
        <input
          id="fileInput"
          type="file"
          multiple
          className="hidden"
          onChange={(e) => handleFiles(e.target.files)}
        />
      </div>

      {uploading && currentFile && (
        <div className="mt-4">
          <div className="flex justify-between items-start">
            <h2 className="text-sm font-semibold text-gray-800">
              {currentFile.name}
            </h2>
            <span className="text-xs text-gray-600">
              {uploadProgress}%
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
            <div
              className="bg-purple-500 h-full rounded-full transition-all"
              style={{ width: `${uploadProgress}%` }}
            />
          </div>
        </div>
      )}

      <h3 className="text-md font-semibold mt-4">Uploaded Files:</h3>
      <ul className="mt-2">
        {fileData.map((file) => (
          <li
            key={file.id}
            className="flex justify-between items-center p-2 border-b"
          >
            <span>
              {file.name} ({(file.size / 1024).toFixed(2)} KB)
            </span>
            <button
              onClick={() => handleDelete(file.id)}
              className="text-red-500 hover:text-red-700"
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default FileUpload;

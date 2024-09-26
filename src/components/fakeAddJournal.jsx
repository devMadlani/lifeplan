import React, { useState, useEffect, useRef } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { openDatabase, fetchJournals, saveJournal } from "../indexedDB/OpenDB";
import VideoRecorder from "./VideoRecorder";
import AudioRecorder from "./AudioRecorder";

function NewJournal({ onSave, onCancel }) {
  // Added onCancel prop
  const [audioUrl, setAudioUrl] = useState(null);
  const [videoUrl, setVideoUrl] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const fileInputRef = useRef(null);
  const [files, setFiles] = useState([]); // Store multiple files
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [title, setTitle] = useState("");
  const [value, setValue] = useState("");
  const [tags, setTags] = useState([]);
  const [input, setInput] = useState("");
  const [journals, setJournals] = useState([]);

  useEffect(() => {
    const initializeDB = async () => {
      try {
        const db = await openDatabase();
        const allJournals = await fetchJournals(db);
        setJournals(allJournals);
      } catch (error) {
        console.error("Failed to initialize database:", error);
      }
    };

    initializeDB();
  }, []);

  const resetForm = () => {
    setTitle("");
    setValue("");
    setTags([]);
    setAudioUrl(null);
    setVideoUrl(null);
    setFiles([]); // Reset files
  };

  const handleSave = async () => {
    const db = await openDatabase();
    const journalData = {
      date: new Date().toISOString(),
      title,
      description: value,
      tags,
      audioUrl,
      videoUrl,
      files, // Save files only when saving the journal
    };
    try {
      await saveJournal(db, journalData);
      const allJournals = await fetchJournals(db);
      setJournals(allJournals);
      resetForm();
      onSave(journalData);
    } catch (error) {
      console.error("Failed to save journal:", error);
    }
  };

  const modules = {
    toolbar: [
      [{ header: "1" }, { header: "2" }, { font: [] }],
      [{ list: "ordered" }, { list: "bullet" }],
      ["bold", "italic", "underline"],
      ["image"],
    ],
  };

  const handleFiles = (uploadedFiles) => {
    const validFiles = [];
    for (let i = 0; i < uploadedFiles.length; i++) {
      const file = uploadedFiles[i];
      if (validateFile(file)) {
        validFiles.push(file); // Collect valid files
      }
    }
    setFiles((prevFiles) => [...prevFiles, ...validFiles]); // Add new files to existing
  };

  const validateFile = (file) => {
    if (file.size > 5 * 1024 * 1024) {
      setErrorMessage("File size exceeds 5 MB");
      return false;
    }
    setErrorMessage("");
    return true;
  };

  const simulateFileUpload = (uploadedFile) => {
    let progress = 0;
    const interval = setInterval(() => {
      progress += 10; // Increase progress by 10% every second
      setUploadProgress(progress);
      if (progress >= 100) clearInterval(interval);
    }, 100);
  };

  const handleDragOver = (event) => {
    event.preventDefault();
    event.stopPropagation();
  };

  const handleDrop = (event) => {
    event.preventDefault();
    event.stopPropagation();
    const uploadedFiles = event.dataTransfer.files;
    if (uploadedFiles.length > 0) {
      handleFiles(uploadedFiles);
      simulateFileUpload(uploadedFiles[0]); // Simulate upload for the first file
    }
  };

  const handleDelete = (fileName) => {
    setFiles((prevFiles) => prevFiles.filter((file) => file.name !== fileName));
    setUploadProgress(0);
  };

  return (
    <div>
      <div className="flex flex-col gap-4 h-[758px] flex-grow">
        <div className="bg-[rgba(252,252,253,1)] flex justify-between">
          <h1 className="text-[20px] text-[rgba(16,24,40,1)] my-2 mx-4">
            New Journal
          </h1>
          <div className="my-auto flex gap-1 mx-5 ">
            <button className="py-1 px-2 flex items-center gap-1 border focus:border-[rgba(127,86,217,1)] outline-none focus:shadow-sm focus:shadow-[rgba(127,86,217,1)] rounded-xl">
              <img src="../images/icons/share.png" alt="" />
              <span className="text-xs text-[rgba(102,112,133,1)] ml-1">
                Share
              </span>
            </button>
            <button className="py-1 px-2 flex items-center gap-1">
              <img src="../images/icons/dot.png" alt="" />
            </button>
          </div>
        </div>
        <h1 className="text-center text-xs text-[rgba(152,162,179,1)]">
          {Date(Date.now())}
        </h1>
        <div className="min-w-[320px] max-w-[826px] flex justify-center">
          <form className="flex flex-wrap flex-col items-center gap-2">
            <div>
              <h1 htmlFor="title" className="text-[14px] mb-1">
                Title
              </h1>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                id="title"
                className="text-[16px] border focus:border-[rgba(127,86,217,1)] outline-none focus:shadow-sm focus:shadow-[rgba(127,86,217,1)] border-[rgba(208,213,221,1)] bg-[rgba(255,255,255,0.02)] rounded-xl pl-4 h-[44px] w-[300px] sm:w-[520px] lg:w-[766px]"
                placeholder="Enter your title"
              />
            </div>
            <div>
              <h1 htmlFor="des" className="text-[14px] mb-1">
                Description
              </h1>
              <div>
                <ReactQuill
                  value={value}
                  onChange={setValue}
                  modules={modules}
                  formats={["header", "bold", "italic", "underline", "image"]}
                  className="text-[16px] min-w-[300px] sm:w-[520px] lg:w-[766px]"
                />
              </div>
            </div>

            <div className="flex flex-wrap gap-7 justify-center">
              <AudioRecorder />
              <VideoRecorder />
            </div>
            <div>
              <h1 className="text-[14px] mb-2">Files</h1>
              <div>
                <div
                  onDragOver={handleDragOver}
                  onDrop={handleDrop}
                  className="text-[16px] border relative border-[rgba(208,213,221,1)] bg-[rgba(255,255,255,0.02)] rounded-xl px-4 w-[300px] h-[124px] lg:w-[760px] flex flex-col items-center justify-center cursor-pointer"
                >
                  <p className="text-gray-600">
                    Drag and drop files here or{" "}
                    <span
                      className="text-blue-600 cursor-pointer"
                      onClick={() =>
                        document.getElementById("fileInput").click()
                      }
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
              </div>
              <div className="flex flex-col mt-2">
                {files.map((file) => (
                  <div
                    key={file.name}
                    className="flex justify-between items-center p-2 border-b border-gray-200"
                  >
                    <span>
                      {file.name} ({(file.size / 1024).toFixed(2)} KB)
                    </span>
                    <button
                      onClick={() => handleDelete(file.name)}
                      className="text-red-500 hover:text-red-700"
                    >
                      Delete
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-end mt-4">
              <button
                onClick={handleSave}
                className="py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 mr-2"
              >
                Save
              </button>
              <button
                onClick={onCancel} // Added onClick for the cancel button
                className="py-2 px-4 bg-gray-400 text-white rounded-lg hover:bg-gray-500"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default NewJournal;

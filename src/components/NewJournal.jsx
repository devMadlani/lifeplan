import React, { useState, useEffect } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { openDatabase, fetchJournals, saveJournal } from "../indexedDB/OpenDB";
import VideoRecorder from "./VideoRecorder";
import AudioRecorder from "./AudioRecorder";
import TagsInput from "./TagsInput";
import FileUploader from "./FileUploader";

function NewJournal({ onSave, existingData }) {
  const [audioUrl, setAudioUrl] = useState(existingData?.audioUrl || null);
  const [videoUrl, setVideoUrl] = useState(existingData?.videoUrl || null);
  const [files, setFiles] = useState(existingData?.files || []);
  const [title, setTitle] = useState(existingData?.title || "");
  const [value, setValue] = useState(existingData?.description || "");
  const [tags, setTags] = useState(existingData?.tags || []);
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
    setFiles([]);
  };

  const handleSave = async () => {
    const db = await openDatabase();
    const journalData = {
      date: new Date().toISOString(),
      title,
      description: value,
      tags,
      audioUrl: audioUrl || "/audio/audio.mp3", // Use the saved audio URL
      videoUrl,
      files:
        files.length > 0
          ? await Promise.all(
              files.map(async (file) => ({
                name: file.name,
                size: file.size,
                type: file.type,
                data: await file.arrayBuffer(), // Convert file to ArrayBuffer
              }))
            )
          : [],
      id: existingData?.id || new Date().toISOString(),
    };

    try {
      if (existingData) {
        await db
          .transaction("allJournal", "readwrite")
          .objectStore("allJournal")
          .put(journalData);
      } else {
        await saveJournal(db, journalData);
      }

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

  // Update the audio URL in state when it's saved in the AudioRecorder
  const handleAudioSave = (savedAudioUrl) => {
    console.log("Audio saved with URL:", savedAudioUrl);
    setAudioUrl(savedAudioUrl); // Store the saved audio URL in state
  };

  return (
    <div className="flex flex-col gap-4 p-4 h-full w-full sm:max-w-4xl mx-auto sm:border-l">
      <div className="bg-[rgba(252,252,253,1)] flex justify-between p-2">
        <h1 className="text-lg sm:text-2xl text-[rgba(16,24,40,1)]">
          {title || "New Journal"}
        </h1>
      </div>

      <h1 className="text-center text-xs sm:text-sm text-[rgba(152,162,179,1)]">
        {new Date().toLocaleString()}
      </h1>

      <form className="flex flex-col items-center gap-4">
        <div className="">
          <label htmlFor="title" className="text-sm mb-1 block">
            Title
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            id="title"
            className="text-base border focus:border-[rgba(127,86,217,1)] outline-none focus:shadow-sm border-[rgba(208,213,221,1)] bg-[rgba(255,255,255,0.02)] rounded-xl p-3 min-w-[300px] sm:w-[520px] lg:w-[766px]"
            placeholder="Enter your title"
          />
        </div>

        <div className="">
          <label htmlFor="description" className="text-sm mb-1 block">
            Description
          </label>
          <ReactQuill
            value={value}
            onChange={setValue}
            modules={modules}
            formats={[
              "header",
              "font",
              "bold",
              "italic",
              "underline",
              "image",
              "list",
            ]}
            className="text-base w-[300px] sm:w-[520px] lg:w-[766px]"
          />
        </div>

        <div className="">
          <TagsInput tags={tags} setTags={setTags} />
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <AudioRecorder onSave={handleAudioSave} />
          <VideoRecorder onVideoUrlChange={setVideoUrl} />
        </div>

        <div className="">
          <FileUploader files={files} setFiles={setFiles} />
        </div>

        <div className="flex gap-2 w-full justify-end mt-4">
          <button
            type="button"
            onClick={resetForm}
            className="rounded-xl border px-4 py-2 text-sm font-semibold text-[rgba(52, 64, 84, 1)]"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleSave}
            className="rounded-lg bg-[rgba(127,86,217,1)] px-4 py-2 text-sm font-semibold text-white"
          >
            Save
          </button>
        </div>
      </form>
    </div>
  );
}

export default NewJournal;

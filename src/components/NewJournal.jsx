import React, { useState, useEffect } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { openDatabase, fetchJournals, saveJournal } from "../indexedDB/OpenDB";
import VideoRecorder from "./VideoRecorder";
import AudioRecorder from "./AudioRecorder";
import TagsInput from "./TagsInput";
import FileUploader from "./FileUploader";

function NewJournal({ onSave }) {
  const [audioUrl, setAudioUrl] = useState(null);
  const [videoUrl, setVideoUrl] = useState(null);
  const [file, setFile] = useState([]);
  const [title, setTitle] = useState("");
  const [value, setValue] = useState("");
  const [tags, setTags] = useState([]);
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
    setFile(null);
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
      files: file // Assuming `files` is an array of selected files
        ? await Promise.all(
            file.map(async (file) => ({
              name: file.name,
              size: file.size,
              type: file.type,
              data: await file.arrayBuffer(), // Convert file to ArrayBuffer
            }))
          )
        : [],
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
  return (
    <div>
      <div className="flex flex-col gap-4 h-[758px] flex-grow">
        <div className="bg-[rgba(252,252,253,1)] flex justify-between">
          <h1 className="text-[20px] text-[rgba(16,24,40,1)] my-2 mx-4">
            New Journal
          </h1>
          <div className="my-auto flex gap-1 mx-5 ">
            <button className="py-1 px-2 flex items-center gap-1 border  focus:border-[rgba(127,86,217,1)] outline-none focus:shadow-sm focus:shadow-[rgba(127,86,217,1)]   rounded-xl">
              <img src="../images/icons/share.png" alt="" />
              <span className="text-xs  text-[rgba(102,112,133,1)] ml-1">
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
                  formats={["header", "bold", "italic", "underline", "image"]} // Specify allowed formats
                  className="text-[16px] min-w-[300px] sm:w-[520px] lg:w-[766px]"
                />
              </div>
            </div>
            <div>
              <TagsInput tags={tags} setTags={setTags} />
            </div>
            <div className="flex flex-wrap gap-7 justify-center">
              <AudioRecorder />
              <VideoRecorder />
            </div>
            <FileUploader files={file} setFiles={setFile} />
            <div className="flex gap-1 pt-0 border-t border-[rgba(234,236,240,1)] min-w-[320px] w-[826px] justify-end  ">
              <button
                type="button"
                className="mt-3  rounded-xl border focus:border-[rgba(127,86,217,1)] outline-none focus:shadow-sm focus:shadow-[rgba(127,86,217,1)] border-[rgba(208,213,221,1)] px-4 py-[10px] text-[14px] text-[rgba(52, 64, 84, 1)] font-semibold"
              >
                Cancel
                <img
                  className="image ml-[5px] mt-[1px]"
                  src="/images/arrow.png"
                  alt=""
                />
              </button>
              <button
                type="button"
                onClick={handleSave}
                className="mt-3 mr-6 rounded-lg bg-[rgba(127,86,217,1)] border focus:border-[rgba(127,86,217,1)] outline-none focus:shadow-sm focus:shadow-[rgba(127,86,217,1)] border-[rgba(127,86,217,1)] px-4 py-[10px] text-[14px] text-[rgba(255,255,255,1)] font-semibold shadow-sm shadow-[rgba(16,24,40,0.05)]"
              >
                Save
                <img
                  className="image ml-[5px] mt-[1px]"
                  src="/images/arrow.png"
                  alt=""
                />
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default NewJournal;

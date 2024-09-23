import React, { useState, useEffect, useRef } from "react";
import { openDB } from "idb";

function NewJournal() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState("");
  const [audioBlob, setAudioBlob] = useState(null);
  const [videoBlob, setVideoBlob] = useState(null);
  const [isRecordingAudio, setIsRecordingAudio] = useState(false);
  const [isRecordingVideo, setIsRecordingVideo] = useState(false);
  const mediaRecorderRef = useRef(null);
  const videoRef = useRef(null);

  useEffect(() => {
    const initDB = async () => {
      const db = await openDB("JournalDB", 1, {
        upgrade(db) {
          db.createObjectStore("journals", {
            keyPath: "id",
            autoIncrement: true,
          });
        },
      });
    };
    initDB();
  }, []);

  const handleSave = async () => {
    const db = await openDB("JournalDB", 1);
    await db.add("journals", {
      title,
      description,
      tags,
      audio: audioBlob,
      video: videoBlob,
    });
    // Clear state after saving
    setTitle("");
    setDescription("");
    setTags("");
    setAudioBlob(null);
    setVideoBlob(null);
    alert("Journal saved!");
  };

  const startAudioRecording = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    mediaRecorderRef.current = new MediaRecorder(stream);
    mediaRecorderRef.current.start();
    setIsRecordingAudio(true);

    const audioChunks = [];
    mediaRecorderRef.current.ondataavailable = (event) => {
      audioChunks.push(event.data);
    };

    mediaRecorderRef.current.onstop = () => {
      const audioBlob = new Blob(audioChunks);
      setAudioBlob(URL.createObjectURL(audioBlob));
    };
  };

  const stopAudioRecording = () => {
    mediaRecorderRef.current.stop();
    setIsRecordingAudio(false);
  };

  const startVideoRecording = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true,
    });
    mediaRecorderRef.current = new MediaRecorder(stream);
    mediaRecorderRef.current.start();
    setIsRecordingVideo(true);

    const videoChunks = [];
    mediaRecorderRef.current.ondataavailable = (event) => {
      videoChunks.push(event.data);
    };

    mediaRecorderRef.current.onstop = () => {
      const videoBlob = new Blob(videoChunks);
      setVideoBlob(URL.createObjectURL(videoBlob));
    };
  };

  const stopVideoRecording = () => {
    mediaRecorderRef.current.stop();
    setIsRecordingVideo(false);
  };

  return (
    <div className="flex flex-col gap-4 border-l h-[758px]">
      <div className="bg-[rgba(252,252,253,1)] flex justify-between">
        <h1 className="text-[20px] text-[rgba(16,24,40,1)] my-2 mx-4">
          New Journal
        </h1>
        <div className="my-auto flex gap-1 mx-5">
          <button className="py-1 px-2 flex items-center gap-1 border rounded-lg">
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
        <form
          className="flex flex-wrap flex-col items-center gap-2"
          onSubmit={(e) => e.preventDefault()}
        >
          <div>
            <h1 className="text-[14px] mb-1">Title</h1>
            <input
              type="text"
              className="text-[16px] border border-[rgba(208,213,221,1)] bg-[rgba(255,255,255,0.02)] rounded pl-4 h-[44px] w-[300px] sm:w-[520px] lg:w-[766px]"
              placeholder="Enter your title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          <div>
            <h1 className="text-[14px] mb-1">Description</h1>
            <input
              type="text"
              className="text-[16px] border border-[rgba(208,213,221,1)] bg-[rgba(255,255,255,0.02)] rounded px-4 h-[44px] min-w-[300px] sm:w-[520px] lg:w-[766px]"
              placeholder="Enter your Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          <div>
            <h1 className="text-[14px] mb-1">Tags</h1>
            <input
              type="text"
              className="text-[16px] border border-[rgba(208,213,221,1)] bg-[rgba(255,255,255,0.02)] rounded px-4 min-w-[300px] sm:w-[520px] lg:w-[766px] h-[44px]"
              placeholder="Enter your Tags"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
            />
          </div>
          <div className="flex flex-wrap gap-2 justify-center">
            <div>
              <h1 className="text-[14px] mb-1">Record Audio</h1>
              <button
                type="button"
                onClick={
                  isRecordingAudio ? stopAudioRecording : startAudioRecording
                }
                className="text-[16px] border border-[rgba(208,213,221,1)] bg-[rgba(255,255,255,0.02)] rounded px-4 h-[44px] lg:w-[192px]"
              >
                {isRecordingAudio ? "Stop Recording" : "Start Recording"}
              </button>
              {audioBlob && <audio controls src={audioBlob} className="mt-2" />}
            </div>
            <div>
              <h1 className="text-[14px] mb-1">Record Video</h1>
              <button
                type="button"
                onClick={
                  isRecordingVideo ? stopVideoRecording : startVideoRecording
                }
                className="text-[16px] border border-[rgba(208,213,221,1)] bg-[rgba(255,255,255,0.02)] rounded px-4 h-[44px] lg:w-[192px]"
              >
                {isRecordingVideo ? "Stop Recording" : "Start Recording"}
              </button>
              {videoBlob && (
                <video
                  controls
                  src={videoBlob}
                  className="mt-2"
                  ref={videoRef}
                />
              )}
            </div>
          </div>
        </form>
      </div>
      <div className="flex gap-1 pt-0 border-t border-[rgba(234,236,240,1)] min-w-[320px] w-[826px] justify-end px-2">
        <button
          className="mt-5 flex rounded-lg border border-[rgba(208,213,221,1)] px-4 py-[10px] text-[14px] text-[rgba(52, 64, 84, 1)] font-semibold"
          onClick={() => {
            // Handle cancel logic if necessary
            setTitle("");
            setDescription("");
            setTags("");
            setAudioBlob(null);
            setVideoBlob(null);
          }}
        >
          Cancel
          <img
            className="image ml-[5px] mt-[1px]"
            src="/images/arrow.png"
            alt=""
          />
        </button>
        <button
          className="mt-5 flex rounded-lg bg-[rgba(127,86,217,1)] border border-[rgba(127,86,217,1)] px-4 py-[10px] text-[14px] text-[rgba(255,255,255,1)] font-semibold shadow-sm shadow-[rgba(16,24,40,0.05)]"
          onClick={handleSave}
        >
          Save
          <img
            className="image ml-[5px] mt-[1px]"
            src="/images/arrow.png"
            alt=""
          />
        </button>
      </div>
    </div>
  );
}

export default NewJournal;

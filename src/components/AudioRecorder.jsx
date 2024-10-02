import React, { useState, useRef } from "react";
import { openDB } from "idb";

const AudioRecorder = ({ onAudioUrlChange }) => {
  const [isRecording, setIsRecording] = useState(false);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const [audioUrl, setAudioUrl] = useState(null);

  const dbPromise = openDB("audio-recordings", 1, {
    upgrade(db) {
      db.createObjectStore("audioStore");
    },
  });

  const saveToIndexedDB = async (audioBlob) => {
    const db = await dbPromise;
    await db.put("audioStore", audioBlob, "recordedAudio");
  };

  const loadFromIndexedDB = async () => {
    const db = await dbPromise;
    const storedAudioBlob = await db.get("audioStore", "recordedAudio");

    if (storedAudioBlob) {
      const url = URL.createObjectURL(storedAudioBlob);
      setAudioUrl(url);
      onAudioUrlChange(url);
    }
  };

  const startRecording = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    mediaRecorderRef.current = new MediaRecorder(stream);

    mediaRecorderRef.current.ondataavailable = (event) => {
      audioChunksRef.current.push(event.data);
    };

    mediaRecorderRef.current.onstop = () => {
      const audioBlob = new Blob(audioChunksRef.current, { type: "audio/wav" });
      audioChunksRef.current = []; // Clear chunks for the next recording
      const url = URL.createObjectURL(audioBlob);
      setAudioUrl(url);
      onAudioUrlChange(url); // Pass the audio URL to parent
      saveToIndexedDB(audioBlob); // Save to IndexedDB
    };

    mediaRecorderRef.current.start();
    setIsRecording(true);
  };

  const stopRecording = () => {
    mediaRecorderRef.current.stop();
    setIsRecording(false);
  };

  // Load audio from IndexedDB when the component mounts
  React.useEffect(() => {
    loadFromIndexedDB();
  }, []);

  return (
    <div className="flex flex-col">
      <h1 className="text-[14px] mb-1">Record Voice</h1>
      <div
        className="relative border border-[rgba(208,213,221,1)] bg-[rgba(255,255,255,0.02)] rounded-xl px-4 w-[290px] h-[114px] lg:w-[366px] flex flex-col items-center justify-center shadow-lg transition-shadow duration-300 hover:shadow-2xl"
        onClick={isRecording ? stopRecording : startRecording}
      >
        <div
          className={`cursor-pointer border rounded-full w-[50px] h-[50px] flex justify-center items-center ${
            isRecording ? "bg-red-500" : ""
          } hover:${
            isRecording ? "bg-red-600" : "hoverEffect"
          } transition duration-200`}
        >
          <img
            src="../images/icons/audio.svg"
            className="object-none w-8 h-8"
            alt="Audio Icon"
          />
        </div>
        <h1 className="text-sm mt-2 text-gray-700">
          <span className="text-purple-600 font-semibold">
            {isRecording ? "Recording..." : "Click"}
          </span>{" "}
          to {isRecording ? "stop recording" : "start recording..."}
        </h1>
      </div>
      {audioUrl && (
        <div className="mt-4">
          <h2 className="text-sm text-gray-600">Recorded Audio:</h2>
          <audio src={audioUrl} controls className="mt-2" />
        </div>
      )}
    </div>
  );
};

export default AudioRecorder;

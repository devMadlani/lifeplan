import React, { useState, useRef, useEffect } from "react";
import { openDB } from "idb";

const AudioRecorder = ({ onAudioUrlChange }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [errorMessage, setErrorMessage] = useState(null);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const timerRef = useRef(null);
  const [audioUrl, setAudioUrl] = useState(null);

  const dbPromise = openDB("myJournal", 1, {
    upgrade(db) {
      if (!db.objectStoreNames.contains("allJournal")) {
        db.createObjectStore("allJournal");
      }
    },
  });

  const saveToIndexedDB = async (audioBlob) => {
    try {
      const db = await dbPromise;
      await db.put("allJournal", audioBlob, "recordedAudio");
      console.log("Audio saved to IndexedDB successfully.");
    } catch (error) {
      console.error("Failed to save to IndexedDB:", error);
    }
  };

  const loadFromIndexedDB = async () => {
    try {
      const db = await dbPromise;
      const storedAudioBlob = await db.get("allJournal", "recordedAudio");

      if (storedAudioBlob) {
        const url = URL.createObjectURL(storedAudioBlob);
        setAudioUrl(url);
        onAudioUrlChange(url);
        console.log("Loaded audio from IndexedDB successfully.");
      } else {
        console.log("No audio found in IndexedDB.");
      }
    } catch (error) {
      console.error("Failed to load from IndexedDB:", error);
    }
  };

  const startTimer = () => {
    timerRef.current = setInterval(() => {
      setRecordingTime((prevTime) => prevTime + 1);
    }, 1000);
  };

  const stopTimer = () => {
    clearInterval(timerRef.current);
    timerRef.current = null;
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);

      mediaRecorderRef.current.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorderRef.current.onstop = () => {
        if (audioChunksRef.current.length === 0) {
          console.error("No audio chunks recorded.");
          return; // No data to save
        }

        const audioBlob = new Blob(audioChunksRef.current, {
          type: "audio/wav",
        });
        audioChunksRef.current = []; // Clear chunks for the next recording
        const url = URL.createObjectURL(audioBlob);
        setAudioUrl(url);
        onAudioUrlChange(url); // Pass the audio URL to parent
        saveToIndexedDB(audioBlob); // Save to IndexedDB
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
      setIsPaused(false);
      setRecordingTime(0); // Reset timer
      startTimer(); // Start timer
    } catch (error) {
      handleError(error);
    }
  };

  const handleError = (error) => {
    if (error.name === "NotAllowedError") {
      setErrorMessage("Permission to access the microphone is denied.");
    } else if (error.name === "NotFoundError") {
      setErrorMessage("No microphone was found.");
    } else {
      setErrorMessage("An error occurred while accessing your microphone.");
    }
    setIsRecording(false);
    setIsPaused(false);
    console.error("Error accessing media devices:", error);
  };

  const pauseRecording = () => {
    if (isPaused) {
      mediaRecorderRef.current.resume();
      startTimer(); // Resume timer
    } else {
      mediaRecorderRef.current.pause();
      stopTimer(); // Pause timer
    }
    setIsPaused(!isPaused);
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      setIsPaused(false);
      stopTimer();
    }
  };

  useEffect(() => {
    loadFromIndexedDB();
    return () => {
      stopTimer();
    };
  }, []);

  const formatTime = (timeInSeconds) => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = timeInSeconds % 60;
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  return (
    <div className="flex flex-col">
      <h1 className="text-[14px] mb-1">Record Voice</h1>
      <div className="relative border border-[rgba(208,213,221,1)] bg-[rgba(255,255,255,0.02)] rounded-xl px-4 w-[290px] h-[114px] lg:w-[366px] flex flex-col items-center justify-center transition-shadow duration-300">
        <div className="flex justify-center gap-2">
          <div
            className={`cursor-pointer border rounded-full w-[50px] h-[50px] flex justify-center items-center ${
              isRecording && !isPaused
                ? "bg-red-500"
                : isPaused
                ? "bg-yellow-500"
                : ""
            } transition duration-200`}
            onClick={isRecording ? pauseRecording : startRecording}
          >
            <img
              src={
                isPaused
                  ? "../images/icons/pause.png"
                  : "../images/icons/audio.png"
              }
              className={`${
                isPaused ? "object-cover w-8 h-8" : "object-contain w-4 h-6"
              }`}
              alt="Audio Icon"
            />
          </div>
          {isRecording && (
            <div className="cursor-pointer border rounded-full w-[50px] h-[50px] flex justify-center items-center bg-gray-500">
              <img
                src="/images/icons/stop.png"
                onClick={stopRecording}
                className="object-contain w-8 h-8"
                alt="Stop Recording"
              />
            </div>
          )}
        </div>
        <h1 className="text-sm mt-2 text-gray-700">
          <span className="text-purple-600 font-semibold">
            {isRecording
              ? isPaused
                ? "Paused"
                : formatTime(recordingTime)
              : "Click"}
          </span>{" "}
          to{" "}
          {isRecording ? (isPaused ? "resume" : "pause") : "start recording..."}
        </h1>
      </div>

      {errorMessage && (
        <div className="mt-2 text-red-500 text-sm">{errorMessage}</div>
      )}

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

import React, { useRef, useState, useEffect } from "react";
import { openDB } from "idb";

const AudioRecorder = ({ onSave }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [audioUrl, setAudioUrl] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const mediaRecorderRef = useRef(null);
  const recordedChunksRef = useRef([]);

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes}:${seconds < 10 ? `0${seconds}` : seconds}`;
  };

  const startRecording = async () => {
    try {
      setErrorMessage(null);
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          recordedChunksRef.current.push(event.data);
        }
      };
      mediaRecorderRef.current.onstop = handleStopRecording;
      mediaRecorderRef.current.start();
      setIsRecording(true);
      setIsPaused(false);

      // Timer for recording time
      setRecordingTime(0);
      const timer = setInterval(() => {
        setRecordingTime((prevTime) => prevTime + 1);
      }, 1000);
      mediaRecorderRef.current.timer = timer; // Save timer reference for cleanup
    } catch (error) {
      setErrorMessage("Error accessing audio devices.");
      console.error(error);
    }
  };

  const pauseRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.pause();
      setIsPaused(true);
      clearInterval(mediaRecorderRef.current.timer); // Stop timer
    }
  };

  const resumeRecording = () => {
    if (mediaRecorderRef.current && isPaused) {
      mediaRecorderRef.current.resume();
      setIsPaused(false);

      // Restart timer
      const timer = setInterval(() => {
        setRecordingTime((prevTime) => prevTime + 1);
      }, 1000);
      mediaRecorderRef.current.timer = timer;
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      clearInterval(mediaRecorderRef.current.timer); // Stop timer
      setIsRecording(false);
      setIsPaused(false);
    }
  };

  const handleStopRecording = async () => {
    const blob = new Blob(recordedChunksRef.current, { type: "audio/webm" });
    const url = URL.createObjectURL(blob);
    setAudioUrl(url);

    // Save to IndexedDB
    const db = await openDB("myJournal", 1);

    // Store the blob instead of the URL
    const audioData = await blob.arrayBuffer(); // Get the audio data as ArrayBuffer

    await db.put("allJournal", {
      id: new Date().toISOString(),
      audio: audioData,
    }); // Store audio data

    // Clear recorded chunks for next recording
    recordedChunksRef.current = [];

    // Call the parent component's save function if provided
    if (onSave) {
      onSave(url);
    }
  };

  // Cleanup URL on component unmount
  useEffect(() => {
    return () => {
      if (audioUrl) {
        URL.revokeObjectURL(audioUrl); // Clean up URL
      }
    };
  }, [audioUrl]);

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
            onClick={
              isRecording
                ? isPaused
                  ? resumeRecording
                  : pauseRecording
                : startRecording
            }
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

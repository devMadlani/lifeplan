import React, { useState, useRef, useEffect } from "react";
import { openDB } from "idb";

const VideoRecorder = ({ onVideoUrlChange }) => {
  const [isRecordingVideo, setIsRecordingVideo] = useState(false);
  const [videoUrl, setVideoUrl] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const videoRef = useRef(null);
  const mediaRecorderVideoRef = useRef(null);
  const videoChunksRef = useRef([]);

  // IndexedDB setup
  const dbPromise = openDB("myJournal", 1, {
    upgrade(db) {
      if (!db.objectStoreNames.contains("allJournal")) {
        db.createObjectStore("allJournal");
      }
    },
  });

  const saveToIndexedDB = async (videoBlob) => {
    const db = await dbPromise;
    await db.put("allJournal", videoBlob, "recordedVideo");
  };

  const loadFromIndexedDB = async () => {
    const db = await dbPromise;
    const storedVideoBlob = await db.get("allJournal", "recordedVideo");

    if (storedVideoBlob) {
      const url = URL.createObjectURL(storedVideoBlob);
      setVideoUrl(url);
      onVideoUrlChange(url); // Pass the video URL to the parent
    }
  };

  const startRecordingVideo = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      videoRef.current.srcObject = stream;

      mediaRecorderVideoRef.current = new MediaRecorder(stream);

      mediaRecorderVideoRef.current.ondataavailable = (event) => {
        videoChunksRef.current.push(event.data);
      };

      mediaRecorderVideoRef.current.onstop = () => {
        const videoBlob = new Blob(videoChunksRef.current, {
          type: "video/webm",
        });
        const url = URL.createObjectURL(videoBlob);
        setVideoUrl(url);
        onVideoUrlChange(url); // Pass the video URL to the parent
        saveToIndexedDB(videoBlob); // Save video to IndexedDB
        videoChunksRef.current = [];
        stream.getTracks().forEach((track) => track.stop());
      };

      mediaRecorderVideoRef.current.start();
      setIsRecordingVideo(true);
      setErrorMessage(null); // Clear any previous errors
    } catch (error) {
      handleError(error);
    }
  };

  const stopRecordingVideo = () => {
    if (mediaRecorderVideoRef.current) {
      mediaRecorderVideoRef.current.stop();
      setIsRecordingVideo(false);
    } else {
      setErrorMessage("Recording has not started.");
    }
  };

  const saveVideoFile = () => {
    if (!videoUrl) return;
    const link = document.createElement("a");
    link.href = videoUrl;
    link.download = "recorded-video.webm";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleError = (error) => {
    if (error.name === "NotAllowedError") {
      setErrorMessage(
        "Permission to access the camera and microphone is denied."
      );
    } else if (error.name === "NotFoundError") {
      setErrorMessage("No camera or microphone was found.");
    } else {
      setErrorMessage("An error occurred while accessing your devices.");
    }
    setIsRecordingVideo(false);
    console.error("Error accessing media devices:", error);
  };

  // Load video from IndexedDB when the component mounts
  useEffect(() => {
    loadFromIndexedDB();
  }, []);

  return (
    <div className="flex flex-col">
      <h1 className="text-[14px] mb-1">Record Video</h1>
      <div className="relative border border-[rgba(208,213,221,1)] bg-[rgba(255,255,255,0.02)] rounded-xl px-4 w-[290px] h-[114px] lg:w-[366px] flex flex-col items-center justify-center transition-shadow duration-300 ">
        <div
          onClick={isRecordingVideo ? stopRecordingVideo : startRecordingVideo}
          className={`cursor-pointer border rounded-full w-[50px] h-[50px] flex justify-center items-center ${
            isRecordingVideo ? "bg-red-500" : ""
          } hover:${
            isRecordingVideo ? "bg-red-600" : "hoverEffect"
          } transition duration-200`}
        >
          <img
            src="../images/icons/video.png"
            className="object-none w-8 h-8"
            alt="Video Icon"
          />
        </div>
        <h1 className="text-sm mt-2 text-gray-700">
          <span className="text-purple-600 font-semibold">
            {isRecordingVideo ? "Recording..." : "Click"}
          </span>{" "}
          to {isRecordingVideo ? "stop recording" : "start recording..."}
        </h1>
      </div>

      {errorMessage && (
        <div className="mt-2 text-red-500 text-sm">
          <strong></strong> {errorMessage}
        </div>
      )}

      <video
        ref={videoRef}
        autoPlay
        className={`${
          isRecordingVideo ? "visible" : "hidden"
        } rounded-xl mt-4 w-full max-w-[290px] lg:max-w-[366px]`}
      />

      {videoUrl && (
        <div className="mt-4">
          <h2 className="text-sm text-gray-600">Recorded Video:</h2>
          <video
            src={videoUrl}
            controls
            className="mt-2 rounded-xl w-full max-w-[290px] lg:max-w-[366px]"
          />
          <button
            onClick={saveVideoFile}
            className="mt-2 bg-purple-500 hover:bg-purple-600 text-white py-2 px-4 rounded transition duration-200"
          >
            Download Video
          </button>
        </div>
      )}
    </div>
  );
};

export default VideoRecorder;

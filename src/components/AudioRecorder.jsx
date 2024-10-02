import React, { useState, useRef } from "react";

const AudioRecorder = ({ onAudioUrlChange }) => {
  const [isRecording, setIsRecording] = useState(false);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const [audioUrl, setAudioUrl] = useState(null);
  const [error, setError] = useState(null);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

      mediaRecorderRef.current = new MediaRecorder(stream);
      mediaRecorderRef.current.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorderRef.current.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, {
          type: "audio/wav",
        });
        const url = URL.createObjectURL(audioBlob);
        setAudioUrl(url);
        onAudioUrlChange(url); // Pass the audio URL to the parent
        audioChunksRef.current = []; // Clear the chunks for the next recording
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
      setError(null); // Clear any previous errors
    } catch (err) {
      setError("Failed to access microphone. Please check your settings.");
      console.error("Error accessing microphone:", err);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const toggleRecording = () => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  const saveAudioFile = () => {
    if (audioUrl) {
      const link = document.createElement("a");
      link.href = audioUrl;
      link.download = "recorded-audio.wav";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <div className="flex flex-col">
      <h1 className="text-[14px] mb-1">Record Voice</h1>
      <div className="relative border border-[rgba(208,213,221,1)] bg-[rgba(255,255,255,0.02)] rounded-xl px-4 w-[290px] h-[114px] lg:w-[366px] flex flex-col items-center justify-center shadow-lg transition-shadow duration-300 hover:shadow-2xl">
        <div
          onClick={toggleRecording}
          className={`cursor-pointer border rounded-full w-[50px] h-[50px] flex justify-center items-center ${
            isRecording ? "bg-red-500" : ""
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
        {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
      </div>

      {audioUrl && (
        <div className="mt-4">
          <h2 className="text-sm text-gray-600">Recorded Audio:</h2>
          <audio src={audioUrl} controls className="mt-2" />
          <button
            onClick={saveAudioFile}
            className="mt-2 bg-purple-500 hover:bg-purple-600 text-white py-2 px-4 rounded transition duration-200"
          >
            Download Audio
          </button>
        </div>
      )}
    </div>
  );
};

export default AudioRecorder;

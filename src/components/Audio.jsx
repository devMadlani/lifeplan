import React, { useState } from "react";

function Audio() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  const handlePlayPause = () => {
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play();
      setIsPlaying(true);
    }
  };

  const handleTimeUpdate = (e) => {
    setCurrentTime(e.target.currentTime);
  };

  const handleLoadedData = (e) => {
    setDuration(e.target.duration);
  };

  const handleSeek = (e) => {
    audioRef.current.currentTime = e.target.value;
  };

  const handleDelete = () => {
    // Implement your deletion logic here
    console.log("Record deleted");
  };

  return (
    <div className="flex items-center justify-between p-2 bg-gray-100 rounded-md">
      <div className="flex items-center">
        <button
          className="text-purple-500 hover:text-purple-700"
          onClick={handlePlayPause}
        >
          {isPlaying ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M15 10l-7 7m0 0l7 7m-7-7v12a2.5 2.5 0 0 0 2.5 2.5H19a2.5 2.5 0 0 0 2.5-2.5V10"
              />
            </svg>
          )}
        </button>
        <div className="flex-grow mx-2">
          <input
            type="range"
            className="w-full appearance-none bg-gray-200 rounded-lg"
            min="0"
            max={duration}
            value={currentTime}
            onChange={handleSeek}
          />
          <div className="flex items-center justify-between px-2">
            <span className="text-xs">{formatTime(currentTime)}</span>
            <span className="text-xs">{formatTime(duration)}</span>
          </div>
        </div>
      </div>
      <div className="flex items-center">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6 text-gray-500 hover:text-gray-700"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M19 7l-7-7m0 0l-7 7m7-7v12a2.5 2.5 0 0 1 2.5 2.5H19a2.5 2.5 0 0 1 2.5-2.5V7"
          />
        </svg>
        <button
          className="text-gray-500 hover:text-gray-700 ml-2"
          onClick={handleDelete}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M19 7l-7-7m0 0l-7 7m7-7v12a2.5 2.5 0 0 1-2.5 2.5H6a2.5 2.5 0 0 1-2.5-2.5V7"
            />
          </svg>
        </button>
      </div>
    </div>
  );
}

function formatTime(seconds) {
  const minutes = Math.floor(seconds / 60);
  const secondsLeft = seconds % 60;
  return `${minutes}:${secondsLeft < 10 ? "0" : ""}${secondsLeft}`;
}

export default Audio;

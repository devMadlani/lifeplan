import React from "react";
import ReactPlayer from "react-player";

const VideoPlayer = () => {
  const handlePlay = () => {
    console.log("Video started playing");
  };

  const handlePause = () => {
    console.log("Video is paused");
  };

  const handleEnded = () => {
    alert("Video playback complete");
  };

  return (
    <ReactPlayer
      url="/audio/vide.mp4"
      playing={false}
      controls
      onPlay={handlePlay}
      onPause={handlePause}
      onEnded={handleEnded}
    />
  );
};

export default VideoPlayer;

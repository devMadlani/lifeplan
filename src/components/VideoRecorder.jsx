// src/components/VideoRecorder.js
import React, { useRef, useState } from 'react';
import { saveVideo, getVideo } from '../indexedDB';

const VideoRecorder = () => {
  const [recording, setRecording] = useState(false);
  const [videoURL, setVideoURL] = useState(null);
  const [videoKey, setVideoKey] = useState(''); // State for the input value
  const mediaRecorderRef = useRef(null);
  const videoChunks = useRef([]);

  const startRecording = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
    mediaRecorderRef.current = new MediaRecorder(stream);

    mediaRecorderRef.current.ondataavailable = (event) => {
      if (event.data.size > 0) {
        videoChunks.current.push(event.data);
      }
    };

    mediaRecorderRef.current.onstop = async () => {
      const videoBlob = new Blob(videoChunks.current, { type: 'video/mp4' });
      const key = `video-${Date.now()}`;
      await saveVideo(key, videoBlob);
      alert(`Video saved with key: ${key}`);
      videoChunks.current = [];
    };

    mediaRecorderRef.current.start();
    setRecording(true);
  };

  const stopRecording = () => {
    mediaRecorderRef.current.stop();
    setRecording(false);
  };

  const playSavedVideo = async () => {
    if (!videoKey) {
      alert('Please enter a valid key!');
      return;
    }

    const videoBlob = await getVideo(videoKey);
    if (videoBlob) {
      const url = URL.createObjectURL(videoBlob);
      setVideoURL(url);
    } else {
      alert(`No video found for key: ${videoKey}`);
    }
  };

  return (
    <div>
      <h1>Video Recorder</h1>
      <div>
        <button onClick={startRecording} disabled={recording}>
          Start Recording
        </button>
        <button onClick={stopRecording} disabled={!recording}>
          Stop Recording
        </button>
      </div>

      <div>
        <h2>Play Saved Video</h2>
        <input
          type="text"
          value={videoKey}
          onChange={(e) => setVideoKey(e.target.value)} // Update the state with input value
          placeholder="Enter video key"
        />
        <button onClick={playSavedVideo}>Play Video</button>
      </div>

      {videoURL && (
        <video controls src={videoURL} width="400" >
          Your browser does not support HTML5 video.
        </video>
      )}
    </div>
  );
};

export default VideoRecorder;

import React, { useState, useEffect, useRef } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

const DATABASE_NAME = "JournalDB";
const STORE_NAME = "journals";

function NewJournal() {
  const [isRecording, setIsRecording] = useState(false);
  const [audioUrl, setAudioUrl] = useState(null);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const [isRecordingVideo, setIsRecordingVideo] = useState(false);
  const [videoUrl, setVideoUrl] = useState(null);
  const mediaRecorderVideoRef = useRef(null);
  const videoChunksRef = useRef([]);
  const videoRef = useRef(null);
  const fileInputRef = useRef(null);
  const [file, setFile] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [value, setValue] = useState("");
  const [tags, setTags] = useState([]);
  const [input, setInput] = useState("");
  const [journals, setJournals] = useState([]);
  const [currentJournal, setCurrentJournal] = useState(null);

  useEffect(() => {
    const dbRequest = indexedDB.open(DATABASE_NAME, 1);
    dbRequest.onupgradeneeded = (event) => {
      const db = event.target.result;
      db.createObjectStore(STORE_NAME, { keyPath: "id", autoIncrement: true });
    };
    dbRequest.onsuccess = (event) => {
      const db = event.target.result;
      fetchJournals(db);
    };
  }, []);

  const fetchJournals = (db) => {
    const transaction = db.transaction(STORE_NAME, "readonly");
    const store = transaction.objectStore(STORE_NAME);
    const request = store.getAll();
    request.onsuccess = () => {
      setJournals(request.result);
    };
  };

  const saveJournal = (db) => {
    const journalData = {
      title: document.getElementById("title").value,
      description: value,
      tags: tags,
      audioUrl: audioUrl,
      videoUrl: videoUrl,
      file: file ? file.name : null, // Store only the file name for simplicity
    };

    const transaction = db.transaction(STORE_NAME, "readwrite");
    const store = transaction.objectStore(STORE_NAME);
    store.add(journalData);

    transaction.oncomplete = () => {
      fetchJournals(db); // Refresh the journal list after saving
      resetForm(); // Clear the form fields
      console.log("Dispatching journalSaved event");
      window.dispatchEvent(new Event("journalSaved"));
    };
  };

  const resetForm = () => {
    document.getElementById("title").value = "";
    setValue("");
    setTags([]);
    setAudioUrl(null);
    setVideoUrl(null);
    setFile(null);
    setUploadProgress(0);
  };

  const handleSave = () => {
    const dbRequest = indexedDB.open(DATABASE_NAME, 1);
    dbRequest.onsuccess = (event) => {
      const db = event.target.result;
      saveJournal(db);
    };
  };

  const  loadJournal = (journal) => {
    document.getElementById("title").value = journal.title;
    setValue(journal.description);
    setTags(journal.tags);
    setAudioUrl(journal.audioUrl);
    setVideoUrl(journal.videoUrl);
    setFile(journal.file); // Display file name, but won't show the actual file
  };

  const modules = {
    toolbar: [
      [{ header: "1" }, { header: "2" }, { font: [] }],
      [{ list: "ordered" }, { list: "bullet" }],
      ["bold", "italic", "underline"],
      ["image"], // Add image button here
    ],
  };
  //for tag
  const handleKeyDown = (e) => {
    // Prevent page refresh on Enter
    if (e.key === "Enter" && input.trim() !== "") {
      e.preventDefault();
      setTags([...tags, input.trim()]);
      setInput(""); // Clear input after adding tag
    } else if (e.key === "Backspace" && input === "") {
      // Remove the last tag if input is empty and Backspace is pressed
      e.preventDefault(); // Prevent default backspace action
      setTags(tags.slice(0, -1)); // Remove the last tag
    }
  };

  const handleRemoveTag = (indexToRemove) => {
    e.stopPropagation(); // Stop click event from bubbling up
    setTags(tags.filter((_, index) => index !== indexToRemove));
  };
  // for audio
  const startRecording = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    mediaRecorderRef.current = new MediaRecorder(stream);

    mediaRecorderRef.current.ondataavailable = (event) => {
      audioChunksRef.current.push(event.data);
    };

    mediaRecorderRef.current.onstop = () => {
      const audioBlob = new Blob(audioChunksRef.current, { type: "audio/wav" });
      const url = URL.createObjectURL(audioBlob);
      setAudioUrl(url);
      audioChunksRef.current = []; // Clear the chunks for the next recording
    };

    mediaRecorderRef.current.start();
    setIsRecording(true);
  };

  const stopRecording = () => {
    mediaRecorderRef.current.stop();
    setIsRecording(false);
  };

  const saveAudioFile = () => {
    const link = document.createElement("a");
    link.href = audioUrl;
    link.download = "recorded-audio.wav";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  //for video
  const startRecordingVideo = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true,
    });
    videoRef.current.srcObject = stream; // Display the video stream

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
      videoChunksRef.current = []; // Clear the chunks for the next recording
    };

    mediaRecorderVideoRef.current.start();
    setIsRecordingVideo(true);
  };

  const stopRecordingVideo = () => {
    mediaRecorderVideoRef.current.stop();
    setIsRecordingVideo(false);
  };

  const saveVideoFile = () => {
    const link = document.createElement("a");
    link.href = videoUrl;
    link.download = "recorded-video.webm";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  //for upload file
  const handleFileUpload = (event) => {
    const files = event.target.files;
    if (files.length > 0) {
      const uploadedFile = files[0];
      setFile(uploadedFile);
      simulateFileUpload(uploadedFile);
    }
  };

  const simulateFileUpload = (uploadedFile) => {
    // Simulate an upload process for demonstration
    let progress = 0;
    const interval = setInterval(() => {
      progress += 10; // Increase progress by 10% every second
      setUploadProgress(progress);
      if (progress >= 100) {
        clearInterval(interval);
      }
    }, 100);
  };

  const handleDragOver = (event) => {
    event.preventDefault();
    event.stopPropagation();
  };

  const handleDrop = (event) => {
    event.preventDefault();
    event.stopPropagation();
    const files = event.dataTransfer.files;
    if (files.length > 0) {
      const uploadedFile = files[0];
      setFile(uploadedFile);
      simulateFileUpload(uploadedFile);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  const handleDelete = () => {
    setFile(null);
    setUploadProgress(0);
  };
  //rich text

  return (
    <div >
      
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
                id="title" // Add id for accessing in saveJournal
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
              <h1 htmlFor="tags" className="text-[14px] mb-1">
                Tags
              </h1>

              <div className="flex flex-wrap items-center gap-1  border border-[rgba(208,213,221,1)] rounded-xl px-4  min-w-[300px] sm:w-[520px] lg:w-[766px] min-h-[44px] focus-within:border-[rgba(127,86,217,1)] py-2">
                {tags.map((tag, index) => (
                  <div
                    key={index}
                    className="inline-flex items-center border ml-1 border-[rgba(208,213,221,1)] rounded-lg text-gray-800 px-3 py-1"
                  >
                    {tag}
                    <button
                      className="ml-2 text-black font-bold cursor-pointer focus:outline-none"
                      onClick={() => handleRemoveTag(index)}
                    >
                      &times;
                    </button>
                  </div>
                ))}
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="ml-2 flex-grow text-[16px] outline-none bg-[rgba(255,255,255,0.02)] min-h-[44px] max-h-20 resize-none"
                  placeholder="Enter your Tags"
                />
              </div>
            </div>
            <div className="flex flex-wrap gap-7 justify-center">
              <div className="flex flex-col ">
                <h1 className="text-[14px]  mb-1">Record Voice</h1>
                <div className="relative border border-[rgba(208,213,221,1)] bg-[rgba(255,255,255,0.02)] rounded-xl px-4 w-[290px] h-[114px] lg:w-[366px] flex flex-col items-center justify-center shadow-lg transition-shadow duration-300 hover:shadow-2xl">
                  <div
                    style={{}}
                    onClick={isRecording ? stopRecording : startRecording}
                    className={`cursor-pointer border rounded-full w-[50px] h-[50px] flex justify-center items-center ${
                      isRecording ? "bg-red-500" : " "
                    } hover:${
                      isRecording ? "bg-red-600" : " hoverEffect  "
                    } transition duration-200`}
                  >
                    <img
                      src="../images/icons/audio.svg"
                      className="object-none w-8 h-8  "
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
                    <button
                      onClick={saveAudioFile}
                      className="mt-2 bg-purple-500 hover:bg-purple-600 text-white py-2 px-4 rounded transition duration-200"
                    >
                      Download Audio
                    </button>
                  </div>
                )}
              </div>
              <div className="flex flex-col ">
                <h1 className="text-[14px]  mb-1">Record Video</h1>
                <div className="relative border border-[rgba(208,213,221,1)] bg-[rgba(255,255,255,0.02)] rounded-xl px-4 w-[290px] h-[114px] lg:w-[366px] flex flex-col items-center justify-center shadow-lg transition-shadow duration-300 hover:shadow-2xl">
                  <div
                    onClick={isRecording ? stopRecording : startRecording}
                    className={`cursor-pointer border rounded-full w-[50px] h-[50px] flex justify-center items-center ${
                      isRecording ? "bg-red-500" : ""
                    } hover:${
                      isRecording ? "bg-red-600" : " hoverEffect "
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
                      {isRecording ? "Recording..." : "Click"}
                    </span>{" "}
                    to {isRecording ? "stop recording" : "start recording..."}
                  </h1>
                </div>

                {/* Video Element to display the stream */}
                <video
                  ref={videoRef}
                  autoPlay
                  className={`${
                    isRecording ? "visible" : "hidden"
                  } rounded-xl mt-4 w-full max-w-[290px] lg:max-w-[366px]`}
                />

                {/* Playback and Download */}
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
            </div>
            <div>
              <h1 className="text-[14px] mb-2">Files</h1>
              <div
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                onClick={triggerFileInput} // Trigger file input on clicking the upload area
                className="text-[16px] border relative border-[rgba(208,213,221,1)] bg-[rgba(255,255,255,0.02)] rounded-xl px-4 w-[300px] h-[124px] lg:w-[760px] flex flex-col items-center justify-center cursor-pointer"
              >
                {!file ? (
                  <div className="flex flex-col items-center justify-center h-full">
                    <div className="border rounded-lg w-[35px] h-[35px] flex justify-center pl-[2px]">
                      <img
                        src="../images/icons/upload.png"
                        className="object-none"
                        alt="Upload Icon"
                      />
                    </div>
                    <h1 className="text-sm mt-2 text-[rgba(71,84,103,1)]">
                      <span className="text-[rgba(105,65,198,1)] font-semibold">
                        Click to upload
                      </span>{" "}
                      or drag and drop
                    </h1>
                    <h1 className="text-xs text-[rgba(71,84,103,1)] mt-[2px]">
                      (max. 5 MB)
                    </h1>
                  </div>
                ) : (
                  <div className="flex flex-col w-full">
                    <div className="flex justify-between items-start">
                      <h2 className="text-sm font-semibold text-gray-800">
                        {file.name}
                      </h2>
                      <button
                        onClick={handleDelete}
                        className="text-red-500 text-xs font-semibold"
                      >
                        Delete
                      </button>
                    </div>
                    {uploadProgress < 100 && (
                      <span className="text-xs text-gray-600">
                        File Size: {Math.round(file.size / 1024)} KB
                      </span>
                    )}
                    <div className="flex items-center w-full mt-2">
                      {/* Icon next to the progress bar */}
                      <div className="border rounded-lg w-[30px] h-[30px] flex justify-center items-center mr-2">
                        <img
                          src="../images/icons/document.png" // Replace with your document icon
                          className="object-none"
                        />
                      </div>
                      {uploadProgress < 100 && (
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-purple-500 h-full rounded-full transition-all"
                            style={{ width: `${uploadProgress}%` }}
                          />
                        </div>
                      )}
                    </div>
                    {uploadProgress < 100 && (
                      <div className="flex justify-between items-center w-full mt-1">
                        <span className="text-xs text-gray-600">
                          {uploadProgress}%
                        </span>
                      </div>
                    )}
                  </div>
                )}
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileUpload}
                  className="hidden"
                  accept="*/*" // Specify file types if needed
                />
              </div>
            </div>
            <div className="flex gap-1 pt-0 border-t border-[rgba(234,236,240,1)] min-w-[320px] w-[826px] justify-end px-2 ">
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
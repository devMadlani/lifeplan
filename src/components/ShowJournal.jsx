import React, { useState, useEffect, useRef } from "react";
import DOMPurify from "dompurify";

function ShowJournal() {
  const [entries, setEntries] = useState([]);
  const videoRef = useRef(null);
  const [title, setTitle] = useState("")
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [description, setDescription] = useState("");

  const fetchEntries = () => {
    const dbRequest = indexedDB.open("JournalDB", 1);
    dbRequest.onsuccess = (event) => {
      const db = event.target.result;
      const transaction = db.transaction(["journals"], "readwrite");
      const objectStore = transaction.objectStore("journals");
      const allEntriesRequest = objectStore.getAll();
      allEntriesRequest.onsuccess = (event) => {
        setEntries(event.target.result);
        const entry = event.target.result[0]; // Adjust this as needed
        setTitle(entry.title)
        const sanitizedHtml = DOMPurify.sanitize(entry.description); // Sanitize the HTML
        const textContent = new DOMParser().parseFromString(
          sanitizedHtml,
          "text/html"
        ).body.innerText; // Extract plain text
        setDescription(textContent);
      };
    };
    dbRequest.onerror = (event) => {
      console.error("Database error:", event.target.error);
    };
  };

  useEffect(() => {
    fetchEntries();
  }, []);

  // Fullscreen toggle functionality
  const toggleFullscreen = () => {
    if (!isFullscreen) {
      videoRef.current.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
    setIsFullscreen(!isFullscreen);
  };


  return (
    <div className="w-[326px] sm:w-[526px] md:w-[600px] lg:w-[826px] ">
      <div className="flex flex-col gap-4 flex-grow mx-4 ">
        <div className="bg-[rgba(252,252,253,1)] flex justify-between">
          <h1 className="text-[20px] text-[rgba(16,24,40,1)] my-2 ">{title}</h1>
          <div className="my-auto flex gap-1 mx-1">
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
        <h1 className="lg:text-center text-xs text-[rgba(152,162,179,1)]">
          January 11, 2025 at 11:43PM
        </h1>

        <div className="flex flex-col gap-4 h-[758px] flex-grow min-w-[320px] max-w-[826px]">
          <div className="tags flex flex-wrap gap-2">
            {entries.map((entry, index) =>
              entry.tags.map((tag) => (
                <div
                  key={index}
                  className=" border border-[rgba(208,213,221,1)] min-w-14 rounded-md text-center text-sm font-medium px-2"
                >
                  {tag}
                </div>
              ))
            )}
          </div>
          <div className="desc max-w-[700px] my-4 text-left">{description}</div>

          <div className="audio">
            <div className="mt-4">
              <h2 className="text-sm text-gray-600">Recorded Audio:</h2>
              <audio
                src="../audio/audio.mp3"
                controls
                className="mt-2 max-w-[300px]"
              />
            </div>
          </div>

          <div className="video mt-4">
            <h2 className="text-sm text-gray-600">Recorded Video:</h2>
            {/* Video Section with play button in the center and delete button in top-right */}
            <div className="video-container relative w-full max-w-[290px] lg:max-w-[366px]">
              <video
                ref={videoRef}
                src="../audio/vide.mp4"
                className="rounded-xl w-full"
                onClick={() => {
                  if (isPlaying) {
                    videoRef.current.pause(); // Pause video
                    setIsPlaying(false); // Update state
                  } else {
                    videoRef.current.play(); // Play video
                    setIsPlaying(true); // Update state
                  }
                }}
                onPlay={() => setIsPlaying(true)}
                onPause={() => setIsPlaying(false)}
              />

              {!isPlaying && (
                <button
                  onClick={(e) => {
                    e.stopPropagation(); // Prevent video click event
                    videoRef.current.play(); // Play video
                    setIsPlaying(true); // Update state
                  }}
                  className="absolute inset-0 m-auto text-white text-lg flex justify-center items-center rounded-full"
                  style={{ width: "50px", height: "50px" }}
                >
                  <img src="../images/icons/play.png" alt="" />
                </button>
              )}
              <button
                onClick={() => alert("Delete action triggered")}
                className="absolute top-2 right-2 text-white p-2 rounded-[26px] bg-[rgba(12,17,29,0.3)]"
              >
                <img src="../images/icons/delete.png" alt="" />
              </button>
            </div>
          </div>

          <div className="file mt-4">
            <div className="flex w-full">
              <div className="flex items-center mt-2 mr-2">
                <div className="border rounded-lg w-[30px] h-[30px] flex justify-center items-center mr-2">
                  <img src="../images/icons/file.png" className="object-none" />
                </div>
              </div>
              <div className="flex flex-col">
                <h2 className="text-[14px   ] font-semibold text-gray-700">
                  File Title
                </h2>
                <span className="text-[12px] text-gray-600">100 KB</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ShowJournal;

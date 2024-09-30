import React, { useState, useEffect, useRef } from "react";
import DOMPurify from "dompurify";
import { useJournal } from "../context/JournalContext"; // Adjust the path as necessary
import NewJournal from "./NewJournal";
import { fetchJournals } from "../indexedDB/OpenDB";

function ShowJournal({ newEntry, onEdit }) {
  const { selectedEntry, deleteJournal } = useJournal(); // Use the context to get the selected entry
  const [date, setDate] = useState("");
  const [tag, setTag] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [audioUrl, setAudioUrl] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [file, setFile] = useState(null);
  const videoRef = useRef(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showOptions, setShowOptions] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const toggleOptions = () => {
    setShowOptions(!showOptions);
  };

  useEffect(() => {
    const fetchFilesAndTags = async () => {
      let entry = selectedEntry || newEntry;

      if (entry) {
        setTitle(entry.title);
        setDate(entry.date);
        setAudioUrl(entry.audioUrl);
        setVideoUrl(entry.videoUrl);
        setTag(entry.tags || []); // Set tags from the entry

        // Fetch and process files
        if (entry.files && entry.files.length > 0) {
          const filePromises = entry.files.map((file) => {
            const blob = new Blob([file.data], { type: file.type });
            const fileBlobUrl = URL.createObjectURL(blob);
            return {
              name: file.name,
              size: file.size,
              url: fileBlobUrl,
            };
          });

          const filesArray = await Promise.all(filePromises);
          setFile(filesArray);
        } else {
          setFile([]); // No files found
        }

        // Sanitize and set the description
        const sanitizedHtml = DOMPurify.sanitize(entry.description);
        const textContent = new DOMParser().parseFromString(
          sanitizedHtml,
          "text/html"
        ).body.innerText;
        setDescription(textContent);
      }
    };

    fetchFilesAndTags();
  }, [selectedEntry, newEntry]);

  // Fullscreen toggle functionality
  const toggleFullscreen = () => {
    if (videoRef.current) {
      if (!isFullscreen) {
        videoRef.current.requestFullscreen();
      } else {
        document.exitFullscreen();
      }
      setIsFullscreen(!isFullscreen);
    }
  };

  const handleDelete = () => {
    if (selectedEntry) {
      deleteJournal(selectedEntry.id); // Call the deleteJournal function from context
    } else if (newEntry) {
      deleteJournal(newEntry.id);
    }
  };

  if (!selectedEntry && !newEntry) {
    return (
      <h1 className="text-center text-lg font-bold mx-auto mt-12 ">
        Please Add or Select Journal to View
      </h1>
    );
  }

  return (
    <div className="w-[326px] sm:w-[526px] md:w-[600px] lg:w-[851px] ">
      <div className="flex flex-col gap-4 ">
        {isEditing ? (
          <NewJournal
            onSave={(data) => {
              handleSave(data);
              setIsEditing(false); // Exit editing mode after saving
            }}
            existingData={{
              title,
              description,
              tags: tag,
              audioUrl,
              videoUrl,
              files: file,
            }}
          />
        ) : (
          <>
            <div className="bg-[rgba(252,252,253,1)] flex justify-between">
              <h1 className="text-[20px] text-[rgba(16,24,40,1)] my-2 mx-4">
                {title || "Journal"}
              </h1>
              <div className="my-auto flex gap-1 mx-1">
                <button className="py-1 px-2 flex items-center gap-1 border focus:border-[rgba(127,86,217,1)] outline-none focus:shadow-sm focus:shadow-[rgba(127,86,217,1)] rounded-xl">
                  <img src="../images/icons/share.png" alt="" />
                  <span className="text-xs text-[rgba(102,112,133,1)] ml-1">
                    Share
                  </span>
                </button>
                <div className="relative my-auto">
                  <button
                    className="py-1 px-2 flex items-center  gap-1  "
                    onClick={toggleOptions}
                  >
                    <img src="../images/icons/dot.png" alt="" />
                  </button>
                  {showOptions && (
                    <div className="absolute mt-2 right-1 top-7 py-2 w-44 bg-white rounded-lg shadow-lg">
                      <button
                        onClick={() => onEdit(selectedEntry)}
                        className="flex py-2 text-gray-800 hover:bg-[rgba(249,250,251,1)] ml-2  group"
                      >
                        <img
                          src="../images/icons/edit.png"
                          alt=""
                          className="mx-2 self-center"
                        />
                        <span className="text-[rgba(52,64,84,1)] text-sm font-medium">
                          Edit
                        </span>
                        <img
                          src="../images/icons/click.png"
                          alt=""
                          className="self-center ml-[90px] opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                        />
                      </button>

                      <button
                        onClick={handleDelete}
                        className="py-2 text-gray-800 hover:bg-[rgba(249,250,251,1)] flex mx-auto group "
                      >
                        <img
                          src="../images/icons/trash.png"
                          alt=""
                          className="mx-2 self-center"
                        />
                        <span className="text-[rgba(52,64,84,1)] text-sm font-medium">
                          Delete
                        </span>
                        <img
                          src="../images/icons/click.png"
                          alt=""
                          className="self-center ml-[73px] opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                        />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
            <h1 className="lg:text-center text-xs text-[rgba(152,162,179,1)]">
              {selectedEntry?.date || newEntry?.date || "Date Not Available"}
            </h1>

            <div className="flex flex-col px-8 gap-4 h-[758px] flex-grow min-w-[320px] max-w-[826px]">
              <div className="tags flex flex-wrap gap-2">
                {tag.length > 0 ? (
                  tag.map((tagItem, index) => (
                    <div
                      key={index}
                      className="border border-[rgba(208,213,221,1)] min-w-14 rounded-md text-center text-sm font-medium px-2"
                    >
                      {tagItem}
                    </div>
                  ))
                ) : (
                  <div className="border border-[rgba(208,213,221,1)] min-w-14 rounded-md text-center text-sm font-medium px-2">
                    No tags available
                  </div>
                )}
              </div>

              <div className="desc max-w-[700px] my-4 text-left">
                {description}
              </div>

              <div className="audio">
                <div className="mt-4">
                  <h2 className="text-sm text-gray-600">Recorded Audio:</h2>
                  <audio
                    src={audioUrl} // Use the audio from your entry
                    controls
                    className="mt-2 max-w-[300px]"
                  />
                </div>
              </div>

              <div className="video mt-4">
                <h2 className="text-sm text-gray-600">Recorded Video:</h2>
                <div className="video-container relative w-full max-w-[290px] lg:max-w-[366px]">
                  <video
                    ref={videoRef}
                    src={videoUrl} // Use the video from your entry
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
                      className="absolute inset-0 m-auto flex items-center justify-center bg-black bg-opacity-50 rounded-lg"
                    >
                      <img
                        src="../images/icons/play.png"
                        alt="Play"
                        className="h-10"
                      />
                    </button>
                  )}

                  <button
                    onClick={toggleFullscreen}
                    className="absolute right-2 bottom-2 bg-white p-1 rounded-md shadow-md"
                  >
                    <img src="../images/icons/fullscreen.png" alt="" />
                  </button>
                </div>
              </div>

              <div className="files">
                <h2 className="text-sm text-gray-600">Uploaded Files:</h2>
                <ul className="mt-2">
                  {file && file.length > 0 ? (
                    file.map((fileItem, index) => (
                      <li key={index} className="mt-1">
                        <a
                          href={fileItem.url} // Use the blob URL for file download
                          className="text-blue-500 underline"
                          download={fileItem.name} // Enable file download
                        >
                          {fileItem.name} ({(fileItem.size / 1024).toFixed(2)}{" "}
                          KB)
                        </a>
                      </li>
                    ))
                  ) : (
                    <li>No files available</li>
                  )}
                </ul>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default ShowJournal;

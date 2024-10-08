import React, { useState, useEffect, useRef } from "react";
import DOMPurify from "dompurify";
import { useJournal } from "../context/JournalContext"; // Adjust the path as necessary
import NewJournal from "./NewJournal";

function ShowJournal({ newEntry, journals, onEdit, onBackClick }) {
  const { selectedEntry, deleteJournal } = useJournal();
  const [date, setDate] = useState("");
  const [tag, setTag] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [audioUrl, setAudioUrl] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [files, setFiles] = useState([]);
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showOptions, setShowOptions] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const toggleOptions = () => {
    setShowOptions(!showOptions);
  };

  useEffect(() => {
    const fetchFilesAndTags = async () => {
      setLoading(true);
      try {
        let entry = selectedEntry || newEntry;

        if (entry) {
          setTitle(entry.title);
          setDate(entry.date);
          setAudioUrl(entry.audioUrl);
          setVideoUrl(entry.videoUrl);
          setTag(entry.tags || []);

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
            setFiles(filesArray);
          } else {
            setFiles([]);
          }

          // Sanitize and set the description
          const sanitizedHtml = DOMPurify.sanitize(entry.description, {
            ADD_TAGS: [
              "img",
              "h1",
              "h2",
              "h3",
              "h4",
              "h5",
              "h6",
              "ul",
              "ol",
              "li",
            ],
            ADD_ATTR: ["src", "alt", "style", "class"],
          });

          setDescription(sanitizedHtml); // Store the sanitized HTML directly
        }
      } catch (error) {
        console.error("Error fetching journal entry:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFilesAndTags();
  }, [selectedEntry, newEntry]);
  useEffect(() => {
    return () => {
      files.forEach((file) => URL.revokeObjectURL(file.url));
    };
  }, [files]);
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
      deleteJournal(selectedEntry.id);
    } else if (newEntry) {
      deleteJournal(newEntry.id);
    }
  };

  const handleImageDelete = (imageUrl) => {
    const updatedDescription = description.replace(
      `<img src="${imageUrl}" style="width: 300px;" alt="" />`,
      ""
    );
    setDescription(updatedDescription);
    setImages(images.filter((img) => img !== imageUrl));
  };

  // Ensure text wraps properly in the description
  const descriptionStyle = {
    wordBreak: "break-word", // Ensure long words break within the container
  };

  if (loading) {
    return (
      <h1 className="text-center text-lg font-bold mx-auto mt-12">
        Loading...
      </h1>
    );
  }

  if (!selectedEntry && !newEntry) {
    return (
      <h1 className="text-center text-lg font-bold mx-auto mt-12 ">
        Please Add or Select Journal to View
      </h1>
    );
  }

  return (
    <div className="w-[100%] sm:w-[526px] md:w-[600px] lg:w-[851px] sm:p-4 sm:border-l">
      <div className="">
        {isEditing ? (
          <NewJournal
            onSave={(data) => {
              handleSave(data);
              setIsEditing(false);
            }}
            existingData={{
              title,
              description,
              tags: tag,
              audioUrl,
              videoUrl,
              files,
            }}
          />
        ) : (
          <>
            <div className="bg-[rgba(252,252,253,1)] flex justify-between py-4 ">
              <div className="flex">
                <button
                  className="mr-[4px] ml-2 sm:hidden"
                  onClick={onBackClick}
                >
                  <img
                    src="/images/icons/back.png"
                    alt=""
                    className="w-[14px]"
                  />
                </button>
              </div>
              <div className="my-auto flex gap-1 mx-1">
                <button className="py-1 px-2 flex items-center gap-1 border focus:border-[rgba(127,86,217,1)] outline-none focus:shadow-sm focus:shadow-[rgba(127,86,217,1)] rounded-xl">
                  <img src="../images/icons/share.png" alt="" />
                  <span className="text-xs text-[rgba(102,112,133,1)] ml-1">
                    Share
                  </span>
                </button>
                <div className="relative my-auto">
                  <button
                    className="py-1 px-2 flex items-center gap-1"
                    onClick={toggleOptions}
                  >
                    <img src="../images/icons/dot.png" alt="" />
                  </button>
                  {showOptions && (
                    <div className="absolute mt-2 right-1 top-7 py-2 w-44 bg-white rounded-lg shadow-lg">
                      <button
                        onClick={() => onEdit(selectedEntry)}
                        className="flex py-2 text-gray-800 hover:bg-[rgba(249,250,251,1)] ml-2 group"
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
                        className="py-2 text-gray-800 hover:bg-[rgba(249,250,251,1)] flex mx-auto group"
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
            <h1 className="text-[20px] text-[rgba(16,24,40,1)] my-2 mx-4">
              {title || "Journal"}
            </h1>
            <h1 className="lg:text-center text-xs ml-[17px] mb-8 text-[rgba(152,162,179,1)]">
              {selectedEntry?.date || newEntry?.date || "Date Not Available"}
            </h1>

            <div className="flex flex-col gap-4 mx-[17px] flex-grow max-w-[826px]">
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

              {/* Description Section */}
              <div className="ql max-w-[700px] my-4 text-left">
                <div
                  style={descriptionStyle} // Apply word-break for better responsiveness
                  dangerouslySetInnerHTML={{ __html: description }}
                ></div>
              </div>

              {/* Render audio */}
              {audioUrl && (
                <audio
                  controls
                  className="my-2 max-w-[300px] self-center"
                  src={audioUrl}
                />
              )}

              {/* Render video */}
              {videoUrl && (
                <div className="video max-w-[700px] mx-auto flex flex-col">
                  <video
                    ref={videoRef}
                    src={videoUrl}
                    className="mx-auto w-full h-auto"
                    onClick={() => setIsPlaying(!isPlaying)}
                    controls
                  ></video>
                  <button
                    className="border px-2 py-1 my-4 rounded-md w-[150px] mx-auto text-[rgba(127,86,217,1)]"
                    onClick={toggleFullscreen}
                  >
                    {isFullscreen ? "Exit Fullscreen" : "Go Fullscreen"}
                  </button>
                </div>
              )}

              {/* {files && files.length > 0 && (
                <div className="file-section">
                  <h3 className="text-lg font-medium">Uploaded Files:</h3>
                  <ul className="list-disc ml-4">
                    {files.map((file, index) => (
                      <li key={index} className="text-blue-500">
                        <a href={file.url} download={file.name}>
                          {file.name}
                        </a>{" "}
                        - {file.size} bytes
                      </li>
                    ))}
                  </ul>
                </div>
              )} */}
              <div className="flex flex-wrap  mt-4">
                {files && files.length > 0 ? (
                  files.map((fileItem, index) => (
                    <div key={index} className="flex w-full sm:w-[33%]  my-4">
                      <div className="flex items-center  justify-center  mr-2">
                        <div className="border rounded-lg w-[35px] h-[35px] flex self-center mr-2">
                          <img
                            src="../images/icons/file.png"
                            className="object-none"
                          />
                        </div>
                      </div>
                      <div className="flex flex-col">
                        <h2 className="text-[14px] font-semibold text-gray-700">
                          {fileItem.name}
                        </h2>
                        <h2 className="text-[14px] text-gray-600">
                          {Math.round(fileItem.size / 1024)} KB
                        </h2>
                        <a
                          href={fileItem.url}
                          download={fileItem.name} // Add download attribute
                          className="text-[12px] text-blue-400 underline my-auto"
                        >
                          Download
                        </a>
                      </div>
                    </div>
                  ))
                ) : (
                  <div>No files uploaded</div>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default ShowJournal;

import React, { useState } from "react";

function FileUploader({ files, setFiles }) {
  const [errorMessage, setErrorMessage] = useState("");
  const [uploadProgress, setUploadProgress] = useState({});

  const handleFiles = (uploadedFiles) => {
    const validFiles = [];
    for (let i = 0; i < uploadedFiles.length; i++) {
      const file = uploadedFiles[i];
      if (validateFile(file)) {
        validFiles.push(file);
      }
    }

    const existingFileNames = new Set(files.map((f) => f.name));
    const newFiles = validFiles.filter((f) => !existingFileNames.has(f.name));

    setFiles((prevFiles) => [...prevFiles, ...newFiles]);
    newFiles.forEach((file) => simulateFileUpload(file));
  };

  const validateFile = (file) => {
    if (file.size > 5 * 1024 * 1024) {
      setErrorMessage("File size exceeds 5 MB");
      return false;
    }
    setErrorMessage("");
    return true;
  };

  const simulateFileUpload = (uploadedFile) => {
    let progress = 0;
    const interval = setInterval(() => {
      progress += 10; // Increase progress by 10% every second
      setUploadProgress((prevProgress) => ({
        ...prevProgress,
        [uploadedFile.name]: progress,
      }));
      if (progress >= 100) {
        clearInterval(interval);
        // Remove the progress after reaching 100% and hide the progress bar
        setTimeout(() => {
          setUploadProgress((prevProgress) => {
            const { [uploadedFile.name]: _, ...rest } = prevProgress;
            return rest;
          });
        }, 500); // 500ms delay to let user notice upload completed
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
    const uploadedFiles = event.dataTransfer.files;
    if (uploadedFiles.length > 0) {
      handleFiles(uploadedFiles);
    }
  };

  const handleDelete = (fileName) => {
    setFiles((prevFiles) => prevFiles.filter((file) => file.name !== fileName));
    setUploadProgress((prevProgress) => {
      const { [fileName]: removedProgress, ...rest } = prevProgress;
      return rest;
    });
  };

  return (
    <div>
      <div
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        className="text-[16px] border relative border-[rgba(208,213,221,1)] bg-[rgba(255,255,255,0.02)] rounded-xl px-4  w-[300px] h-[126px] lg:w-[760px] flex flex-col items-center  pt-3 cursor-pointer"
      >
        <div className="py-[10px] px-[9px] border rounded-xl">
          <img src="/images/icons/upload.png" alt="" />
        </div>
        <p className="text-gray-600 mt-2">
          <span
            className="text-[rgba(105,65,198,1)] text-sm cursor-pointer font-semibold"
            onClick={() => document.getElementById("fileInput").click()}
          >
            Click to upload
          </span>
          <span className="text-sm text-gray-600"> or drag and drop</span>
        </p>
        <p className="text-sm text-gray-600">(max. 5mo)</p>
        <input
          id="fileInput"
          type="file"
          multiple
          className="hidden"
          onChange={(e) => handleFiles(e.target.files)}
        />
      </div>

      <div className="flex flex-col mt-2">
        {files?.map((file) => (
          <div
            key={file.name}
            className="flex justify-between items-center p-2 border-b border-gray-200"
          >
            <span>
              {file.name} ({(file.size / 1024).toFixed(2)} KB)
            </span>
            {uploadProgress[file.name] && uploadProgress[file.name] < 100 && (
              <div className="w-full mx-2 bg-gray-200 rounded-full h-2.5">
                <div
                  className="bg-blue-600 h-2.5 rounded-full"
                  style={{ width: `${uploadProgress[file.name]}%` }}
                ></div>
              </div>
            )}
            <button
              onClick={() => handleDelete(file.name)}
              className="text-red-500 hover:text-red-700"
            >
              Delete
            </button>
          </div>
        ))}
      </div>

      {errorMessage && <div className="text-red-500">{errorMessage}</div>}
    </div>
  );
}

export default FileUploader;

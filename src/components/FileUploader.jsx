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
            className="text-[rgba(127,86,217,1)] text-sm cursor-pointer font-semibold"
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

      <div className="flex flex-col mt-2 ">
        {files?.map((file) => (
          <div className="border-b">
            <div key={file.name} className=" p-3  border-gray-200">
              <div className="flex gap-4 justify-between">
                <div className="flex gap-2">
                  <div className="border rounded-lg w-[35px] h-[35px] flex mt-2 mr-2">
                    <img
                      src="../images/icons/file.png"
                      className="object-none"
                    />
                  </div>
                  <div className="flex flex-col w-[70%]">
                    <span className="w-[120px] sm:w-[200px] mb-1 text-gray-700 text-base font-medium">
                      {file.name}
                    </span>
                    <span className="text-gray-600 text-sm font-normal">
                      {(file.size / 1024).toFixed(2)} KB
                    </span>
                  </div>
                </div>
                <button onClick={() => handleDelete(file.name)} className="">
                  <img src="/images/icons/deleteDark.png" alt="" />
                </button>
              </div>
            </div>
            {uploadProgress[file.name] && uploadProgress[file.name] < 100 && (
              <div className="flex py-2">
                <div className="w-[90%] mx-12 bg-gray-200 rounded-full h-4 flex items-center">
                  <div
                    className="bg-[rgba(127,86,217,1)] h-4 rounded-full"
                    style={{ width: `${uploadProgress[file.name]}%` }}
                  ></div>
                </div>
                <span className="mr-2 text-sm text-gray-700 font-medium">
                  {uploadProgress[file.name]}%
                </span>
              </div>
            )}
          </div>
        ))}
      </div>

      {errorMessage && <div className="text-red-500">{errorMessage}</div>}
    </div>
  );
}

export default FileUploader;

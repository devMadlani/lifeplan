import React from 'react'

function dumy() {
     const handleFileUpload = (event) => {
       const files = event.target.files;
       if (files.length > 0) {
         const uploadedFile = files[0];
         setFile(uploadedFile);
         simulateFileUpload(uploadedFile);
       }
     };

     const simulateFileUpload = (uploadedFile) => {
       let progress = 0;
       const interval = setInterval(() => {
         progress += 10; // Increase progress by 10% every second
         setUploadProgress(progress);
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
  return (
    <div>
      {" "}
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
                    src="../images/icons/file.png" // Replace with your document icon
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
            accept="*/*"
          />
        </div>
      </div>
    </div>
  );
}

export default dumy
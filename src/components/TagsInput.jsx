// TagsInput.js
import React, { useState } from "react";

const TagsInput = ({ tags, setTags }) => {
  const [input, setInput] = useState([]);

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && input.trim() !== "") {
      e.preventDefault();
      setTags((prevTags) => [...prevTags, input.trim()]);
      setInput(""); // Clear input after adding tag
    } else if (e.key === "Backspace" && input === "") {
      e.preventDefault();
      setTags((prevTags) => prevTags.slice(0, -1)); // Remove the last tag
    }
  };

  const handleRemoveTag = (indexToRemove) => {
    setTags((prevTags) =>
      prevTags.filter((_, index) => index !== indexToRemove)
    );
  };

  return (
    <div>
      <h1 htmlFor="tags" className="text-[14px] mb-1">
        Tags
      </h1>
      <div className="flex flex-wrap items-center gap-1 border border-[rgba(208,213,221,1)] rounded-xl px-4 min-w-[300px] sm:w-[520px] lg:w-[766px] min-h-[44px] focus-within:border-[rgba(127,86,217,1)] py-2  ">
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
  );
};

export default TagsInput;

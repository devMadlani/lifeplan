import React from "react";

function NewJournal() {
  return (
    <div className="flex flex-col float-right gap-4 p-0 lg:px-4 ">
      <div className="bg-[rgba(252,252,253,1)]">
        <h1 className="text-[20px] text-[rgba(16,24,40,1)] m-2">New Journal</h1>
      </div>
      <div className="min-w-[320px] max-w-[826px] flex justify-center">
        <form className="flex flex-wrap flex-col items-center gap-2" action="">
          <div>
            <h1 htmlFor="title" className="text-[14px]  mb-1">
              Title
            </h1>
            <input
              type="text"
              className="text-[16px] border border-[rgba(208,213,221,1)] bg-[rgba(255,255,255,0.02)] rounded pl-4 h-[44px] w-[300px] sm:w-[520px] lg:w-[826px]  "
              placeholder="Enter your title"
            />
          </div>
          <div>
            <h1 htmlFor="des" className="text-[14px]  mb-1">
              Description
            </h1>
            <input
              type="text"
              className="text-[16px] border border-[rgba(208,213,221,1)] bg-[rgba(255,255,255,0.02)] rounded   px-4 h-[44px] min-w-[300px] sm:w-[520px] lg:w-[826px]  "
              placeholder="Enter your Description"
            />
          </div>
          <div>
            <h1 htmlFor="emil" className="text-[14px]  mb-1">
              Tags
            </h1>
            <input
              type="text"
              className="text-[16px] border border-[rgba(208,213,221,1)] bg-[rgba(255,255,255,0.02)] rounded  px-4 min-w-[300px] sm:w-[520px] lg:w-[826px]  h-[44px] "
              placeholder="Enter your Tags"
            />
          </div>
          <div className="flex flex-wrap gap-2 justify-center">
            <div>
              <h1 htmlFor="emil" className="text-[14px]  mb-1">
                Record voice
              </h1>
              <input
                type="text"
                className="text-[16px] border border-[rgba(208,213,221,1)] bg-[rgba(255,255,255,0.02)] rounded  px-4 w-[200px] h-[44px] lg:w-[192px]"
              />
            </div>
            <div>
              <h1 htmlFor="video" className="text-[14px]  mb-1">
                Video
              </h1>
              <input
                type="text"
                className="text-[16px] border border-[rgba(208,213,221,1)] bg-[rgba(255,255,255,0.02)] rounded  px-4 w-[200px] h-[44px] lg:w-[192px]"
              />
            </div>
          </div>
          <div>
            <h1 htmlFor="emil" className="text-[14px]">
              Files
            </h1>
            <input
              type="text"
              className="text-[16px] border border-[rgba(208,213,221,1)] bg-[rgba(255,255,255,0.02)] rounded  px-4 w-[200px] h-[44px] lg:w-[192px]"
              placeholder="Enter your Files"
            />
          </div>
        </form>
      </div>
      <div className="flex gap-1 pt-0 border-t border-[rgba(234,236,240,1)] min-w-[320px] max-w-[826px] justify-end px-2">
        <button className="mt-5 flex rounded-lg border border-[rgba(208,213,221,1)] px-4 py-[10px] text-[14px] text-[rgba(52, 64, 84, 1)] font-semibold">
          Cancel
          <img
            className="image ml-[5px] mt-[1px]"
            src="/images/arrow.png"
            alt=""
          />
        </button>
        <button className="mt-5 flex rounded-lg bg-[rgba(127,86,217,1)] border border-[rgba(127,86,217,1)] px-4 py-[10px] text-[14px] text-[rgba(255,255,255,1)] font-semibold shadow-sm shadow-[rgba(16,24,40,0.05)]">
          Save
          <img
            className="image ml-[5px] mt-[1px]"
            src="/images/arrow.png"
            alt=""
          />
        </button>
      </div>
    </div>
  );
}

export default NewJournal;

import React from "react";
import Empty from "./Empty";

function Sidebar() {
  return (
    <div className="flex flex-col w-[244px] gap-2 border-r">
      <div>
        <div className="flex justify-center mt-4">
          <div className="flex">
            <img src="../images/logo1.png" className="h-[29px]" alt="" />
            <img
              src="../images/logo2.png"
              alt=""
              className="object-contain -ml-[14px]  -mt-[14px]"
            />
          </div>
          <img
            src="../images/logo.png"
            className="ml-3 object-contain"
            alt=""
          />
          <img
            src="../images/slidebtn.png"
            className="object-contain ml-9  my-auto"
            alt=""
          />
        </div>
      </div>
      <div>
        <div className="flex flex-col w-[222px] mt-4 pb-1 mx-auto border-b border-[rgba(234,236,240,1)]">
          <div  className="flex items-center gap-3 w-[208px] mx-auto my-2">
            <img
              src="../images/icons/home.png"
              className="h-[24px] ml-1"
              alt=""
            />
            <h1 className="text-sm text-[rgba(52,64,84,1)] font-medium">
              Dashboard
            </h1>
          </div>
          <div className="flex items-center gap-3 w-[208px] mx-auto my-2">
            <img
              src="../images/icons/tasks.png"
              className="h-[24px] ml-1"
              alt=""
            />
            <h1 className="text-sm text-[rgba(52,64,84,1)] font-medium">
              Tasks
            </h1>
          </div>
          <div className="flex items-center gap-3 w-[208px] mx-auto my-2">
            <img
              src="../images/icons/goals.png"
              className="h-[24px] ml-1"
              alt=""
            />
            <h1 className="text-sm text-[rgba(52,64,84,1)] font-medium">
              Goals
            </h1>
          </div>
          <div className="flex items-center gap-3 w-[208px] mx-auto my-2">
            <img
              src="../images/icons/routine.png"
              className="h-[24px] ml-1"
              alt=""
            />
            <h1 className="text-sm text-[rgba(52,64,84,1)] font-medium">
              Routine
            </h1>
          </div>
          <div className="flex items-center gap-3 w-[208px] mx-auto my-2">
            <img
              src="../images/icons/journal1.png"
              className="h-[24px] ml-1"
              alt=""
            />
            <h1 className="text-sm text-[rgba(52,64,84,1)] font-medium">
              Journal
            </h1>
          </div>
          <div className="flex items-center gap-3 w-[208px] mx-auto my-2">
            <img
              src="../images/icons/ai.png"
              className="h-[24px] ml-1"
              alt=""
            />
            <h1 className="text-sm text-[rgba(52,64,84,1)] font-medium">
              AI Advisor
            </h1>
          </div>
        </div>

        <div className="flex flex-col  w-[222px] mx-auto mt-2 pb-1 border-b  border-[rgba(234,236,240,1)] ">
          <h1 className="text-sm text-[rgba(52,64,84,1)] font-medium mx">
            Shared
          </h1>
          <div className="flex items-center gap-3 w-[208px] mx-auto my-2">
            <img
              src="../images/icons/travel.png"
              className="h-[24px] ml-1"
              alt=""
            />
            <h1 className="text-sm text-[rgba(52,64,84,1)] font-medium">
              Travel
            </h1>
          </div>
        </div>

        <div className="flex flex-col  w-[222px] mx-auto mt-2 pb-1">
          <h1 className="text-sm text-[rgba(52,64,84,1)] font-medium mx">
            Private
          </h1>
          <div className="flex items-center gap-3 w-[208px] mx-auto rounded py-[6px] mt-2 mb-1 border border-[rgba(234,236,240,1)]">
            <img
              src="../images/icons/add-circle.png"
              className="h-[24px] ml-1"
              alt=""
            />
            <h1 className="text-sm text-[rgba(102,112,133,1)] font-medium">
              New page
            </h1>
          </div>
          <div className="flex items-center gap-3 w-[208px] mx-auto my-2">
            <img
              src="../images/icons/p-home.png"
              className="h-[24px] ml-1"
              alt=""
            />
            <h1 className="text-sm text-[rgba(52,64,84,1)] font-medium">
              Home
            </h1>
          </div>
          <div className="flex items-center gap-3 w-[208px] mx-auto my-2">
            <img
              src="../images/icons/family.png"
              className="h-[24px] ml-1"
              alt=""
            />
            <h1 className="text-sm text-[rgba(52,64,84,1)] font-medium">
              Family
            </h1>
          </div>
          <div className="flex items-center gap-3 w-[208px] mx-auto my-2">
            <img
              src="../images/icons/career.png"
              className="h-[24px] ml-1"
              alt=""
            />
            <h1 className="text-sm text-[rgba(52,64,84,1)] font-medium">
              Career
            </h1>
          </div>
          <div className="flex items-center gap-3 w-[208px] mx-auto my-2">
            <img
              src="../images/icons/sport.png"
              className="h-[24px] ml-1"
              alt=""
            />
            <h1 className="text-sm text-[rgba(52,64,84,1)] font-medium">
              Sport
            </h1>
          </div>
          <div className="flex items-center gap-3 w-[208px] mx-auto my-2">
            <img
              src="../images/icons/finance.png"
              className="h-[24px] ml-1"
              alt=""
            />
            <h1 className="text-sm text-[rgba(52,64,84,1)] font-medium">
              Finance
            </h1>
          </div>
          <div className="flex items-center gap-3 w-[208px] mx-auto my-2">
            <img
              src="../images/icons/travel.png"
              className="h-[24px] ml-1"
              alt=""
            />
            <h1 className="text-sm text-[rgba(52,64,84,1)] font-medium">
              Travel
            </h1>
          </div>
          <div className="flex items-center gap-3 w-[208px] mx-auto my-2">
            <img
              src="../images/icons/travel.png"
              className="h-[24px] ml-1"
              alt=""
            />
            <h1 className="text-sm text-[rgba(52,64,84,1)] font-medium">
              Travel
            </h1>
          </div>
          <div className="flex items-center gap-3 w-[208px] mx-auto my-2">
            <img
              src="../images/icons/travel.png"
              className="h-[24px] ml-1"
              alt=""
            />
            <h1 className="text-sm text-[rgba(52,64,84,1)] font-medium">
              Travel
            </h1>
          </div>
          <div className="flex items-center gap-3 w-[208px] mx-auto my-2">
            <img
              src="../images/icons/travel.png"
              className="h-[24px] ml-1"
              alt=""
            />
            <h1 className="text-sm text-[rgba(52,64,84,1)] font-medium">
              Travel
            </h1>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Sidebar;

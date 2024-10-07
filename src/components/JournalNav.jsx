import React, { useState } from "react";
import { Link } from "react-router-dom";

function JournalNav() {
  const [showSidebar, setShowSidebar] = useState(false);
  const [humBurger, setHumBurger] = useState(false);
  const toggle = () => {
    setShowSidebar(!showSidebar);
  };
  const toggleHum = () => {
    setHumBurger(!humBurger);
  };
  return (
    <div>
      <div className="flex gap-2 border-b sm:border-none pb-4 sm:pb-0">
        <div className="ml-3 flex flex-[3] ">
          <div className="flex justify-center mt-4 sm:hidden">
            <div className="flex">
              <img src="../images/icons/logo.png" className="h-[29px]" alt="" />
            </div>
            <img
              src="../images/logo.png"
              className="ml-3 object-contain"
              alt=""
            />
          </div>
        </div>
        <div className="flex gap-5 mr-3">
          <img
            src="../images/icons/search-lg.png"
            className="w-[20px] object-contain mt-[19px] sm:hidden "
            alt="Search"
          />
          <img
            src="../images/icons/notification.png"
            className="object-contain w-[22px] mt-[19px] sm:hidden"
            alt=""
          />
          <button onClick={toggleHum} className="mt-5 inline sm:hidden">
            <img
              src="/images/icons/humburger.png"
              alt=""
              className="w-[20px]"
            />
          </button>
        </div>

        {humBurger && (
          <div className="fixed inset-0  bg-gray-800 bg-opacity-75 z-50 flex justify-start sm:hidden">
            <div className="w-[244px] bg-white shadow-lg p-4 h-full overflow-y-auto sm:w-[0px]">
              <button onClick={toggleHum} className="text-right text-xl">
                ✖
              </button>
              <div className="flex flex-col mt-4">
                <div className="flex justify-center mt-4">
                  <div className="flex">
                    <img
                      src="../images/icons/logo.png"
                      className="h-[29px]"
                      alt=""
                    />
                  </div>
                  <img
                    src="../images/logo.png"
                    className="ml-3 object-contain"
                    alt=""
                  />
                  <img
                    src="../images/slidebtn.png"
                    className={`object-contain ml-9 my-auto cursor-pointer hidden sm:inline`}
                    alt=""
                    onClick={toggle}
                  />
                </div>
                <div className="flex flex-col w-[222px] mt-4 pb-1 mx-auto border-b border-[rgba(234,236,240,1)]">
                  <Link
                    to="/empty"
                    className="flex items-center gap-3 w-[208px] mx-auto my-1 py-2  hover:bg-[#f0f0f0] rounded"
                  >
                    <img
                      src="../images/icons/home.png"
                      className="h-[24px] ml-1"
                      alt=""
                    />
                    <h1 className="text-sm text-[rgba(52,64,84,1)] font-medium">
                      Dashboard
                    </h1>
                  </Link>
                  <Link
                    to="/empty"
                    className="flex items-center gap-3 w-[208px] mx-auto my-1 py-2  hover:bg-[#f0f0f0] rounded"
                  >
                    <img
                      src="../images/icons/tasks.png"
                      className="h-[24px] ml-1"
                      alt=""
                    />
                    <h1 className="text-sm text-[rgba(52,64,84,1)] font-medium">
                      Tasks
                    </h1>
                  </Link>
                  <Link
                    to="/empty"
                    className="flex items-center gap-3 w-[208px] mx-auto my-1 py-2  hover:bg-[#f0f0f0] rounded"
                  >
                    <img
                      src="../images/icons/goals.png"
                      className="h-[24px] ml-1"
                      alt=""
                    />
                    <h1 className="text-sm text-[rgba(52,64,84,1)] font-medium">
                      Goals
                    </h1>
                  </Link>
                  <Link
                    to="/empty"
                    className="flex items-center gap-3 w-[208px] mx-auto my-1 py-2  hover:bg-[#f0f0f0] rounded"
                  >
                    <img
                      src="../images/icons/routine.png"
                      className="h-[24px] ml-1"
                      alt=""
                    />
                    <h1 className="text-sm text-[rgba(52,64,84,1)] font-medium">
                      Routine
                    </h1>
                  </Link>
                  <Link
                    to="/journal"
                    className="flex items-center gap-3 w-[208px] mx-auto my-1 py-2  hover:bg-[#f0f0f0] rounded"
                  >
                    <img
                      src="../images/icons/journal1.png"
                      className="h-[24px] ml-1"
                      alt=""
                    />
                    <h1 className="text-sm text-[rgba(52,64,84,1)] font-medium">
                      Journal
                    </h1>
                  </Link>
                  <Link
                    to="/empty"
                    className="flex items-center gap-3 w-[208px] mx-auto my-1 py-2  hover:bg-[#f0f0f0] rounded"
                  >
                    <img
                      src="../images/icons/ai.png"
                      className="h-[24px] ml-1"
                      alt=""
                    />
                    <h1 className="text-sm text-[rgba(52,64,84,1)] font-medium">
                      AI Advisor
                    </h1>
                  </Link>
                </div>

                <div className="flex flex-col w-[222px] mx-auto mt-2 pb-1 border-b border-[rgba(234,236,240,1)]">
                  <h1 className="text-sm text-[rgba(52,64,84,1)] font-medium">
                    Shared
                  </h1>
                  <Link
                    to="/empty"
                    className="flex items-center gap-3 w-[208px] mx-auto my-1 py-2  hover:bg-[#f0f0f0] rounded"
                  >
                    <img
                      src="../images/icons/travel.png"
                      className="h-[24px] ml-1"
                      alt=""
                    />
                    <h1 className="text-sm text-[rgba(52,64,84,1)] font-medium">
                      Travel
                    </h1>
                  </Link>
                </div>

                <div className="flex flex-col w-[222px] mx-auto mt-2 pb-1">
                  <h1 className="text-sm text-[rgba(52,64,84,1)] font-medium">
                    Private
                  </h1>
                  <Link
                    to="/empty"
                    className="flex items-center gap-3 w-[208px] mx-auto rounded py-[6px] mt-2 mb-1 border border-[rgba(234,236,240,1)]"
                  >
                    <img
                      src="../images/icons/add-circle.png"
                      className="h-[24px] ml-1"
                      alt=""
                    />
                    <h1 className="text-sm text-[rgba(102,112,133,1)] font-medium">
                      New page
                    </h1>
                  </Link>
                  <Link
                    to="/empty"
                    className="flex items-center gap-3 w-[208px] mx-auto my-1 py-2  hover:bg-[#f0f0f0] rounded"
                  >
                    <img
                      src="../images/icons/p-home.png"
                      className="h-[24px] ml-1"
                      alt=""
                    />
                    <h1 className="text-sm text-[rgba(52,64,84,1)] font-medium">
                      Home
                    </h1>
                  </Link>
                  <Link
                    to="/empty"
                    className="flex items-center gap-3 w-[208px] mx-auto my-1 py-2  hover:bg-[#f0f0f0] rounded"
                  >
                    <img
                      src="../images/icons/family.png"
                      className="h-[24px] ml-1"
                      alt=""
                    />
                    <h1 className="text-sm text-[rgba(52,64,84,1)] font-medium">
                      Family
                    </h1>
                  </Link>
                  <Link
                    to="/empty"
                    className="flex items-center gap-3 w-[208px] mx-auto my-1 py-2  hover:bg-[#f0f0f0] rounded"
                  >
                    <img
                      src="../images/icons/career.png"
                      className="h-[24px] ml-1"
                      alt=""
                    />
                    <h1 className="text-sm text-[rgba(52,64,84,1)] font-medium">
                      Career
                    </h1>
                  </Link>
                  <Link
                    to="/empty"
                    className="flex items-center gap-3 w-[208px] mx-auto my-1 py-2  hover:bg-[#f0f0f0] rounded"
                  >
                    <img
                      src="../images/icons/sport.png"
                      className="h-[24px] ml-1"
                      alt=""
                    />
                    <h1 className="text-sm text-[rgba(52,64,84,1)] font-medium">
                      Sport
                    </h1>
                  </Link>
                  <Link
                    to="/empty"
                    className="flex items-center gap-3 w-[208px] mx-auto my-1 py-2  hover:bg-[#f0f0f0] rounded"
                  >
                    <img
                      src="../images/icons/finance.png"
                      className="h-[24px] ml-1"
                      alt=""
                    />
                    <h1 className="text-sm text-[rgba(52,64,84,1)] font-medium">
                      Finance
                    </h1>
                  </Link>
                  <Link
                    to="/empty"
                    className="flex items-center gap-3 w-[208px] mx-auto my-1 py-2  hover:bg-[#f0f0f0] rounded"
                  >
                    <img
                      src="../images/icons/travel.png"
                      className="h-[24px] ml-1"
                      alt=""
                    />
                    <h1 className="text-sm text-[rgba(52,64,84,1)] font-medium">
                      Travel
                    </h1>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      <div className=" justify-between gap-4  pl-2 mt-2 hidden sm:flex sm:w-[620px] lg:w-[1000px] mb-3">
        <div className="relative">
          <img
            src="../images/search.png"
            className="absolute top-[17px] left-3"
            alt=""
          />
          <input
            type="text"
            className=" w-[190px] sm:w-[320px] lg:w-[567px] px-[44px] py-[13px] rounded-xl border border-[rgba(234,236,240,1)] focus:outline-purple-600"
            placeholder="Search"
          />
          <img
            src="../images/Text.png"
            className="absolute top-[20px] right-4"
            alt=""
          />
        </div>
        <div className="flex flex-col justify-center">
          <div className="flex gap-3">
            <img
              src="../images/notification.png"
              className="object-scale-down sm:object-none"
              alt=""
            />
            <img
              src="../images/setting.png"
              className="object-scale-down sm:object-none"
              alt=""
            />
            <img
              src="../images/profile.png"
              className="object-scale-down sm:object-none"
              alt=""
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default JournalNav;

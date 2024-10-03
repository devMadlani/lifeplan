import React from "react";

function JournalNav() {
  return (
    <div className="flex justify-between gap-4 pl-2 mt-2 w-[310px] sm:w-[620px] lg:w-[1000px] mb-3">
      <div className="relative ">
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
  );
}

export default JournalNav;

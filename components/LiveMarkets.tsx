import React from "react";
import { BsArrowDown } from "react-icons/bs";
import { IoMdArrowDropdown, IoMdArrowDropup } from "react-icons/io";

const LiveMarkets = () => {
  return (
    <div className="w-full overflow-x-scroll flex items-stretch">
      <div className="px-2 py-3 bg-lime-500 flex items-center whitespace-nowrap text-preset color-neutral-900">
        • LIVE MARKETS
      </div>
      <div className="flex items-stretch">
        <div className="border px-2 py-3 border-r-neutral-500 bg-neutral-700 flex items-center">
          <IoMdArrowDropdown className="mr-0.5" color="#ff4141" />
          <span className="text-red-500 text-preset flex items-center">
            1.4%
          </span>
        </div>
        <div className="border px-2 py-3 border-r-neutral-500 bg-neutral-700 flex items-center text-preset gap-2">
          <span className="text-neutral-200">USD/JPY</span>
          <span className="text-neutral-50">157.91</span>
          <span className="flex items-center text-green-500">
            <IoMdArrowDropup /> +0.04%
          </span>
        </div>
         <div className="border px-2 py-3 border-r-neutral-500 bg-neutral-700 flex items-center text-preset gap-2">
          <span className="text-neutral-200">USD/JPY</span>
          <span className="text-neutral-50">157.91</span>
          <span className="flex items-center text-green-500">
            <IoMdArrowDropup /> +0.04%
          </span>
        </div>
      </div>
    </div>
  );
};

export default LiveMarkets;

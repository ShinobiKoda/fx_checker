'use client'

import React from "react";
import { IoMdArrowDropdown } from "react-icons/io";
import { HiArrowsUpDown } from "react-icons/hi2";
import { useRates } from "@/hooks/useRates";

const Converter = () => {

  return (
    <div className="space-y-4">
      <h2 className="text-[20px] font-normal text-neutral-50">
        CHECK THE RATE
      </h2>
      <div className="bg-neutral-700 rounded-[20px] p-4 space-y-4 flex flex-col items-center justify-center w-full">
        <div className="rounded-2xl p-4 bg-neutral-600 border border-neutral-500 space-y-5 w-full">
          <h4 className="text-neutral-100 font-normal text-sm">SEND</h4>
          <div className="flex items-center justify-between">
            <span className="font-bold text-[32px] text-neutral-50">1,000</span>
            <div className="p-[10px] rounded-[8px] bg-neutral-500 border border-neutral-400 flex items-center gap-[1.5px]">
              <div className="w-5 h-5 rounded-full">Flag</div>
              <span className="font-normal text-sm text-neutral-50">USD</span>
              <IoMdArrowDropdown className="text-neutral-50" />
            </div>
          </div>
        </div>
        <div className="w-[48px] h-[48px] rounded-[8px] bg-neutral-600 border border-neutral-500 flex items-center justify-center">
          <HiArrowsUpDown size={20} className="text-neutral-50" />
        </div>
        <div className="rounded-2xl p-4 bg-neutral-600 border border-neutral-500 space-y-5 w-full">
          <h4 className="text-neutral-100 font-normal text-sm">RECEIVE</h4>
          <div className="flex items-center justify-between">
            <span className="font-bold text-[32px] text-lime-500">1,000</span>
            <div className="p-[10px] rounded-[8px] bg-neutral-500 border border-neutral-400 flex items-center gap-[1.5px]">
              <div className="w-5 h-5 rounded-full">flag</div>
              <span className="font-normal text-sm text-neutral-50">USD</span>
              <IoMdArrowDropdown className="text-neutral-50" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Converter;

import React from "react";
import { MdOutlineArrowRightAlt } from "react-icons/md";
import { LuTrash } from "react-icons/lu";

const Log = () => {
  const logs = [
    {
      time: "20M",
      from: "EUR",
      to: "USD",
      value: 1000.0,
      convertedValue: 853.02,
    },
    {
      time: "20M",
      from: "EUR",
      to: "USD",
      value: 1000.0,
      convertedValue: 853.02,
    },
    {
      time: "20M",
      from: "EUR",
      to: "USD",
      value: 1000.0,
      convertedValue: 853.02,
    },
    {
      time: "20M",
      from: "EUR",
      to: "USD",
      value: 1000.0,
      convertedValue: 853.02,
    },
  ];

  return (
    <div className="w-full max-w-[1036px] mx-auto pb-8 md:pb-[48px] px-4">
      <div className="px-4 py-5 rounded-[16px] bg-neutral-700 border border-neutral-600">
        <div className="md:flex md:items-center md:justify-between">
          <h3 className="font-medium text-base text-neutral-50">
            CONVERSION LOG
          </h3>
          <div className="flex items-center justify-between md:justify-normal md:gap-4">
            <h5 className="font-normal text-[12px] text-neutral-50 opacity-70">
              8 LOGGED
            </h5>
            <button className="px-3 py-2 radius-sm bg-neutral-600 border border-neutral-400text-normal text-[12px] text-neutral-200">
              CLEAR ALL
            </button>
          </div>
        </div>
        <div className="space-y-3 mt-5">
          {logs.map((log, index) => (
            <div
              key={index}
              className="p-3 rounded-[10px] bg-neutral-600 border border-netural-500 flex items-center justify-between"
            >
              <div className="flex flex-col md:flex-row md:gap-5">
                <p className="font-sm font-normal text-neutral-200">
                  {log.time}
                </p>
                <p className="flex items-center font-normal text-sm text-neutral-50">
                  <span>{log.from}</span>
                  <MdOutlineArrowRightAlt className="text-neutral-200" />
                  <span>{log.to}</span>
                </p>
              </div>
              <div className="flex items-center gap-2.5">
                <p className="font-normal text-base flex flex-col">
                  <span className=" text-neutral-100 ">{log.value}</span>
                  <span className="text-lime-500">{log.convertedValue}</span>
                </p>
                <button className="flex items-center justify-center h-8 w-8 bg-neural-600 border border-neutral-500 cursor-pointer radius-sm">
                  <LuTrash />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Log;

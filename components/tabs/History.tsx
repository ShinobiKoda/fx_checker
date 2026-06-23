import { useState } from "react";
import { RiArrowDropUpFill } from "react-icons/ri";
import HistoryChart from "../HistoryChart";

const History = () => {
  const [activeDate, setActiveDate] = useState("1M");

  const HistoryData = [
    {
      title: "OPEN",
      value: 0.8516,
      change: false,
      perentageChange: false,
    },
    {
      title: "LAST",
      value: 0.8537,
      change: false,
      perentageChange: false,
    },
    {
      title: "CHANGE",
      value: 0.8516,
      change: true,
      perentageChange: false,
    },
    {
      title: "% CHANGE",
      value: 0.8516,
      change: true,
      perentageChange: true,
    },
  ];

  const datePicker = ["1D", "1W", "1M", "3M", "1Y", "5Y"];

  return (
    <div className="w-full">
      <div className="w-full grid grid-cols-2 gap-2.5 mt-4 px-4">
        {HistoryData.map((data, index) => (
          <div
            className="bg-neutral-700 border border-neutral-600 rounded-2xl px-5 py-3 gap-4"
            key={index}
          >
            <p className="font-normal text-sm text-neutral-50 opacity-70">{data.title}</p>
            <div
              className={`font-normal text-xl flex items-center ${data.change ? "text-green-500" : "text-neutral-50"}`}
            >
              {data.perentageChange ? <RiArrowDropUpFill size={28} /> : ""}
              <p>
                {data.change ? <span>+</span> : ""}
                {data.value}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="px-4 mt-[22px]">
        <div className="bg-neutral-700 border-sm flex items-center w-fit">
          {datePicker.map((date, index) => (
            <button
              className={` border-sm px-4 py-3 ${activeDate === date ? "bg-neutral-500" : ""}`}
              onClick={() => setActiveDate(date)}
              key={index}
            >
              {date}
            </button>
          ))}
        </div>
      </div>

      <div className="px-4 mt-4 pb-20">
        <div className="bg-neutral-700 border border-neutral-600 rounded-2xl px-3 py-4">
          <div className="w-full flex items-center justify-between">
            <p className="text-neutral-50 font-medium text-base">USD/EUR</p>
            <div className="font-normal text-[12px] opacity-70">
              <span>0.8530 • </span>
              <span>MAY 14 16:00 CET</span>
            </div>
          </div>
          <HistoryChart />
        </div>
      </div>
    </div>
  );
};

export default History;

"use client"

import React from "react";
import { MdOutlineArrowRightAlt } from "react-icons/md";
import { LuTrash } from "react-icons/lu";
import { useConversionLogs, useClearConversionLogs, useRemoveConversionLog } from "@/hooks/useConversionLog";
import { SlideInRow, StaggerContainer, ShimmerBlock, ErrorBanner } from "@/components/Motion";

import { getShortRelativeTime } from "@/lib/utils";

const Log = () => {
  const { data: logs, isLoading, isError, refetch } = useConversionLogs();
  const { mutate: clearLogs, isPending: isClearing } = useClearConversionLogs();
  const { mutate: removeLog } = useRemoveConversionLog();

  if (isLoading) {
    return (
      <div className="w-full max-w-[1036px] mx-auto pb-8 md:pb-[48px] px-4">
        <div className="px-4 py-5 rounded-[16px] bg-neutral-700 border border-neutral-600 space-y-4">
          <ShimmerBlock height="60px" rounded="10px" />
          <ShimmerBlock height="60px" rounded="10px" />
          <ShimmerBlock height="60px" rounded="10px" />
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="w-full max-w-[1036px] mx-auto pb-8 md:pb-[48px] px-4">
        <ErrorBanner message="Failed to load conversion logs" onRetry={refetch} />
      </div>
    );
  }

  if (!logs || logs.length === 0) {
    return (
      <div className="w-full px-4 max-w-[1036px] mx-auto pb-8 md:pb-[48px]">
        <div className="bg-neutral-700 border border-neutral-600 p-12 rounded-[16px] flex flex-col items-center justify-center text-center text-neutral-400">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="mb-4 opacity-50">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
            <polyline points="14 2 14 8 20 8" />
            <line x1="16" y1="13" x2="8" y2="13" />
            <line x1="16" y1="17" x2="8" y2="17" />
            <polyline points="10 9 9 9 8 9" />
          </svg>
          <p className="font-medium text-neutral-200">No logs yet</p>
          <p className="text-sm mt-1">Conversions you log will appear here.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-[1036px] mx-auto pb-8 md:pb-[48px] px-4">
      <div className="px-4 py-5 rounded-[16px] bg-neutral-700 border border-neutral-600">
        <div className="md:flex md:items-center md:justify-between">
          <h3 className="font-medium text-base text-neutral-50">
            CONVERSION LOG
          </h3>
          <div className="flex items-center justify-between md:justify-normal md:gap-4 mt-4 md:mt-0">
            <h5 className="font-normal text-[12px] text-neutral-50 opacity-70">
              {logs.length} LOGGED
            </h5>
            <button 
              onClick={() => clearLogs()}
              disabled={isClearing}
              className="px-3 py-2 radius-sm bg-neutral-600 border dark:border-neutral-400 border-neutral-300 font-normal text-[12px] text-neutral-200 hover:bg-neutral-500 transition-colors disabled:opacity-50"
            >
              CLEAR ALL
            </button>
          </div>
        </div>
        
        <StaggerContainer staggerDelay={0.05} className="space-y-3 mt-5">
          {logs.map((log) => (
            <SlideInRow key={log.id}>
              <div
                className="p-3 rounded-[10px] bg-neutral-600 border border-neutral-500 flex items-center justify-between group hover:bg-neutral-500/50 transition-colors"
              >
                <div className="flex flex-col md:flex-row md:gap-5 md:items-center">
                  <p className="text-sm font-normal text-neutral-200">
                    {getShortRelativeTime(log.created_at)}
                  </p>
                  <p className="flex items-center font-normal text-sm text-neutral-50 mt-1 md:mt-0">
                    <span>{log.from_currency}</span>
                    <MdOutlineArrowRightAlt className="text-neutral-200 mx-1" />
                    <span>{log.to_currency}</span>
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <p className="font-normal text-base flex flex-col items-end leading-tight">
                    <span className="text-neutral-100">
                      {log.amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </span>
                    <span className="dark:text-lime-500 text-lime-700 text-sm mt-0.5">
                      {log.converted_amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </span>
                  </p>
                  <button 
                    onClick={() => removeLog(log.id)}
                    className="flex items-center justify-center h-8 w-8 bg-neutral-600 border dark:border-neutral-500 border-neutral-300 cursor-pointer radius-sm text-neutral-400 hover:text-red-400 hover:bg-red-500/10 hover:border-red-500/30 transition-colors"
                    title="Delete log"
                  >
                    <LuTrash />
                  </button>
                </div>
              </div>
            </SlideInRow>
          ))}
        </StaggerContainer>
      </div>
    </div>
  );
};

export default Log;

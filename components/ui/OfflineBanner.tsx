import React from "react";
import { getShortRelativeTime } from "@/lib/utils";
import { MdOutlineWifiOff } from "react-icons/md";

interface OfflineBannerProps {
  cachedAt: string;
}

const OfflineBanner = ({ cachedAt }: OfflineBannerProps) => {
  return (
    <div className="w-full mb-4">
      <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-3 flex items-center gap-3 text-amber-500 text-sm">
        <MdOutlineWifiOff size={18} className="shrink-0" />
        <p>
          You appear to be offline. Showing cached rates from <span className="font-semibold">{getShortRelativeTime(cachedAt)}</span> ago.
        </p>
      </div>
    </div>
  );
};

export default OfflineBanner;

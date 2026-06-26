"use client";

import Image from "next/image";
import { useCurrencies } from "@/hooks/useCurrencies";
import { FadeIn, PulseDot, ShimmerBlock } from "./Motion";

const Header = () => {
  const { data: currencies, isLoading } = useCurrencies();

  const currencyCount = currencies ? Object.keys(currencies).length : null;

  return (
    <FadeIn duration={0.6}>
      <div className="w-full overflow-x-hidden p-4 flex items-center justify-between fixed top-0 left-0 z-50 backdrop-blur-[2px] bg-neutral-900/70 border-b border-white/5">
        <div>
          <Image
            src="/images/logo.svg"
            alt="Logo"
            width={120}
            height={100}
            style={{ width: "auto", height: "auto" }}
          />
        </div>
        <div className="text-neutral-200 font-normal text-[10px] md:text-sm flex items-center gap-2">
          {isLoading ? (
            <ShimmerBlock width="120px" height="14px" rounded="4px" />
          ) : (
            <>
              <PulseDot color="bg-lime-500" size={8} />
              <span>{currencyCount ?? "—"} CURR.</span> •<span> EOD</span> •
              <span> ECB DATA</span>
            </>
          )}
        </div>
      </div>
    </FadeIn>
  );
};

export default Header;

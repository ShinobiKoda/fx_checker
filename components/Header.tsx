"use client";

import Image from "next/image";
import { useCurrencies } from "@/hooks/useCurrencies";
import { FadeIn, PulseDot, ShimmerBlock } from "./Motion";
import UserMenu from "./auth/UserMenu";

interface HeaderProps {
  onOpenAuth: () => void;
}

const Header = ({ onOpenAuth }: HeaderProps) => {
  const { data: currencies, isLoading } = useCurrencies();

  const currencyCount = currencies ? Object.keys(currencies).length : null;

  return (
    <FadeIn duration={0.6}>
      <div className="w-full p-4 flex items-center justify-between fixed top-0 left-0 z-50 backdrop-blur-sm bg-neutral-900/70 border-b border-white/5">
        <div>
          <Image
            src="/images/logo.svg"
            alt="Logo"
            width={120}
            height={100}
            style={{ width: "auto", height: "auto" }}
            className="dark:invert-0 invert"
          />
        </div>
        <div className="flex items-center gap-2 md:gap-4">
          <div className="text-neutral-200 font-normal text-[10px] md:text-sm flex items-center gap-2">
            {isLoading ? (
              <ShimmerBlock width="60px" height="14px" rounded="4px" className="md:hidden" />
            ) : (
              <>
                <PulseDot color="bg-lime-500" size={8} />
                <span className="hidden md:inline">{currencyCount ?? "—"} CURR. • EOD • ECB DATA</span>
                <span className="md:hidden">{currencyCount ?? "—"} CURR.</span>
              </>
            )}
          </div>
          <UserMenu onOpenAuth={onOpenAuth} />
        </div>
      </div>
    </FadeIn>
  );
};

export default Header;

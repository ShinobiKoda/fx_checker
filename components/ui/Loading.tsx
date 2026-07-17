import React from "react";

type Props = {
  size?: number;
  text?: string;
  className?: string;
};

export default function Loading({
  size = 30,
  text = "FX CHECKER",
  className = "",
}: Props) {
  return (
    <div
      role="status"
      aria-live="polite"
      className={`bg-white dark:bg-neutral-950 min-h-screen flex flex-col items-center justify-center overflow-hidden relative ${className}`}
    >
      <div className="loader" data-text={text}></div>
      <style dangerouslySetInnerHTML={{ __html: `
        .loader {
          --loader-box: #000;
          --loader-text-in-box: #fff;
          --loader-text-out-box: #000;
          
          width: fit-content;
          font-weight: bold;
          font-family: monospace;
          font-size: ${size}px;
          background: linear-gradient(90deg, var(--loader-box) 50%, #0000 0) right/200% 100%;
          animation: l21 2s linear forwards;
        }
        
        .dark .loader {
          --loader-box: #a3e635; /* tailwind lime-400 */
          --loader-text-in-box: #000;
          --loader-text-out-box: #a3e635;
        }

        @media (prefers-color-scheme: dark) {
          html:not(.light) .loader {
            --loader-box: #a3e635;
            --loader-text-in-box: #000;
            --loader-text-out-box: #a3e635;
          }
        }

        .loader::before {
          content: attr(data-text);
          color: #0000;
          padding: 0 5px;
          background: inherit;
          background-image: linear-gradient(90deg, var(--loader-text-in-box) 50%, var(--loader-text-out-box) 0);
          -webkit-background-clip: text;
                  background-clip: text;
        }

        @keyframes l21 {
          100% { background-position: left; }
        }
      `}} />
    </div>
  );
}

import { motion } from "framer-motion";

type Props = {
  size?: number;
  text?: string;
  className?: string;
};

export default function Loading({
  size = 64,
  text = "FX CHECKER",
  className = "",
}: Props) {
  return (
    <div
      role="status"
      aria-live="polite"
      className={`bg-neutral-950 min-h-screen flex flex-col items-center justify-center overflow-hidden relative ${className}`}
    >
      {/* Cyberpunk grid background */}
      <div className="absolute inset-0 z-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-size-[32px_32px] opacity-40"></div>

      <div className="z-10 flex flex-col items-center gap-10 relative">
        {/* Animated Cyber Shape */}
        <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
          {/* Outer glow rotating */}
          <motion.div
            className="absolute inset-[-30%] rounded-full opacity-30 blur-2xl"
            style={{
              background: "conic-gradient(from 0deg, #0ff, #f0f, #0ff)",
            }}
            animate={{ rotate: 360 }}
            transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
          />

          {/* Hexagon wireframe */}
          <motion.svg
            width={size}
            height={size}
            viewBox="0 0 100 100"
            className="absolute text-cyan-400"
            style={{ filter: "drop-shadow(0 0 6px currentColor)" }}
            animate={{ rotate: -360, scale: [1, 1.05, 1] }}
            transition={{ 
              rotate: { duration: 10, repeat: Infinity, ease: "linear" },
              scale: { duration: 2, repeat: Infinity, ease: "easeInOut" }
            }}
          >
            <polygon 
              points="50,5 93,27 93,73 50,95 7,73 7,27" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2"
              strokeDasharray="15 10"
            />
          </motion.svg>

          {/* Inner triangle */}
          <motion.svg
            width={size * 0.6}
            height={size * 0.6}
            viewBox="0 0 100 100"
            className="absolute text-fuchsia-500"
            style={{ filter: "drop-shadow(0 0 8px currentColor)" }}
            animate={{ rotate: 360 }}
            transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
          >
            <polygon 
              points="50,15 90,85 10,85" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="4" 
            />
          </motion.svg>

          {/* Core dot */}
          <motion.div
            className="absolute bg-white rounded-full"
            style={{ width: size * 0.15, height: size * 0.15, filter: "drop-shadow(0 0 8px white)" }}
            animate={{ scale: [1, 2.5, 1], opacity: [0.6, 1, 0.6] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          />
        </div>

        {/* Glitch Text */}
        <div className="relative group mt-4">
          <motion.span 
            className="block text-2xl font-black tracking-[0.3em] text-transparent bg-clip-text bg-linear-to-r from-cyan-400 to-fuchsia-500 uppercase"
            style={{ filter: "drop-shadow(0 0 4px rgba(0,255,255,0.4))" }}
            animate={{ opacity: [1, 0.8, 1, 0.6, 1] }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear", times: [0, 0.2, 0.4, 0.5, 1] }}
          >
            {text}
          </motion.span>
          <motion.span 
            className="absolute top-0 left-[2px] block text-2xl font-black tracking-[0.3em] text-cyan-400 opacity-70 uppercase mix-blend-screen pointer-events-none"
            animate={{ x: [-2, 2, -2], y: [1, -1, 1], opacity: [0, 0.7, 0] }}
            transition={{ duration: 0.15, repeat: Infinity, repeatType: "mirror" }}
          >
            {text}
          </motion.span>
          <motion.span 
            className="absolute top-0 left-[-2px] block text-2xl font-black tracking-[0.3em] text-fuchsia-500 opacity-70 uppercase mix-blend-screen pointer-events-none"
            animate={{ x: [2, -2, 2], y: [-1, 1, -1], opacity: [0, 0.7, 0] }}
            transition={{ duration: 0.25, repeat: Infinity, repeatType: "mirror" }}
          >
            {text}
          </motion.span>
        </div>
      </div>
    </div>
  );
}

"use client";

import React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { IoMdClose } from "react-icons/io";

interface ShortcutsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const shortcuts = [
  { key: "/", label: "Focus amount input" },
  { key: "S", label: "Swap currencies" },
  { key: "X", label: "Clear amount" },
  { key: "R", label: "Toggle reverse mode" },
  { key: "?", label: "Toggle this modal" },
];

const ShortcutsModal = ({ isOpen, onClose }: ShortcutsModalProps) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-100"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.div
            className="fixed top-1/2 left-1/2 z-101 w-[90%] max-w-[400px] -translate-x-1/2 -translate-y-1/2"
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
          >
            <div className="bg-neutral-700 border border-neutral-500 rounded-[16px] p-6 shadow-2xl">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-neutral-50 font-medium text-base">KEYBOARD SHORTCUTS</h3>
                <button
                  onClick={onClose}
                  className="w-8 h-8 flex items-center justify-center rounded-full border border-neutral-500 text-neutral-400 hover:text-neutral-50 hover:bg-neutral-600 transition-colors"
                >
                  <IoMdClose size={16} />
                </button>
              </div>

              <div className="space-y-3">
                {shortcuts.map(({ key, label }) => (
                  <div
                    key={key}
                    className="flex items-center justify-between py-2 border-b border-neutral-600 last:border-0"
                  >
                    <span className="text-sm text-neutral-200">{label}</span>
                    <kbd className="px-2.5 py-1 rounded-md bg-neutral-600 border border-neutral-500 text-neutral-50 text-xs font-mono font-medium min-w-[32px] text-center">
                      {key}
                    </kbd>
                  </div>
                ))}
              </div>

              <p className="text-[11px] text-neutral-400 mt-5 text-center">
                Shortcuts are disabled when typing in an input field.
              </p>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default ShortcutsModal;

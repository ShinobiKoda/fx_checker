"use client";

import React, { useRef, useEffect } from "react";
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
  { key: "1-6", label: "Switch chart range (1D-5Y)" },
  { key: "?", label: "Toggle this modal" },
];

const ShortcutsModal = ({ isOpen, onClose }: ShortcutsModalProps) => {
  const modalRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!isOpen) return;
    const previous = document.activeElement as HTMLElement | null;
    const node = modalRef.current;
    const focusableSelector =
      'a[href], area[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), [tabindex]:not([tabindex="-1"])';
    const focusable = node
      ? Array.from(node.querySelectorAll<HTMLElement>(focusableSelector))
      : [];
    focusable[0]?.focus();

    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
        return;
      }
      if (e.key === "Tab" && focusable.length) {
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };

    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("keydown", handleKey);
      previous?.focus();
    };
  }, [isOpen, onClose]);

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
            className="fixed top-1/2 left-1/2 z-101 w-[90%] max-w-100 -translate-x-1/2 -translate-y-1/2"
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
          >
            <div
              ref={modalRef}
              role="dialog"
              aria-modal="true"
              aria-labelledby="shortcuts-title"
              className="bg-neutral-700 border border-neutral-500 rounded-[16px] p-6 shadow-2xl"
            >
              <div className="flex items-center justify-between mb-6">
                <h3
                  id="shortcuts-title"
                  className="text-neutral-50 font-medium text-base"
                >
                  KEYBOARD SHORTCUTS
                </h3>
                <button
                  onClick={onClose}
                  aria-label="Close shortcuts dialog"
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
                    <kbd className="px-2.5 py-1 rounded-md bg-neutral-600 border border-neutral-500 text-neutral-50 text-xs font-mono font-medium min-w-8 text-center">
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

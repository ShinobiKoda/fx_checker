"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { IoMdClose } from "react-icons/io";
import { FiCopy, FiCheck } from "react-icons/fi";

interface EmbedModalProps {
  isOpen: boolean;
  onClose: () => void;
  fromCurrency: string;
  toCurrency: string;
  amount: string;
}

const EmbedModal = ({ isOpen, onClose, fromCurrency, toCurrency, amount }: EmbedModalProps) => {
  const [copied, setCopied] = useState(false);
  const [origin, setOrigin] = useState("https://fxchecker.com");

  useEffect(() => {
    if (typeof window !== "undefined") {
      setOrigin(window.location.origin);
    }
  }, []);

  const embedUrl = `${origin}/embed?from=${fromCurrency}&to=${toCurrency}&amount=${amount}`;
  const embedCode = `<iframe src="${embedUrl}" width="300" height="240" style="border:none; border-radius:12px; overflow:hidden;" allowtransparency="true"></iframe>`;

  const handleCopy = () => {
    navigator.clipboard.writeText(embedCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-100"
          />
          <div className="fixed inset-0 pointer-events-none z-101 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="bg-neutral-800 border border-neutral-700 p-6 radius-sm w-full max-w-md shadow-2xl pointer-events-auto relative"
            >
              <button
                onClick={onClose}
                className="absolute top-4 right-4 text-neutral-400 hover:text-neutral-50 transition-colors"
              >
                <IoMdClose size={24} />
              </button>

              <h2 className="text-xl font-medium text-neutral-50 mb-2">Embed Widget</h2>
              <p className="text-sm text-neutral-400 mb-6">
                Add this currency converter to your website. It's free and always up-to-date.
              </p>

              <div className="space-y-4">
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-medium text-neutral-300">Widget Preview</label>
                  <div className="border border-neutral-700 rounded-xl overflow-hidden bg-neutral-900 w-[300px] h-[240px] mx-auto shadow-inner flex items-center justify-center">
                    <iframe 
                      src={embedUrl} 
                      width="300" 
                      height="240" 
                      style={{ border: "none" }}
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-2 pt-4 border-t border-neutral-700">
                  <label className="text-xs font-medium text-neutral-300">Embed Code</label>
                  <div className="relative">
                    <textarea
                      readOnly
                      value={embedCode}
                      className="w-full h-24 bg-neutral-900 border border-neutral-700 rounded-lg p-3 text-xs text-neutral-300 font-mono resize-none outline-none focus:border-lime-500 transition-colors"
                    />
                    <button
                      onClick={handleCopy}
                      className="absolute bottom-3 right-3 bg-neutral-700 hover:bg-neutral-600 text-neutral-50 p-2 rounded-md border border-neutral-600 transition-colors flex items-center gap-1.5 shadow-md"
                    >
                      {copied ? <FiCheck className="text-lime-500" /> : <FiCopy />}
                      <span className="text-[10px] font-medium">{copied ? "COPIED!" : "COPY"}</span>
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
};

export default EmbedModal;

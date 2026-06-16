'use client'

import { motion } from 'framer-motion'
import React from 'react'

export const InfiniteSlider = ({ children, speed = 30 }: { children: React.ReactNode, speed?: number }) => {
  return (
    <div className="flex overflow-hidden w-full items-stretch relative">
      <motion.div
        className="flex items-stretch w-max"
        animate={{ x: ["0%", "-50%"] }}
        transition={{ 
          repeat: Infinity, 
          ease: "linear", 
          duration: speed 
        }}
      >
        {children}
        {children}
      </motion.div>
    </div>
  )
}

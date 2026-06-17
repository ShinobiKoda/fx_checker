'use client'

import { motion } from 'framer-motion'
import React, { useEffect, useRef, useState } from 'react'

export const InfiniteSlider = ({
  children,
  speed = 40,
}: {
  children: React.ReactNode
  speed?: number
}) => {
  const innerRef = useRef<HTMLDivElement>(null)
  const [duration, setDuration] = useState<number | null>(null)

  useEffect(() => {
    const el = innerRef.current
    if (!el) return

    const measure = () => {
      const oneCopyWidth = el.scrollWidth / 2
      if (oneCopyWidth > 0) {
        setDuration(oneCopyWidth / speed)
      }
    }

    measure()
    const observer = new ResizeObserver(measure)
    observer.observe(el)
    return () => observer.disconnect()
  }, [speed])

  return (
    <div className="flex overflow-hidden w-full items-stretch relative flex-1">
      <motion.div
        // key forces Framer Motion to fully remount + restart with the correct duration
        key={duration ?? 'measuring'}
        ref={innerRef}
        className="flex items-stretch w-max"
        animate={duration ? { x: ['0%', '-50%'] } : undefined}
        initial={false}
        transition={{
          repeat: Infinity,
          ease: 'linear',
          duration: duration ?? 0,
        }}
        style={{ opacity: duration ? 1 : 0 }} // hide until we know real duration, avoids a flash of the wrong speed
      >
        <div className="flex items-stretch h-full">{children}</div>
        <div className="flex items-stretch h-full">{children}</div>
      </motion.div>
    </div>
  )
}
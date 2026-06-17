'use client'

import { motion, AnimatePresence } from 'framer-motion'
import React, { useEffect, useRef, useState } from 'react'

// ─── Infinite Slider (existing) ─────────────────────────────────────────────

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
        style={{ opacity: duration ? 1 : 0 }}
      >
        <div className="flex items-stretch h-full">{children}</div>
        <div className="flex items-stretch h-full">{children}</div>
      </motion.div>
    </div>
  )
}

// ─── Fade In ────────────────────────────────────────────────────────────────

export const FadeIn = ({
  children,
  delay = 0,
  duration = 0.5,
  className = '',
}: {
  children: React.ReactNode
  delay?: number
  duration?: number
  className?: string
}) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ delay, duration, ease: 'easeOut' }}
    className={className}
  >
    {children}
  </motion.div>
)

// ─── Slide Up ───────────────────────────────────────────────────────────────

export const SlideUp = ({
  children,
  delay = 0,
  duration = 0.6,
  className = '',
  distance = 30,
}: {
  children: React.ReactNode
  delay?: number
  duration?: number
  className?: string
  distance?: number
}) => (
  <motion.div
    initial={{ opacity: 0, y: distance }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay, duration, ease: [0.25, 0.46, 0.45, 0.94] }}
    className={className}
  >
    {children}
  </motion.div>
)

// ─── Scale In ───────────────────────────────────────────────────────────────

export const ScaleIn = ({
  children,
  delay = 0,
  duration = 0.4,
  className = '',
}: {
  children: React.ReactNode
  delay?: number
  duration?: number
  className?: string
}) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.85 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ delay, duration, ease: [0.34, 1.56, 0.64, 1] }}
    className={className}
  >
    {children}
  </motion.div>
)

// ─── Stagger Container ─────────────────────────────────────────────────────

export const StaggerContainer = ({
  children,
  staggerDelay = 0.08,
  className = '',
}: {
  children: React.ReactNode
  staggerDelay?: number
  className?: string
}) => (
  <motion.div
    initial="hidden"
    animate="visible"
    variants={{
      visible: {
        transition: {
          staggerChildren: staggerDelay,
        },
      },
    }}
    className={className}
  >
    {children}
  </motion.div>
)

export const StaggerItem = ({
  children,
  className = '',
}: {
  children: React.ReactNode
  className?: string
}) => (
  <motion.div
    variants={{
      hidden: { opacity: 0, y: 20 },
      visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
    }}
    className={className}
  >
    {children}
  </motion.div>
)

// ─── Skeleton Loader ────────────────────────────────────────────────────────

export const Skeleton = ({
  width = '100%',
  height = '1rem',
  rounded = '8px',
  className = '',
}: {
  width?: string
  height?: string
  rounded?: string
  className?: string
}) => (
  <div
    className={`animate-pulse bg-neutral-600 ${className}`}
    style={{ width, height, borderRadius: rounded }}
  />
)

// ─── Shimmer Block (richer skeleton) ────────────────────────────────────────

export const ShimmerBlock = ({
  width = '100%',
  height = '1rem',
  rounded = '8px',
  className = '',
}: {
  width?: string
  height?: string
  rounded?: string
  className?: string
}) => (
  <div
    className={`relative overflow-hidden bg-neutral-600 ${className}`}
    style={{ width, height, borderRadius: rounded }}
  >
    <motion.div
      className="absolute inset-0"
      style={{
        background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.06), transparent)',
      }}
      animate={{ x: ['-100%', '100%'] }}
      transition={{
        repeat: Infinity,
        duration: 1.5,
        ease: 'easeInOut',
      }}
    />
  </div>
)

// ─── Spinner ────────────────────────────────────────────────────────────────

export const Spinner = ({
  size = 20,
  color = 'text-neutral-50',
  className = '',
}: {
  size?: number
  color?: string
  className?: string
}) => (
  <motion.div
    className={`${color} ${className}`}
    animate={{ rotate: 360 }}
    transition={{ repeat: Infinity, duration: 0.8, ease: 'linear' }}
    style={{ width: size, height: size }}
  >
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" opacity="0.25" />
      <path
        d="M12 2a10 10 0 0 1 10 10"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
      />
    </svg>
  </motion.div>
)

// ─── Swap Button Animated ───────────────────────────────────────────────────

export const SwapButton = ({
  onClick,
  isLoading = false,
  className = '',
}: {
  onClick: () => void
  isLoading?: boolean
  className?: string
}) => (
  <motion.button
    onClick={onClick}
    disabled={isLoading}
    className={`w-[48px] h-[48px] rounded-[8px] bg-neutral-600 border border-neutral-500 flex items-center justify-center hover:bg-neutral-500 transition-colors ${className}`}
    whileHover={{ scale: 1.1 }}
    whileTap={{ scale: 0.9, rotate: 180 }}
    transition={{ type: 'spring', stiffness: 300, damping: 20 }}
  >
    <AnimatePresence mode="wait">
      {isLoading ? (
        <motion.div
          key="spinner"
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.5 }}
        >
          <Spinner size={20} color="text-lime-500" />
        </motion.div>
      ) : (
        <motion.div
          key="icon"
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.5 }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-neutral-50">
            <path d="M7 16V4m0 0L3 8m4-4l4 4M17 8v12m0 0l4-4m-4 4l-4-4" />
          </svg>
        </motion.div>
      )}
    </AnimatePresence>
  </motion.button>
)

// ─── Error Banner ───────────────────────────────────────────────────────────

export const ErrorBanner = ({
  message,
  onRetry,
  className = '',
}: {
  message: string
  onRetry?: () => void
  className?: string
}) => (
  <motion.div
    initial={{ opacity: 0, y: -10, height: 0 }}
    animate={{ opacity: 1, y: 0, height: 'auto' }}
    exit={{ opacity: 0, y: -10, height: 0 }}
    transition={{ duration: 0.3 }}
    className={`bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-3 flex items-center justify-between gap-3 ${className}`}
  >
    <div className="flex items-center gap-2">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-red-400 shrink-0">
        <circle cx="12" cy="12" r="10" />
        <line x1="12" y1="8" x2="12" y2="12" />
        <line x1="12" y1="16" x2="12.01" y2="16" />
      </svg>
      <span className="text-red-400 text-sm">{message}</span>
    </div>
    {onRetry && (
      <motion.button
        onClick={onRetry}
        className="text-xs text-red-300 border border-red-500/30 rounded-lg px-3 py-1 hover:bg-red-500/20 transition-colors whitespace-nowrap"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        Retry
      </motion.button>
    )}
  </motion.div>
)

// ─── Pulse Dot (live indicator) ─────────────────────────────────────────────

export const PulseDot = ({
  color = 'bg-lime-500',
  size = 8,
}: {
  color?: string
  size?: number
}) => (
  <span className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
    <motion.span
      className={`absolute inline-flex rounded-full ${color} opacity-75`}
      style={{ width: size, height: size }}
      animate={{ scale: [1, 1.8, 1], opacity: [0.75, 0, 0.75] }}
      transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
    />
    <span className={`relative inline-flex rounded-full ${color}`} style={{ width: size * 0.6, height: size * 0.6 }} />
  </span>
)
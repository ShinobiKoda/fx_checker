'use client'

import React, { useState, useEffect } from 'react'
import { SlideUp } from '@/components/Motion'
import { IoClose } from 'react-icons/io5'
import { useAuth } from '@/hooks/useAuth'

interface AuthBannerProps {
  onOpenAuth: () => void
}

const AuthBanner = ({ onOpenAuth }: AuthBannerProps) => {
  const { isAuthenticated, isLoading } = useAuth()
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    // Only show if we've finished checking auth and they aren't logged in
    // and they haven't dismissed it this session
    if (!isLoading && !isAuthenticated) {
      const dismissed = sessionStorage.getItem('auth_banner_dismissed')
      if (!dismissed) {
        setIsVisible(true)
      }
    } else {
      setIsVisible(false)
    }
  }, [isAuthenticated, isLoading])

  if (!isVisible) return null

  const handleDismiss = () => {
    setIsVisible(false)
    sessionStorage.setItem('auth_banner_dismissed', 'true')
  }

  return (
    <SlideUp duration={0.5} distance={20} className="w-full px-4 max-w-[1036px] mx-auto mb-6 mt-4">
      <div className="bg-neutral-700 border border-neutral-500 radius-sm p-4 flex flex-col md:flex-row items-center justify-between gap-4 relative">
        <button
          onClick={handleDismiss}
          className="absolute top-2 right-2 text-neutral-400 hover:text-neutral-50 p-1 md:hidden"
        >
          <IoClose size={18} />
        </button>
        
        <div className="flex-1">
          <h3 className="text-neutral-50 font-medium text-sm md:text-base">Save your conversions & favorites</h3>
          <p className="text-neutral-200 text-[12px] md:text-sm mt-1">
            Log in to sync your data across devices and keep a permanent history of your exchanges.
          </p>
        </div>
        
        <div className="flex items-center gap-3 w-full md:w-auto shrink-0">
          <button
            onClick={onOpenAuth}
            className="w-full md:w-auto bg-lime-500 text-black font-medium text-sm px-5 py-2.5 radius-sm hover:bg-lime-400 transition-colors"
          >
            Log In or Sign Up
          </button>
          <button
            onClick={handleDismiss}
            className="hidden md:flex text-neutral-400 hover:text-neutral-50 transition-colors p-2"
            title="Dismiss"
          >
            <IoClose size={20} />
          </button>
        </div>
      </div>
    </SlideUp>
  )
}

export default AuthBanner

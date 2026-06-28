'use client'

import React, { useState, useRef, useEffect } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { DropdownMenu } from '@/components/Motion'
import { FaUserCircle } from 'react-icons/fa'
import { IoLogOutOutline } from 'react-icons/io5'
import { useTheme } from 'next-themes'
import { Sun, Moon } from 'lucide-react'

interface UserMenuProps {
  onOpenAuth: () => void
}

const UserMenu = ({ onOpenAuth }: UserMenuProps) => {
  const { user, isAuthenticated, isLoading, signOut } = useAuth()
  const [isOpen, setIsOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)
  const { theme, setTheme } = useTheme()

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  if (isLoading) {
    return <div className="w-8 h-8 rounded-full bg-neutral-600 animate-pulse shrink-0" />
  }

  if (!isAuthenticated || !user) {
    return (
      <button
        onClick={onOpenAuth}
        className="text-xs md:text-sm font-medium text-black bg-lime-500 px-3 py-1.5 radius-sm hover:bg-lime-400 transition-colors shrink-0"
      >
        Log In
      </button>
    )
  }

  const username = user.user_metadata?.username || 'User'
  const initials = username.substring(0, 2).toUpperCase()

  return (
    <div className="relative shrink-0" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-8 h-8 rounded-full bg-lime-500 text-black flex items-center justify-center font-medium text-xs hover:bg-lime-400 transition-colors border border-lime-600 focus:outline-none focus:ring-2 focus:ring-lime-500/50 cursor-pointer"
      >
        {initials}
      </button>

      <DropdownMenu isOpen={isOpen} className="absolute top-full right-0 mt-2 w-56 bg-neutral-700 border border-neutral-500 radius-sm shadow-xl p-2 z-60">
        <div className="px-3 py-2 border-b border-neutral-600 mb-2">
          <p className="font-medium text-neutral-50 text-sm truncate">{username}</p>
          <p className="text-neutral-400 text-xs truncate mt-0.5">{user.email}</p>
        </div>
        
        <button
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          className="w-full flex items-center gap-2 px-3 py-2 text-sm text-neutral-200 hover:text-neutral-50 hover:bg-neutral-600 radius-sm transition-colors text-left cursor-pointer mb-1"
        >
          {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          <span>{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>
        </button>
        
        <button
          onClick={() => {
            setIsOpen(false)
            signOut()
          }}
          className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 radius-sm transition-colors text-left cursor-pointer"
        >
          <IoLogOutOutline size={18} />
          <span>Log Out</span>
        </button>
      </DropdownMenu>
    </div>
  )
}

export default UserMenu

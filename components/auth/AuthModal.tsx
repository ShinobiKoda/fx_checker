'use client'

import React, { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { IoClose } from 'react-icons/io5'
import { useAuth } from '@/hooks/useAuth'
import { Spinner, ErrorBanner, ActivePill } from '@/components/Motion'

interface AuthModalProps {
  isOpen: boolean
  onClose: () => void
}

const AuthModal = ({ isOpen, onClose }: AuthModalProps) => {
  const [tab, setTab] = useState<'login' | 'signup'>('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [username, setUsername] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const { supabase } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      if (tab === 'signup') {
        const { error: signUpError } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { username },
          },
        })
        if (signUpError) throw signUpError
        
        // Send welcome email asynchronously
        fetch('/api/send-welcome', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, firstName: username })
        }).catch(console.error)
      } else {
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password,
        })
        if (signInError) throw signInError
      }
      
      // If successful, reset and close
      setEmail('')
      setPassword('')
      setUsername('')
      onClose()
    } catch (err: any) {
      setError(err.message || 'An error occurred during authentication')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-60 bg-neutral-900/80 backdrop-blur-sm flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ type: 'spring', stiffness: 300, damping: 25 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-neutral-700 border border-neutral-500 radius-sm p-6 w-full max-w-md shadow-2xl relative"
            >
              <button
                onClick={onClose}
                className="absolute top-4 right-4 text-neutral-400 hover:text-neutral-50 transition-colors cursor-pointer"
              >
                <IoClose size={24} />
              </button>

              <h2 className="text-xl font-medium text-neutral-50 mb-6">
                Welcome to FX Checker
              </h2>

              <div className="flex items-center gap-2 mb-6 p-1 bg-neutral-600 rounded-[10px] w-full">
                {['login', 'signup'].map((t) => {
                  const isActive = tab === t
                  return (
                    <button
                      key={t}
                      onClick={() => {
                        setTab(t as 'login' | 'signup')
                        setError('')
                      }}
                      className={`relative flex-1 py-2 text-sm font-medium transition-colors z-10 cursor-pointer ${
                        isActive ? 'text-neutral-50' : 'text-neutral-400 hover:text-neutral-200'
                      }`}
                    >
                      {isActive && <ActivePill layoutId="auth-tabs" className="rounded-md" />}
                      <span className="relative z-10">
                        {t === 'login' ? 'Log In' : 'Sign Up'}
                      </span>
                    </button>
                  )
                })}
              </div>

              <AnimatePresence mode="wait">
                {error && (
                  <motion.div
                    key="error"
                    initial={{ opacity: 0, height: 0, marginBottom: 0 }}
                    animate={{ opacity: 1, height: 'auto', marginBottom: 16 }}
                    exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                  >
                    <ErrorBanner message={error} />
                  </motion.div>
                )}
              </AnimatePresence>

              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <AnimatePresence mode="sync">
                  {tab === 'signup' && (
                    <motion.div
                      initial={{ opacity: 0, height: 0, overflow: 'hidden' }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0, overflow: 'hidden' }}
                    >
                      <label className="block text-sm text-neutral-200 mb-1">
                        Username
                      </label>
                      <input
                        type="text"
                        required
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="w-full bg-neutral-600 border border-neutral-500 radius-sm px-4 py-3 text-neutral-50 outline-none focus:border-lime-500 transition-colors placeholder:text-neutral-400"
                        placeholder="Choose a username"
                      />
                    </motion.div>
                  )}
                </AnimatePresence>

                <div>
                  <label className="block text-sm text-neutral-200 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-neutral-600 border border-neutral-500 radius-sm px-4 py-3 text-neutral-50 outline-none focus:border-lime-500 transition-colors placeholder:text-neutral-400"
                    placeholder="you@example.com"
                  />
                </div>

                <div>
                  <label className="block text-sm text-neutral-200 mb-1">
                    Password
                  </label>
                  <input
                    type="password"
                    required
                    minLength={6}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-neutral-600 border border-neutral-500 radius-sm px-4 py-3 text-neutral-50 outline-none focus:border-lime-500 transition-colors placeholder:text-neutral-400"
                    placeholder="••••••••"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-lime-500 text-black font-medium py-3 radius-sm hover:bg-lime-400 transition-colors flex items-center justify-center gap-2 mt-2 disabled:opacity-70 cursor-pointer"
                >
                  {isLoading && <Spinner size={16} color="text-black" />}
                  {tab === 'login' ? 'Log In' : 'Sign Up'}
                </button>
              </form>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

export default AuthModal

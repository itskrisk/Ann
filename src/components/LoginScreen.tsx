import React, { useState } from 'react'
import { useVault } from '../context/VaultContext'
import { Lock, ArrowRight } from 'lucide-react'

export const LoginScreen: React.FC = () => {
  const { unlockVault } = useVault()

  const [email, setEmail]           = useState('')
  const [password, setPassword]     = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading]   = useState(false)
  const [errorMsg, setErrorMsg]     = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || !password) {
      setErrorMsg('Enter your email and password.')
      return
    }
    setIsLoading(true)
    setErrorMsg(null)
    const err = await unlockVault(email.trim(), password)
    setIsLoading(false)
    if (err) {
      if (err.toLowerCase().includes('confirm')) {
        setErrorMsg('Email not confirmed in Supabase yet. Run the 1-line SQL in Supabase SQL Editor: UPDATE auth.users SET email_confirmed_at = NOW() WHERE email = \'ann@vault.com\';')
      } else {
        setErrorMsg(err)
      }
    }
  }

  return (
    <div className="min-h-screen w-full bg-[#F5F3EC] flex items-center justify-center px-4 select-none font-sans">
      <div className="w-full max-w-[360px] flex flex-col">

        {/* Brand */}
        <div className="mb-8 text-center">
          <h1 className="text-[42px] font-black tracking-[-0.04em] text-black leading-none">
            VAULT<span className="text-[#FF2E93]">.</span>
          </h1>
          <p className="text-[13px] font-mono text-[#888] mt-2">
            Your space. Your memories.
          </p>
        </div>

        {/* Card */}
        <div className="bg-white border-2 border-black p-7" style={{ boxShadow: '4px 4px 0px #0F0F0F' }}>
          <h2 className="text-[20px] font-black text-black tracking-tight mb-5">
            Welcome back, Anne.
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            {/* Email */}
            <div>
              <label className="block text-[10px] font-mono font-bold text-black uppercase tracking-widest mb-1.5">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => { setEmail(e.target.value); setErrorMsg(null) }}
                placeholder="ann@vault.com"
                autoComplete="email"
                className="w-full px-3 py-2.5 bg-[#F5F3EC] border-2 border-black text-[13px] text-black font-medium outline-none focus:bg-white focus:border-[#2563EB] transition-colors"
              />
            </div>

            {/* Password */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-[10px] font-mono font-bold text-black uppercase tracking-widest">
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  tabIndex={-1}
                  className="text-[10px] font-mono text-[#888] hover:text-black cursor-pointer uppercase tracking-widest"
                >
                  {showPassword ? 'Hide' : 'Show'}
                </button>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); setErrorMsg(null) }}
                  placeholder="Enter password"
                  autoComplete="current-password"
                  className="w-full px-3 py-2.5 bg-[#F5F3EC] border-2 border-black text-[13px] text-black font-medium outline-none focus:bg-white focus:border-[#FF2E93] transition-colors pr-9"
                />
                <div className="absolute right-3 top-1/2 -translate-y-1/2 text-black/30">
                  <Lock className="w-3.5 h-3.5" />
                </div>
              </div>
            </div>

            {/* Error */}
            {errorMsg && (
              <div className="bg-[#EF4444] text-white font-mono text-[11px] font-bold px-3 py-2 border-2 border-black">
                {errorMsg}
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-2.5 px-4 bg-[#FF2E93] hover:bg-[#E01E7E] text-white text-[12px] font-black uppercase tracking-widest border-2 border-black transition-all active:translate-x-0.5 active:translate-y-0.5 cursor-pointer flex items-center justify-center gap-2 disabled:opacity-60"
              style={{ boxShadow: '3px 3px 0px #0F0F0F' }}
            >
              {isLoading ? (
                <>
                  <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Unlocking...</span>
                </>
              ) : (
                <>
                  <span>Unlock</span>
                  <ArrowRight className="w-3.5 h-3.5 stroke-[3]" />
                </>
              )}
            </button>
          </form>
        </div>

      </div>
    </div>
  )
}

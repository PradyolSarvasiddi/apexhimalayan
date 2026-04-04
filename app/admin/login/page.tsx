'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import toast from 'react-hot-toast'
import ToastProvider from '@/components/ui/Toast'
import { Mountain } from 'lucide-react'

export default function AdminLoginPage() {
  const router = useRouter()
  const supabase = createClient()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!email.trim() || !password.trim()) {
      toast.error('Please enter both email and password')
      return
    }

    setLoading(true)

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        toast.error(error.message || 'Access denied. Invalid credentials.')
        return
      }

      toast.success('Welcome back!')
      router.push('/admin')
      router.refresh()
    } catch {
      toast.error('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-bg-primary relative flex items-center justify-center px-4 overflow-hidden">
      {/* Background Decorative Element */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-accent-orange/5 rounded-full blur-[120px] pointer-events-none" />
      
      <ToastProvider />
      
      <div className="w-full max-w-md relative z-10">
        <div className="text-center mb-10">
          <div className="w-16 h-16 rounded-2xl bg-accent-orange/10 flex items-center justify-center mx-auto mb-6 border border-accent-orange/20 shadow-xl shadow-accent-orange/5">
            <Mountain className="w-8 h-8 text-accent-orange" />
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-[0.15em] mb-2 drop-shadow-sm">
            APEX <span className="text-accent-orange">HIMALAYAN</span> RIDES
          </h1>
          <div className="flex items-center justify-center gap-3">
            <div className="h-[1px] w-8 bg-border-strong" />
            <p className="text-xs font-medium text-text-secondary uppercase tracking-[0.2em]">Admin Portal</p>
            <div className="h-[1px] w-8 bg-border-strong" />
          </div>
        </div>

        <div className="bg-bg-card/40 backdrop-blur-xl border border-white/5 rounded-3xl p-8 shadow-2xl relative overflow-hidden group">
          {/* Subtle line at the top of the card */}
          <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-accent-orange/20 to-transparent" />
          
          <form onSubmit={handleLogin} className="space-y-6">
            <Input
              label="Email Address"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@apexhimalayan.com"
              autoComplete="email"
              className="bg-bg-primary/50 border-white/5 focus:bg-bg-primary/80"
            />
            <Input
              label="Secure Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              autoComplete="current-password"
              className="bg-bg-primary/50 border-white/5 focus:bg-bg-primary/80"
            />
            
            <div className="pt-2">
              <Button
                type="submit"
                loading={loading}
                className="w-full py-6 text-sm font-bold uppercase tracking-widest transition-all duration-500 hover:shadow-accent-orange/40"
                size="lg"
              >
                Sign In to Dashboard
              </Button>
            </div>
          </form>
        </div>

        <p className="text-center text-[10px] text-text-muted mt-8 uppercase tracking-[0.3em] font-medium opacity-60">
          Authorized personnel only • Secure Access
        </p>
      </div>
    </div>
  )
}

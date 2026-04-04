'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'
import { NAV_SECTIONS } from '@/lib/constants'
import { createClient } from '@/lib/supabase/client'
import { Menu, X, ShieldCheck } from 'lucide-react'
import toast from 'react-hot-toast'

interface AdminSidebarProps {
  unreadCount: number
}

export default function AdminSidebar({ unreadCount }: AdminSidebarProps) {
  const pathname = usePathname()
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const supabase = createClient()

  useEffect(() => {
    setMounted(true)
    setIsOpen(false)
  }, [pathname])

  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut()
    if (error) {
      toast.error('Failed to sign out')
    } else {
      router.push('/admin/login')
    }
  }

  const isActive = (href: string) => {
    if (href === '/admin') return pathname === '/admin'
    return pathname.startsWith(href)
  }

  return (
    <>
      {/* Mobile hamburger */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-4 left-4 z-50 p-2.5 rounded-xl bg-bg-card border border-border-default/50 lg:hidden shadow-lg"
      >
        {isOpen ? <X className="w-5 h-5 text-text-primary" /> : <Menu className="w-5 h-5 text-text-primary" />}
      </button>

      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-30 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed top-0 left-0 h-screen w-68 bg-[#0D0F0E] border-r border-[#2A3530] z-40 flex flex-col admin-sidebar shadow-2xl transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] lg:translate-x-0',
          isOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        {/* Brand Header */}
        <div className="pt-10 pb-8 px-10">
          <div className="flex items-center gap-4 group">
            <div className="relative">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-accent-gold/20 to-accent-orange/20 flex items-center justify-center shadow-lg shadow-accent-gold/5 transform transition-transform group-hover:scale-110 duration-500 overflow-hidden">
                {mounted ? (
                  <Image 
                    src="/logo.png" 
                    alt="Apex Himalayan Rides" 
                    width={64}
                    height={64}
                    className="w-full h-full object-contain"
                  />
                ) : (
                  <div className="w-full h-full bg-bg-primary rounded-[10px]" />
                )}
              </div>
              <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-[#0A0A0A] rounded-full border-2 border-[#0A0A0A] flex items-center justify-center">
                <div className="w-2.5 h-2.5 bg-accent-gold rounded-full animate-pulse" />
              </div>
            </div>
            <div className="flex flex-col">
              <h1 className="text-xl font-black text-[#C9A84C] tracking-[-0.03em] leading-none">APEX</h1>
              <p className="text-[10px] font-bold text-[#F0EDE6] tracking-[0.25em] uppercase mt-1 opacity-90">Console</p>
            </div>
          </div>
        </div>

        {/* Separator */}
        <div className="px-10 mb-8">
          <div className="h-px w-full bg-gradient-to-r from-border-default/50 to-transparent" />
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto px-6 py-2 custom-scrollbar">
          {NAV_SECTIONS.map((section) => (
            <div key={section.title} className="mb-10 last:mb-6">
              <p className="px-4 pb-4 text-[10px] font-mono font-black text-[#6B6560] tracking-[0.3em] uppercase">
                {section.title}
              </p>
              <div className="space-y-1.5">
                {section.items.map((item) => {
                  const active = isActive(item.href)
                  
                  const NavContent = (
                    <>
                      <div className={cn(
                        "p-2 rounded-xl transition-all duration-300",
                        active ? "bg-[#1C2219] text-[#C9A84C]" : "bg-bg-elevated/50 text-[#9A9585] group-hover:bg-[#151A17] group-hover:text-[#F0EDE6]"
                      )}>
                        <item.icon className={cn("w-4 h-4", active && "glow-gold")} />
                      </div>
                      <span className={cn(
                        "flex-1 font-semibold text-sm transition-colors",
                        active ? "text-[#F0EDE6]" : "text-[#9A9585] group-hover:text-[#F0EDE6]"
                      )}>
                        {item.label}
                      </span>
                      {active && (
                        <div className="w-1.5 h-1.5 rounded-full bg-[#C9A84C] glow-gold" />
                      )}
                      {item.showBadge && unreadCount > 0 && (
                        <span className="min-w-[20px] h-5 px-1.5 rounded-lg bg-accent-orange text-white text-[10px] font-black flex items-center justify-center shadow-lg shadow-accent-orange/30">
                          {unreadCount}
                        </span>
                      )}
                    </>
                  )

                  if (item.isSignOut) {
                    return (
                      <button
                        key={item.label}
                        onClick={handleSignOut}
                        className="w-full flex items-center gap-4 px-4 py-3 rounded-2xl transition-all duration-300 group hover:bg-[#151A17]"
                      >
                        <div className="p-2 rounded-xl bg-bg-elevated/50 text-[#9A9585] group-hover:bg-danger/10 group-hover:text-danger transition-all">
                          <item.icon className="w-4 h-4" />
                        </div>
                        <span className="flex-1 font-semibold text-sm text-[#9A9585] group-hover:text-danger">
                          {item.label}
                        </span>
                      </button>
                    )
                  }

                  if (item.external) {
                    return (
                      <a
                        key={item.label}
                        href={item.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-4 px-4 py-3 rounded-2xl transition-all duration-300 group hover:bg-[#2A1F18]"
                      >
                        {NavContent}
                      </a>
                    )
                  }

                  return (
                    <Link
                      key={item.label}
                      href={item.href}
                      className={cn(
                        'flex items-center gap-4 px-4 py-3 rounded-2xl transition-all duration-500 group relative overflow-hidden',
                        active ? 'bg-[#1C2219] border-l-[3px] border-l-[#C9A84C] rounded-l-none' : 'hover:bg-[#151A17]'
                      )}
                    >
                      {active && (
                        <div className="absolute inset-0 bg-gradient-to-r from-[#C9A84C]/5 to-transparent pointer-events-none" />
                      )}
                      {NavContent}
                    </Link>
                  )
                })}
              </div>
            </div>
          ))}
        </nav>

        {/* High-End User Profile Section */}
        <div className="p-8">
          <div className="relative group bg-[#1C2219] p-4 rounded-3xl border border-white/5 transition-all duration-500 hover:border-accent-gold/20 hover:shadow-2xl hover:shadow-accent-gold/5">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="w-10 h-10 rounded-2xl bg-bg-elevated flex items-center justify-center border border-white/10 group-hover:border-accent-gold/30 transition-colors duration-500">
                  <ShieldCheck className="w-5 h-5 text-accent-gold" />
                </div>
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-success rounded-full border-2 border-[#1C2219]" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-black text-[#9A9585] truncate uppercase tracking-tight group-hover:text-accent-gold transition-colors">Admin Portal</p>
                <div className="flex items-center gap-1.5">
                  <span className="w-1 h-1 rounded-full bg-text-muted" />
                  <p className="text-[9px] font-bold text-[#9A9585] truncate uppercase tracking-widest leading-none">Super Admin</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </aside>
    </>
  )
}

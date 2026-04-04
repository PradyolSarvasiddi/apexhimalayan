'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import LoadingSpinner from '@/components/ui/LoadingSpinner'
import { createClient } from '@/lib/supabase/client'
import { getGreeting, formatDateTime, cn } from '@/lib/utils'
import { motion, AnimatePresence } from 'framer-motion'
import AdminHeader from '@/components/admin/AdminHeader'
import {
  Map,
  Home,
  Image as ImageIcon,
  Plus,
  ArrowUpRight,
  TrendingUp,
  Users,
  Compass,
  Zap,
  Star,
  ChevronRight,
  Sparkles
} from 'lucide-react'

interface Stats {
  totalTours: number
  availableTours: number
  totalStays: number
  galleryPhotos: number
  totalEnquiries: number
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [
          toursRes,
          availToursRes,
          staysRes,
          galleryRes,
          enquiriesRes,
        ] = await Promise.all([
          supabase.from('tours').select('*', { count: 'exact', head: true }),
          supabase.from('tours').select('*', { count: 'exact', head: true }).eq('is_available', true),
          supabase.from('stays').select('*', { count: 'exact', head: true }),
          supabase.from('gallery').select('*', { count: 'exact', head: true }),
          supabase.from('enquiries').select('*', { count: 'exact', head: true }),
        ])

        setStats({
          totalTours: toursRes?.count ?? 0,
          availableTours: availToursRes?.count ?? 0,
          totalStays: staysRes?.count ?? 0,
          galleryPhotos: galleryRes?.count ?? 0,
          totalEnquiries: enquiriesRes?.count ?? 0,
        })
      } catch (err) {
        console.error('Error fetching dashboard stats:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [supabase])

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-32 space-y-4">
        <div className="relative">
          <div className="w-16 h-16 rounded-2xl bg-accent-gold/10 animate-pulse" />
          <LoadingSpinner size="lg" className="absolute inset-0 text-accent-gold" />
        </div>
        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-text-muted animate-pulse">Initializing Console</p>
      </div>
    )
  }

  const statCards = [
    {
      label: 'Active Expeditions',
      value: stats?.totalTours || 0,
      sub: `${stats?.availableTours || 0} Open for Booking`,
      icon: Compass,
      color: 'gold',
    },
    {
      label: 'Luxury Stays',
      value: stats?.totalStays || 0,
      sub: 'Managed Accommodations',
      icon: Home,
      color: 'orange',
    },
    {
      label: 'Media Assets',
      value: stats?.galleryPhotos || 0,
      sub: 'In-house Photography',
      icon: ImageIcon,
      color: 'gold',
    },
    {
      label: 'Enquiries',
      value: stats?.totalEnquiries || 0,
      sub: 'Customer Requests',
      icon: Users,
      color: 'orange',
    },
  ]

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.2 } }
  } as const;

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { type: 'spring', stiffness: 100, damping: 15 } }
  } as const;

  return (
    <div className="flex flex-col bg-[#151A17] min-h-screen">
      <AdminHeader />
      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="max-w-[1600px] mx-auto space-y-12 pb-12 w-full px-6 md:px-10"
      >
      {/* Premium Greeting Section */}
      <motion.div variants={itemVariants} className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-2">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-[#C9A84C] opacity-80">Management Console</span>
            <div className="h-px w-8 bg-[#C9A84C]/30" />
            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-[#9A9585]">{new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</span>
          </div>
          <h2 className="text-4xl font-black text-[#F0EDE6] tracking-tight">
            {getGreeting()}, <span className="text-gold-gradient italic">Commander</span>
          </h2>
          <p className="text-sm text-[#9A9585] font-medium max-w-lg">
            Monitor and orchestrate the premium adventures of Apex Himalayan Rides from your dedicated command center.
          </p>
        </div>
        
        <div className="flex items-center gap-4 bg-white/5 p-2 rounded-2xl border border-white/5">
          <div className="flex -space-x-2">
            {[1, 2, 3].map(i => (
              <div key={i} className="w-8 h-8 rounded-full border-2 border-[#0F0F0F] bg-bg-elevated flex items-center justify-center">
                <Users className="w-3.5 h-3.5 text-text-muted" />
              </div>
            ))}
          </div>
          <div className="text-[10px] font-bold text-[#9A9585] uppercase tracking-widest leading-none">
            <span className="text-[#F0EDE6] block">3 Agents Online</span>
            Maintenance ongoing
          </div>
        </div>
      </motion.div>

      {/* Stats Dashboard */}
      <motion.div
        variants={itemVariants}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8"
      >
        {statCards.map((stat, i) => {
          const Icon = stat.icon
          const isGold = stat.color === 'gold'
          const isOrange = stat.color === 'orange'
          
          return (
            <Card 
              key={stat.label} 
              padding="lg" 
              hover 
              variant="glass"
              className="group relative overflow-hidden bg-[#1C2219] border-[#2A3530] hover:border-[#C9A84C]/20"
            >
              <div className={cn(
                "absolute -top-12 -right-12 w-32 h-32 rounded-full opacity-10 blur-3xl transition-all duration-700 group-hover:scale-150 group-hover:opacity-20",
                isGold ? "bg-accent-gold" : isOrange ? "bg-accent-orange" : "bg-text-muted"
              )} />
              
              <div className="relative z-10 flex flex-col h-full justify-between">
                <div className="flex items-start justify-between mb-8">
                  <div className={cn(
                    "p-3 rounded-2xl border transition-all duration-500",
                    isGold ? "bg-accent-gold/10 border-accent-gold/20 text-accent-gold glow-gold" : 
                    isOrange ? "bg-accent-orange/10 border-accent-orange/20 text-accent-orange glow-orange" : 
                    "bg-bg-elevated/50 border-white/10 text-text-muted"
                  )}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/5">
                    <TrendingUp className="w-3 h-3 text-success" />
                    <span className="text-[10px] font-black text-success">STABLE</span>
                  </div>
                </div>
                
                <div>
                  <div className="flex items-baseline gap-2">
                    <p className="text-5xl font-black text-[#C9A84C] tracking-tighter group-hover:text-gold-gradient transition-all duration-500">
                      {stat.value}
                    </p>
                  </div>
                  <p className="text-[10px] font-black text-[#9A9585] uppercase tracking-[0.2em] mt-3 group-hover:text-[#F0EDE6] transition-colors">
                    {stat.label}
                  </p>
                  <p className="text-[10px] font-bold text-[#9A9585]/60 mt-1">
                    {stat.sub}
                  </p>
                </div>
              </div>
            </Card>
          )
        })}
      </motion.div>


        {/* Command Tiles: Quick Actions */}
        <motion.div variants={itemVariants} className="space-y-8">
          <div className="flex items-center gap-3 px-2">
            <Zap className="w-4 h-4 text-[#D46B2A]" />
            <h3 className="text-xl font-black text-[#F0EDE6] tracking-tight uppercase tracking-[0.1em]">Quick Launch</h3>
          </div>
          
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            <Link href="/admin/tours/new" className="group">
              <Card 
                padding="md" 
                variant="glass" 
                className="h-32 flex flex-col items-center justify-center gap-3 bg-[#1C2219] border-[#2A3530] hover:border-[#C9A84C]/30 hover:bg-[#C9A84C] transition-all duration-500"
              >
                <div className="p-3 rounded-2xl bg-[#C9A84C]/10 text-[#C9A84C] group-hover:scale-110 group-hover:glow-gold group-hover:text-[#0D0F0E] transition-all duration-500">
                  <Compass className="w-6 h-6" />
                </div>
                <span className="text-[9px] font-black uppercase tracking-[0.2em] text-[#9A9585] group-hover:text-[#0D0F0E] transition-colors">New Tour</span>
              </Card>
            </Link>
            
            <Link href="/admin/stays/new" className="group">
              <Card 
                padding="md" 
                variant="glass" 
                className="h-32 flex flex-col items-center justify-center gap-3 bg-[#1C2219] border-[#2A3530] hover:border-[#D46B2A]/30 hover:bg-[#D46B2A] transition-all duration-500"
              >
                <div className="p-3 rounded-2xl bg-[#D46B2A]/10 text-[#D46B2A] group-hover:scale-110 group-hover:glow-orange group-hover:text-[#0D0F0E] transition-all duration-500">
                  <Plus className="w-6 h-6" />
                </div>
                <span className="text-[9px] font-black uppercase tracking-[0.2em] text-[#9A9585] group-hover:text-[#0D0F0E] transition-colors">New Stay</span>
              </Card>
            </Link>
            
            <Link href="/admin/gallery" className="group">
              <Card 
                padding="md" 
                variant="glass" 
                className="h-32 flex flex-col items-center justify-center gap-3 bg-[#1C2219] border-[#2A3530] hover:border-white/20 transition-all duration-500"
              >
                <div className="p-3 rounded-2xl bg-white/5 text-text-secondary group-hover:scale-110 group-hover:text-white transition-all duration-500">
                  <ImageIcon className="w-6 h-6" />
                </div>
                <span className="text-[9px] font-black uppercase tracking-[0.2em] text-[#9A9585] group-hover:text-[#F0EDE6] transition-colors">Media</span>
              </Card>
            </Link>
            
            <Link href="/admin/settings" className="group">
              <Card 
                padding="md" 
                variant="glass" 
                className="h-32 flex flex-col items-center justify-center gap-3 bg-[#1C2219] border-[#2A3530] hover:border-[#C9A84C]/20 transition-all duration-500"
              >
                <div className="p-3 rounded-2xl bg-[#243028] text-[#9A9585] group-hover:scale-110 group-hover:text-[#C9A84C] transition-all duration-500">
                  <Star className="w-6 h-6" />
                </div>
                <span className="text-[9px] font-black uppercase tracking-[0.2em] text-[#9A9585] group-hover:text-[#F0EDE6] transition-colors">System</span>
              </Card>
            </Link>
          </div>

          <Card padding="lg" variant="glass" className="bg-gradient-to-br from-[#C9A84C]/5 to-transparent border-[#C9A84C]/20 group overflow-hidden">
            <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-[#C9A84C] opacity-5 blur-2xl group-hover:opacity-10 transition-opacity" />
            <div className="flex gap-4 items-start relative z-10">
              <div className="p-3 rounded-2xl bg-[#C9A84C]/20 text-[#C9A84C] shadow-lg shadow-[#C9A84C]/10">
                <Compass className="w-5 h-5 animate-spin-slow" />
              </div>
              <div className="space-y-1">
                <p className="text-[10px] font-black uppercase text-[#C9A84C] tracking-[0.3em]">Operational Tip</p>
                <p className="text-xs font-bold text-[#F0EDE6] leading-relaxed opacity-90">
                  High-profile expeditions perform best when media assets are updated weekly. Ensure your "Visual Gallery" reflects current mountain conditions.
                </p>
              </div>
            </div>
          </Card>
        </motion.div>
      </motion.div>
    </div>
  )
}

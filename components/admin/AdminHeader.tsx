'use client'

import { usePathname } from 'next/navigation'
import { ExternalLink, ChevronRight, Layout } from 'lucide-react'
import Link from 'next/link'
import { cn } from '@/lib/utils'

const pageTitles: Record<string, string> = {
  '/admin': 'Executive Dashboard',
  '/admin/tours': 'Tour Management',
  '/admin/tours/new': 'Create New Expedition',
  '/admin/stays': 'Accommodation stays',
  '/admin/stays/new': 'New Stay Entry',
  '/admin/gallery': 'Visual Gallery',
  '/admin/testimonials': 'Rider Testimonials',
  '/admin/settings': 'System Settings',
}

interface AdminHeaderProps {
  action?: React.ReactNode
}

export default function AdminHeader({ action }: AdminHeaderProps) {
  const pathname = usePathname()

  const getTitle = () => {
    if (pathname.match(/\/admin\/tours\/[^/]+$/) && pathname !== '/admin/tours/new') {
      return 'Modify Expedition'
    }
    if (pathname.match(/\/admin\/stays\/[^/]+$/) && pathname !== '/admin/stays/new') {
      return 'Update Accommodation'
    }
    return pageTitles[pathname] || 'Dashboard'
  }

  const getBreadcrumbs = () => {
    const parts = pathname.split('/').filter(Boolean)
    const crumbs: { label: string; href: string }[] = []

    let path = ''
    for (const part of parts) {
      path += `/${part}`
      if (part === 'admin') {
        crumbs.push({ label: 'Console', href: '/admin' })
      } else if (pageTitles[path]) {
        crumbs.push({ label: pageTitles[path], href: path })
      } else if (part === 'new') {
        crumbs.push({ label: 'Create', href: path })
      } else {
        crumbs.push({ label: 'Edit', href: path })
      }
    }

    return crumbs
  }

  const breadcrumbs = getBreadcrumbs()

  return (
    <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-8">
      <div className="space-y-1">
        <nav className="flex items-center gap-2 text-[9px] font-black text-text-muted uppercase tracking-[0.25em] opacity-50">
          {breadcrumbs.map((crumb, i) => (
            <span key={crumb.href} className="flex items-center gap-2">
              {i > 0 && <ChevronRight className="w-3 h-3 opacity-30" />}
              {i < breadcrumbs.length - 1 ? (
                <Link href={crumb.href} className="hover:text-accent-gold transition-colors duration-300">
                  {crumb.label}
                </Link>
              ) : (
                <span className="text-accent-gold/80">{crumb.label}</span>
              )}
            </span>
          ))}
        </nav>
        <h1 className="text-3xl font-black text-text-primary tracking-tight leading-tight">
          {getTitle()}
        </h1>
      </div>

      <div className="flex items-center gap-4">
        {action}
        <Link
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className="hidden sm:flex items-center gap-2.5 px-5 py-2.5 rounded-2xl bg-white/5 border border-white/10 text-[11px] font-black text-text-secondary hover:text-white hover:border-accent-gold/40 hover:bg-accent-gold/10 transition-all duration-500 group uppercase tracking-widest"
        >
          <Layout className="w-3.5 h-3.5 text-accent-gold opacity-70 group-hover:opacity-100 transition-opacity" />
          <span>Live Site</span>
          <ExternalLink className="w-3 h-3 opacity-40 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
        </Link>
      </div>
    </header>
  )
}

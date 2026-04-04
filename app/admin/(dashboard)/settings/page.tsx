'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Input from '@/components/ui/Input'
import Textarea from '@/components/ui/Textarea'
import Button from '@/components/ui/Button'
import Card from '@/components/ui/Card'
import LoadingSpinner from '@/components/ui/LoadingSpinner'
import { createClient } from '@/lib/supabase/client'
import { SETTING_KEYS } from '@/lib/constants'
import { LogOut } from 'lucide-react'
import toast from 'react-hot-toast'

export default function SettingsPage() {
  const router = useRouter()
  const supabase = createClient()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  const [settings, setSettings] = useState({
    whatsapp_number: '',
    email: '',
    address: '',
    instagram: '',
    youtube: '',
    facebook: '',
    tagline: '',
  })

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const { data, error } = await supabase
          .from('site_settings')
          .select('*')

        if (error) throw error

        const settingsMap: Record<string, string> = {}
        data?.forEach((s: any) => {
          settingsMap[s.key] = s.value || ''
        })

        setSettings({
          whatsapp_number: settingsMap[SETTING_KEYS.WHATSAPP] || '',
          email: settingsMap[SETTING_KEYS.EMAIL] || '',
          address: settingsMap[SETTING_KEYS.ADDRESS] || '',
          instagram: settingsMap[SETTING_KEYS.INSTAGRAM] || '',
          youtube: settingsMap[SETTING_KEYS.YOUTUBE] || '',
          facebook: settingsMap[SETTING_KEYS.FACEBOOK] || '',
          tagline: settingsMap[SETTING_KEYS.TAGLINE] || '',
        })
      } catch {
        toast.error('Failed to load settings')
      } finally {
        setLoading(false)
      }
    }

    fetchSettings()
  }, [supabase])

  const handleSave = async () => {
    setSaving(true)
    try {
      const updates = [
        { key: SETTING_KEYS.WHATSAPP, value: settings.whatsapp_number },
        { key: SETTING_KEYS.EMAIL, value: settings.email },
        { key: SETTING_KEYS.ADDRESS, value: settings.address },
        { key: SETTING_KEYS.INSTAGRAM, value: settings.instagram },
        { key: SETTING_KEYS.YOUTUBE, value: settings.youtube },
        { key: SETTING_KEYS.FACEBOOK, value: settings.facebook },
        { key: SETTING_KEYS.TAGLINE, value: settings.tagline },
      ]

      for (const { key, value } of updates) {
        const { error } = await supabase
          .from('site_settings')
          .update({ value, updated_at: new Date().toISOString() })
          .eq('key', key)

        if (error) throw error
      }

      toast.success('Settings saved successfully')
    } catch {
      toast.error('Failed to save settings')
    } finally {
      setSaving(false)
    }
  }

  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut()
    if (error) {
      toast.error('Failed to sign out')
    } else {
      router.push('/admin/login')
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <LoadingSpinner size="lg" text="Loading settings..." />
      </div>
    )
  }

  return (
    <div className="max-w-2xl space-y-6">
      {/* Contact Information */}
      <Card>
        <h2 className="text-lg font-semibold text-text-primary mb-4">Contact Information</h2>
        <div className="space-y-4">
          <Input
            label="WhatsApp Number"
            value={settings.whatsapp_number}
            onChange={(e) => setSettings({ ...settings, whatsapp_number: e.target.value })}
            placeholder="+919816996799"
          />
          <Input
            label="Email Address"
            type="email"
            value={settings.email}
            onChange={(e) => setSettings({ ...settings, email: e.target.value })}
            placeholder="admin@example.com"
          />
          <Textarea
            label="Physical Address"
            value={settings.address}
            onChange={(e) => setSettings({ ...settings, address: e.target.value })}
            placeholder="Manali, Himachal Pradesh, India"
            className="min-h-[80px]"
          />
        </div>
      </Card>

      {/* Social Media */}
      <Card>
        <h2 className="text-lg font-semibold text-text-primary mb-4">Social Media</h2>
        <div className="space-y-4">
          <Input
            label="Instagram Handle"
            value={settings.instagram}
            onChange={(e) => setSettings({ ...settings, instagram: e.target.value })}
            placeholder="apex_himalayan_rides"
          />
          <Input
            label="YouTube Channel"
            value={settings.youtube}
            onChange={(e) => setSettings({ ...settings, youtube: e.target.value })}
            placeholder="Channel URL or ID"
          />
          <Input
            label="Facebook Page"
            value={settings.facebook}
            onChange={(e) => setSettings({ ...settings, facebook: e.target.value })}
            placeholder="Facebook page URL"
          />
        </div>
      </Card>

      {/* Site Content */}
      <Card>
        <h2 className="text-lg font-semibold text-text-primary mb-4">Site Content</h2>
        <div className="space-y-4">
          <Input
            label="Tagline"
            value={settings.tagline}
            onChange={(e) => setSettings({ ...settings, tagline: e.target.value })}
            placeholder="Ride Where Roads End"
          />
        </div>
      </Card>

      <Button
        onClick={handleSave}
        loading={saving}
        className="w-full"
        size="lg"
      >
        Save Settings
      </Button>

      {/* Danger Zone */}
      <Card className="border-danger/30">
        <h2 className="text-lg font-semibold text-danger mb-2">Danger Zone</h2>
        <p className="text-sm text-text-muted mb-4">
          These actions are irreversible. Proceed with caution.
        </p>
        <Button variant="danger" onClick={handleSignOut}>
          <LogOut className="w-4 h-4" />
          Sign Out
        </Button>
      </Card>
    </div>
  )
}

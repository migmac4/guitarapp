'use client'

import React from 'react'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/contexts/AuthContext'
import { useParams, useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function LocalePage() {
  const { t, i18n } = useTranslation()
  const { user, logout } = useAuth()
  const router = useRouter()
  const params = useParams()
  const locale = params?.locale as string
  
  useEffect(() => {
    if (!user || !user.emailVerified) {
      router.push(`/${locale}/login`)
    }
  }, [user, router, locale])

  if (!i18n.isInitialized || !user || !user.emailVerified) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading translations...</div>
      </div>
    )
  }

  return (
    <main className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">{t('welcome')}</h1>
        
        <div className="bg-card rounded-lg shadow-lg p-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-semibold">
                {t('example.title')}
              </h2>
              <Button variant="outline" onClick={() => logout()}>
                {t('auth.logout')}
              </Button>
            </div>
            
            <div className="flex flex-wrap gap-4">
              <Button>{t('example.button')}</Button>
              <Button variant="secondary">Secondary</Button>
              <Button variant="destructive">Destructive</Button>
              <Button variant="outline">Outline</Button>
              <Button variant="ghost">Ghost</Button>
              <Button variant="link">Link</Button>
            </div>
            
            <p className="mt-4 text-muted-foreground">
              {t('example.description')}
            </p>
          </div>

        <div className="mt-8 text-sm text-muted-foreground">
          Current Language: {i18n.language}
        </div>
      </div>
    </main>
  )
}

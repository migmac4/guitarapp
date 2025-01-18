'use client'

import React from 'react'
import { AuthForm } from '@/components/auth/AuthForm'
import { useAuth } from '@/contexts/AuthContext'
import { useParams, useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function LoginPage() {
  const { user } = useAuth()
  const router = useRouter()
  const params = useParams()
  const locale = Array.isArray(params?.locale) ? params.locale[0] : params?.locale || 'en'
  
  useEffect(() => {
    if (user) {
      router.push(`/${locale}`)
    }
  }, [user, router, locale])

  return (
    <div className="flex min-h-screen flex-col items-center justify-center">
      <AuthForm locale={locale} />
    </div>
  )
}

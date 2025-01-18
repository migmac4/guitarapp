'use client'

import React from 'react'
import { ForgotPasswordForm } from '@/components/auth/ForgotPasswordForm'
import { useAuth } from '@/contexts/AuthContext'
import { useParams, useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function ForgotPasswordPage() {
  const { user } = useAuth()
  const router = useRouter()
  const params = useParams()
  const locale = params?.locale as string
  
  useEffect(() => {
    if (user) {
      router.push(`/${locale}`)
    }
  }, [user, router, locale])

  return (
    <div className="flex min-h-screen flex-col items-center justify-center">
      <ForgotPasswordForm />
    </div>
  )
}

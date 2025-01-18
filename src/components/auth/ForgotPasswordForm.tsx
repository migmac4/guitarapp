'use client'

import React, { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { Button } from '@/components/ui/button'
import { useTranslation } from 'react-i18next'
import Link from 'next/link'
import { useParams } from 'next/navigation'

export function ForgotPasswordForm() {
  const params = useParams()
  const locale = (params?.locale as string) || 'en'
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isSent, setIsSent] = useState(false)
  const { resetPassword } = useAuth()
  const { t } = useTranslation()

  const validateForm = () => {
    if (!email.trim()) {
      setError(t('auth.validation.required'))
      return false
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      setError(t('auth.errors.invalid-email'))
      return false
    }

    return true
  }

  const handleFirebaseError = (error: Error) => {
    const errorCode = error.message.replace('Error: ', '')
    return t(`auth.errors.${errorCode}`, { defaultValue: t('auth.errors.default') })
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')

    if (!validateForm()) {
      return
    }

    setIsLoading(true)

    try {
      await resetPassword(email)
      setIsSent(true)
    } catch (error) {
      if (error instanceof Error) {
        setError(handleFirebaseError(error))
      } else {
        setError(t('auth.errors.default'))
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="w-full max-w-md mx-auto p-6">
      <div className="bg-card rounded-lg shadow-lg p-8">
        <h2 className="text-2xl font-bold mb-6 text-center">
          {t('auth.resetPassword')}
        </h2>

        {isSent ? (
          <div className="text-center space-y-4">
            <p className="text-sm text-muted-foreground">
              {t('auth.resetPasswordSent')}
            </p>
            <Link 
              href={`/${locale}/login`}
              className="text-sm text-primary hover:underline"
            >
              {t('auth.backToLogin')}
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                {t('auth.email')}
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value)
                  setError('')
                }}
                className="w-full p-2 rounded border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                required
                autoComplete="email"
                disabled={isLoading}
                placeholder={t('auth.email-placeholder')}
              />
            </div>

            {error && (
              <div className="text-destructive text-sm bg-destructive/10 p-3 rounded-md border border-destructive/20" role="alert">
                {error}
              </div>
            )}

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? t('auth.loading') : t('auth.resetPassword')}
            </Button>

            <div className="text-center mt-2">
              <Link 
                href={`/${locale}/login`}
                className="text-sm text-primary hover:underline"
              >
                {t('auth.backToLogin')}
              </Link>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}

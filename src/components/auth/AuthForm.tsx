'use client'

import React, { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { Button } from '@/components/ui/button'
import { useTranslation } from 'react-i18next'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import { GoogleIcon } from '@/components/icons/GoogleIcon'

interface AuthFormProps {
  locale: string;
}

export function AuthForm({ locale }: AuthFormProps) {
  const params = useParams()
  const router = useRouter()
  const { user, sendVerificationEmail } = useAuth()
  const [isLogin, setIsLogin] = useState(true)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [showVerificationMessage, setShowVerificationMessage] = useState(false)
  const { signIn, signUp, signInWithGoogle } = useAuth()
  const { t, i18n } = useTranslation()

  useEffect(() => {
    // Garante que o i18n está usando o locale correto
    if (i18n.language !== locale) {
      i18n.changeLanguage(locale)
    }
  }, [locale, i18n])

  useEffect(() => {
    if (user?.emailVerified) {
      router.push(`/${locale}`)
    }
  }, [user, locale, router])

  const validateForm = () => {
    if (!email.trim()) {
      setError(t('auth.errors.email-required'))
      return false
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      setError(t('auth.errors.invalid-email'))
      return false
    }

    if (!password.trim()) {
      setError(t('auth.errors.password-required'))
      return false
    }

    if (!isLogin) {
      if (password.length < 6) {
        setError(t('auth.errors.auth/weak-password'))
        return false
      }
      
      if (password !== confirmPassword) {
        setError(t('auth.errors.password-mismatch'))
        return false
      }
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
    setShowVerificationMessage(false)

    if (!validateForm()) {
      return
    }

    setIsLoading(true)

    try {
      if (isLogin) {
        await signIn(email, password)
      } else {
        await signUp(email, password, locale)
        setShowVerificationMessage(true)
        // Limpa os campos após registro bem-sucedido
        setEmail('')
        setPassword('')
        setConfirmPassword('')
        setIsLogin(true) // Muda para o modo de login
      }
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

  async function handleResendVerification() {
    setError('')
    setIsLoading(true)

    try {
      await sendVerificationEmail()
      setShowVerificationMessage(true)
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

  async function handleGoogleSignIn() {
    setError('')
    setIsLoading(true)

    try {
      await signInWithGoogle()
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
          {isLogin ? t('auth.login') : t('auth.register')}
        </h2>

        {showVerificationMessage && (
          <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-md text-blue-900">
            <p className="text-sm">
              {t('auth.verification-sent')}
              <button
                type="button"
                onClick={handleResendVerification}
                className="ml-1 text-blue-700 hover:text-blue-900 underline"
                disabled={isLoading}
              >
                {t('auth.resend-verification')}
              </button>
            </p>
          </div>
        )}

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

          <div>
            <label className="block text-sm font-medium mb-1">
              {t('auth.password')}
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value)
                setError('')
              }}
              className="w-full p-2 rounded border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
              required
              autoComplete={isLogin ? "current-password" : "new-password"}
              disabled={isLoading}
              minLength={6}
              placeholder={t('auth.password-placeholder')}
            />

            {!isLogin && (
              <>
                <div className="mt-4">
                  <label className="block text-sm font-medium mb-1">
                    {t('auth.confirmPassword')}
                  </label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => {
                      setConfirmPassword(e.target.value)
                      setError('')
                    }}
                    className="w-full p-2 rounded border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                    required
                    autoComplete="new-password"
                    disabled={isLoading}
                    placeholder={t('auth.confirmPassword-placeholder')}
                  />
                </div>

                <p className="text-xs text-muted-foreground mt-1">
                  {t('auth.password-hint')}
                </p>
              </>
            )}
          </div>

          {error && (
            <div className="text-destructive text-sm bg-destructive/10 p-3 rounded-md border border-destructive/20" role="alert">
              {error}
            </div>
          )}

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? t('auth.loading') : (isLogin ? t('auth.login') : t('auth.register'))}
          </Button>

          {isLogin && (
            <div className="text-center mt-2">
              <Link 
                href={`/${locale}/forgot-password`}
                className="text-sm text-primary hover:underline"
              >
                {t('auth.forgotPassword')}
              </Link>
            </div>
          )}

          <div className="relative my-4">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t"></div>
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                {t('auth.or')}
              </span>
            </div>
          </div>

          <Button
            type="button"
            variant="outline"
            className="w-full flex items-center justify-center gap-2"
            onClick={handleGoogleSignIn}
            disabled={isLoading}
          >
            <GoogleIcon />
            {t('auth.loginWithGoogle')}
          </Button>

          <Button
            type="button"
            variant="ghost"
            className="w-full"
            onClick={() => {
              setIsLogin(!isLogin)
              setError('')
              setEmail('')
              setPassword('')
              setConfirmPassword('')
              setShowVerificationMessage(false)
            }}
            disabled={isLoading}
          >
            {isLogin ? t('auth.needAccount') : t('auth.haveAccount')}
          </Button>
        </form>
      </div>
    </div>
  )
}

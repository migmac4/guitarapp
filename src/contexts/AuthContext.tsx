'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { 
  User,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
  AuthError,
  sendPasswordResetEmail
} from 'firebase/auth'
import { auth, sendEmailVerification } from '@/config/firebase'

interface AuthContextType {
  user: User | null
  loading: boolean
  signUp: (email: string, password: string, locale: string) => Promise<User>
  signIn: (email: string, password: string) => Promise<User>
  signInWithGoogle: () => Promise<void>
  logout: () => Promise<void>
  resetPassword: (email: string) => Promise<void>
  sendVerificationEmail: () => Promise<void>
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType)

export function useAuth() {
  return useContext(AuthContext)
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      console.log('Auth state changed:', firebaseUser?.email)
      
      if (firebaseUser) {
        // Se o usuário não estiver com email verificado, faz logout
        if (!firebaseUser.emailVerified) {
          console.log('Email não verificado - realizando logout...')
          await signOut(auth)
          setUser(null)
        } else {
          setUser(firebaseUser)
        }
      } else {
        setUser(null)
      }
      
      setLoading(false)
    })

    return unsubscribe
  }, [])

  async function signUp(email: string, password: string, locale: string) {
    try {
      console.log('[SignUp] Iniciando cadastro para:', email)
      console.log('[SignUp] Definindo idioma para:', locale)
      auth.languageCode = locale
      
      console.log('[SignUp] Criando usuário no Firebase...')
      const userCredential = await createUserWithEmailAndPassword(auth, email, password)
      console.log('[SignUp] Usuário criado com sucesso:', userCredential.user.uid)
      
      console.log('[SignUp] Enviando email de verificação...')
      try {
        await sendEmailVerification(userCredential.user)
        console.log('[SignUp] Email de verificação enviado com sucesso')
      } catch (error) {
        console.error('[SignUp] Erro ao enviar email de verificação:', error)
        throw error
      }
      
      console.log('[SignUp] Realizando logout...')
      await signOut(auth)
      console.log('[SignUp] Logout realizado com sucesso')
      
      return userCredential.user
    } catch (error) {
      console.error('Erro durante o cadastro:', error)
      if (error instanceof Error) {
        const authError = error as AuthError
        throw new Error(authError.code || authError.message)
      }
      throw error
    }
  }

  async function signIn(email: string, password: string) {
    try {
      console.log('Iniciando login para:', email)
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      )
      console.log('Login realizado com sucesso:', userCredential.user.uid)
      
      console.log('Verificando se email está confirmado...')
      if (!userCredential.user.emailVerified) {
        console.log('Email não verificado - realizando logout...')
        await signOut(auth)
        throw new Error('auth/email-not-verified')
      }
      console.log('Email verificado com sucesso')

      return userCredential.user
    } catch (error) {
      console.error('Erro durante o login:', error)
      if (error instanceof Error) {
        const authError = error as AuthError
        throw new Error(authError.code || authError.message)
      }
      throw error
    }
  }

  async function signInWithGoogle() {
    try {
      console.log('Iniciando login com Google...')
      const provider = new GoogleAuthProvider()
      provider.setCustomParameters({
        prompt: 'select_account'
      })
      console.log('Configurações do provider:', provider)
      const result = await signInWithPopup(auth, provider)
      console.log('Login com Google bem-sucedido:', result.user.email)
      
      if (!result.user.emailVerified) {
        console.log('Email não verificado - realizando logout...')
        await signOut(auth)
        throw new Error('auth/email-not-verified')
      }
    } catch (error) {
      console.error('Erro detalhado do login com Google:', error)
      if (error instanceof Error) {
        const authError = error as AuthError
        console.error('Código do erro:', authError.code)
        console.error('Mensagem do erro:', authError.message)
        throw new Error(authError.code || authError.message)
      }
      throw error
    }
  }

  async function logout() {
    try {
      await signOut(auth)
    } catch (error) {
      if (error instanceof Error) {
        const authError = error as AuthError
        throw new Error(authError.code || authError.message)
      }
      throw error
    }
  }

  async function sendVerificationEmail() {
    if (!auth.currentUser) {
      throw new Error('No authenticated user')
    }
    try {
      await sendEmailVerification(auth.currentUser)
    } catch (error) {
      if (error instanceof Error) {
        const authError = error as AuthError
        throw new Error(authError.code || authError.message)
      }
      throw error
    }
  }

  const value = {
    user,
    loading,
    signUp,
    signIn,
    signInWithGoogle,
    logout,
    resetPassword: async (email: string) => {
      try {
        await sendPasswordResetEmail(auth, email)
      } catch (error) {
        if (error instanceof Error) {
          const authError = error as AuthError
          throw new Error(authError.code || authError.message)
        }
        throw error
      }
    },
    sendVerificationEmail
  }

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  )
}

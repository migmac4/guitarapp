'use client'

import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/button'

export default function LocalePage({
  params,
}: {
  params: { locale: string }
}) {
  const { t, i18n, ready } = useTranslation()

  if (!ready) {
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
        
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
          <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white">
            {t('example.title')}
          </h2>
          
          <div className="flex flex-wrap gap-4">
            <Button>{t('example.button')}</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="destructive">Destructive</Button>
            <Button variant="outline">Outline</Button>
            <Button variant="ghost">Ghost</Button>
            <Button variant="link">Link</Button>
          </div>
          
          <p className="mt-4 text-gray-600 dark:text-gray-300">
            {t('example.description')}
          </p>
        </div>

        <div className="mt-8 text-sm text-gray-500">
          Current Language: {i18n.language}
        </div>
      </div>
    </main>
  )
}

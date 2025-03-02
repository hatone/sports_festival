import { getDictionary } from '../i18n'
import Link from 'next/link'
import type { Locale } from '../types'

export default async function Home({
  params: { lang }
}: {
  params: { lang: Locale }
}) {
  const dict = await getDictionary(lang)

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm lg:flex">
        <h1 className="text-4xl font-bold">{dict.welcome}</h1>
        <div className="flex gap-4 items-center">
          <div className="flex gap-2">
            <Link href="/en" className={`text-gray-600 hover:text-gray-900 ${lang === 'en' ? 'font-bold text-black' : ''}`}>
              English
            </Link>
            <Link href="/ja" className={`text-gray-600 hover:text-gray-900 ${lang === 'ja' ? 'font-bold text-black' : ''}`}>
              日本語
            </Link>
          </div>
          <Link
            href={`/${lang}/register`}
            className="px-4 py-2 bg-gray-800 text-white rounded hover:bg-gray-700 transition-colors"
          >
            {dict.form.title}
          </Link>
        </div>
      </div>
    </main>
  )
} 
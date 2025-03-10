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
    <main className="flex min-h-screen flex-col items-center p-6 md:p-24">
      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm lg:flex mb-12">
        <h1 className="text-4xl font-bold">{dict.welcome}</h1>
        <div className="flex gap-4 items-center mt-4 lg:mt-0">
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
      
      {/* イントロダクションセクション */}
      <div className="max-w-5xl w-full bg-white rounded-lg shadow-md p-6 md:p-8 mb-12">
        <h2 className="text-2xl font-bold mb-4">{dict.introduction.title}</h2>
        <p className="text-gray-700 mb-6 leading-relaxed">
          {dict.introduction.text}
        </p>
        
        <div className="bg-gray-50 p-4 rounded-lg">
          <ul className="space-y-2 text-gray-700">
            <li>{dict.introduction.details.date}</li>
            <li>{dict.introduction.details.venue}</li>
            <li>{dict.introduction.details.participants}</li>
            <li>{dict.introduction.details.fee}</li>
            <li>{dict.introduction.details.format}</li>
            <li>{dict.introduction.details.events}</li>
          </ul>
        </div>
      </div>
    </main>
  )
} 
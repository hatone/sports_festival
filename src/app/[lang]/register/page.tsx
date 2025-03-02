import { getDictionary } from '@/app/i18n'
import type { Locale } from '@/app/types'
import RegisterForm from './RegisterForm'
import Link from 'next/link'

export default async function Register({
  params: { lang }
}: {
  params: { lang: Locale }
}) {
  const dict = await getDictionary(lang)

  return (
    <main className="min-h-screen p-6 md:p-24 bg-gray-900">
      <div className="max-w-2xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-8">
          <div>
            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-white">{dict.form.title}</h1>
            <p className="text-gray-300 mt-1">{lang === 'ja' ? 'シリコンバレー大運動会' : 'Silicon Valley Sports Festival'}</p>
          </div>
          <div className="flex gap-2 mt-4 sm:mt-0">
            <Link href={`/en/register`} className={`text-gray-300 hover:text-white ${lang === 'en' ? 'font-bold text-white' : ''}`}>
              English
            </Link>
            <Link href={`/ja/register`} className={`text-gray-300 hover:text-white ${lang === 'ja' ? 'font-bold text-white' : ''}`}>
              日本語
            </Link>
          </div>
        </div>
        <RegisterForm dict={dict.form} />
      </div>
    </main>
  )
}
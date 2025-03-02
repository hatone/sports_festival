import { getDictionary } from '../../i18n'
import type { Locale } from '../../types'
import RegisterForm from './RegisterForm'
import Link from 'next/link'

export default async function Register({
  params: { lang }
}: {
  params: { lang: Locale }
}) {
  const dict = await getDictionary(lang)

  return (
    <main className="min-h-screen p-6 md:p-24">
      <div className="max-w-2xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">{dict.form.title}</h1>
          <div className="flex gap-2">
            <Link href={`/en/register`} className={lang === 'en' ? 'font-bold' : ''}>
              English
            </Link>
            <Link href={`/ja/register`} className={lang === 'ja' ? 'font-bold' : ''}>
              日本語
            </Link>
          </div>
        </div>
        <RegisterForm dict={dict.form} />
      </div>
    </main>
  )
} 
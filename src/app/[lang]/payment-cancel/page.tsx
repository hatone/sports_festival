'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

export default function PaymentCancelPage({
  params: { lang }
}: {
  params: { lang: string }
}) {
  const [dictionary, setDictionary] = useState({
    title: 'Payment Cancelled',
    message: 'Your payment process was cancelled',
    details: 'No charges have been made to your account.',
    instruction: 'You can try again or contact us if you need assistance.',
    returnButton: 'Return to Registration',
    homeButton: 'Return to Home',
  })

  useEffect(() => {
    // 言語に応じて辞書を切り替える
    if (lang === 'ja') {
      setDictionary({
        title: '決済キャンセル',
        message: '決済処理がキャンセルされました',
        details: 'お客様のアカウントには請求されていません。',
        instruction: '再度お試しいただくか、サポートが必要な場合はお問い合わせください。',
        returnButton: '登録ページに戻る',
        homeButton: 'ホームに戻る',
      })
    }
  }, [lang])

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6 md:p-24">
      <div className="max-w-2xl mx-auto text-center">
        <div className="mb-8">
          <div className="bg-yellow-500 rounded-full p-4 mx-auto w-16 h-16 flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </div>
        
        <h1 className="text-3xl font-bold mb-4">{dictionary.title}</h1>
        <p className="text-xl mb-4">{dictionary.message}</p>
        <p className="mb-4">{dictionary.details}</p>
        <p className="mb-8 text-gray-300">{dictionary.instruction}</p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href={`/${lang}/register`}
            className="px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-500 transition-colors"
          >
            {dictionary.returnButton}
          </Link>
          
          <Link
            href={`/${lang}`}
            className="px-6 py-2 bg-gray-700 text-white rounded-md hover:bg-gray-600 transition-colors"
          >
            {dictionary.homeButton}
          </Link>
        </div>
      </div>
    </div>
  )
} 
'use client'

export const dynamic = 'force-dynamic'

import { useEffect, useState, Suspense } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'

function PaymentSuccessContent({
  lang
}: {
  lang: string
}) {
  const searchParams = useSearchParams()
  const sessionId = searchParams.get('session_id')
  const [dictionary, setDictionary] = useState({
    title: 'Payment Successful',
    message: 'Thank you for your registration!',
    details: 'Your payment has been processed successfully.',
    sessionIdLabel: 'Transaction ID:',
    instruction: 'You will receive a confirmation email shortly.',
    homeButton: 'Return to Home',
  })

  useEffect(() => {
    // 言語に応じて辞書を切り替える
    if (lang === 'ja') {
      setDictionary({
        title: '決済完了',
        message: 'ご登録ありがとうございます！',
        details: 'お支払いが正常に処理されました。',
        sessionIdLabel: '取引ID:',
        instruction: '確認メールが間もなく届きます。',
        homeButton: 'ホームに戻る',
      })
    }
  }, [lang])

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6 md:p-24">
      <div className="max-w-2xl mx-auto text-center">
        <div className="mb-8">
          <div className="bg-green-500 rounded-full p-4 mx-auto w-16 h-16 flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
        </div>
        
        <h1 className="text-3xl font-bold mb-4">{dictionary.title}</h1>
        <p className="text-xl mb-4">{dictionary.message}</p>
        <p className="mb-8">{dictionary.details}</p>
        
        {sessionId && (
          <div className="bg-gray-800 p-4 rounded-md inline-block mb-8">
            <p className="text-gray-400 text-sm">{dictionary.sessionIdLabel}</p>
            <p className="font-mono text-sm">{sessionId}</p>
          </div>
        )}
        
        <p className="mb-8 text-gray-300">{dictionary.instruction}</p>
        
        <Link
          href={`/${lang}`}
          className="px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-500 transition-colors inline-block"
        >
          {dictionary.homeButton}
        </Link>
      </div>
    </div>
  )
} 
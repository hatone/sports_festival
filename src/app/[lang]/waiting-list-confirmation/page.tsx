'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function WaitingListConfirmation() {
  const router = useRouter()
  const [dictionary, setDictionary] = useState({
    title: 'Waitingリスト登録完了',
    message: 'Waitingリストへの登録が完了しました。',
    description: 'キャンセルが出た場合、登録いただいたメールアドレスにご連絡させていただきます。',
    backButton: 'トップページに戻る'
  })

  useEffect(() => {
    // 日本語の場合は辞書を更新
    const pathParts = window.location.pathname.split('/')
    if (pathParts[1] === 'ja') {
      setDictionary({
        title: 'Waitingリスト登録完了',
        message: 'Waitingリストへの登録が完了しました。',
        description: 'キャンセルが出た場合、登録いただいたメールアドレスにご連絡させていただきます。',
        backButton: 'トップページに戻る'
      })
    }
  }, [])

  return (
    <div className="min-h-screen bg-gray-900 py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto text-center">
        <h1 className="text-3xl font-extrabold text-white mb-8">
          {dictionary.title}
        </h1>
        
        <div className="bg-gray-800 rounded-lg p-8 mb-8">
          <p className="text-xl text-white mb-4">
            {dictionary.message}
          </p>
          <p className="text-gray-300">
            {dictionary.description}
          </p>
        </div>
        
        <button
          onClick={() => router.push('/')}
          className="px-6 py-3 bg-indigo-600 text-white rounded-md hover:bg-indigo-500 transition-colors"
        >
          {dictionary.backButton}
        </button>
      </div>
    </div>
  )
} 
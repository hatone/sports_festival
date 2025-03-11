'use client'

import { useSearchParams, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import Link from 'next/link'

export default function PaymentSuccessPage({
  params: { lang }
}: {
  params: { lang: string }
}) {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [isUpdating, setIsUpdating] = useState(true)
  const [updateSuccess, setUpdateSuccess] = useState(false)
  
  // ディクショナリ
  const dict = {
    ja: {
      title: 'お支払い完了',
      subtitle: 'シリコンバレー大運動会へのご登録ありがとうございます！',
      message: 'お支払いが完了しました。登録情報は登録時に入力いただいたメールアドレスに送信されます。',
      backToHome: 'ホームに戻る',
      confirmationNumber: '確認番号',
      updateStatus: {
        updating: 'システムに情報を更新中...',
        success: '登録情報が更新されました',
        error: '情報の更新中にエラーが発生しました（スタッフが手動で対応します）'
      }
    },
    en: {
      title: 'Payment Completed',
      subtitle: 'Thank you for registering for the Silicon Valley Sports Festival!',
      message: 'Your payment has been completed. The registration information will be sent to the email address you provided during registration.',
      backToHome: 'Back to Home',
      confirmationNumber: 'Confirmation Number',
      updateStatus: {
        updating: 'Updating system information...',
        success: 'Registration information has been updated',
        error: 'An error occurred while updating the information (staff will handle this manually)'
      }
    }
  }
  
  // 現在の言語の辞書を選択
  const t = lang === 'ja' ? dict.ja : dict.en
  
  // セッションIDを取得
  const sessionId = searchParams.get('session_id')
  
  // 支払い状況を更新
  useEffect(() => {
    const updatePaymentStatus = async () => {
      if (!sessionId) return
      
      try {
        setIsUpdating(true)
        const response = await fetch(`/api/update-payment-status?session_id=${sessionId}`)
        
        if (response.ok) {
          setUpdateSuccess(true)
        } else {
          console.error('支払い状況の更新に失敗しました')
          setUpdateSuccess(false)
        }
      } catch (error) {
        console.error('支払い状況の更新中にエラーが発生しました:', error)
        setUpdateSuccess(false)
      } finally {
        setIsUpdating(false)
      }
    }
    
    updatePaymentStatus()
  }, [sessionId])
  
  return (
    <div className="min-h-screen bg-gray-900 text-white p-6 md:p-24">
      <div className="max-w-2xl mx-auto text-center">
        <h1 className="text-3xl font-bold mb-4">{t.title}</h1>
        <h2 className="text-xl mb-6">{t.subtitle}</h2>
        
        <div className="bg-gray-800 p-6 rounded-lg shadow-md mb-8">
          <p className="mb-6">{t.message}</p>
          
          {sessionId && (
            <div className="mb-6">
              <p className="text-sm text-gray-400 mb-1">{t.confirmationNumber}</p>
              <p className="font-mono bg-gray-700 p-2 rounded-md overflow-x-auto text-sm">
                {sessionId}
              </p>
            </div>
          )}
          
          <div className="mb-6">
            {isUpdating ? (
              <div className="flex flex-col items-center">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-500 mb-2"></div>
                <p className="text-gray-400">{t.updateStatus.updating}</p>
              </div>
            ) : updateSuccess ? (
              <p className="text-green-400">{t.updateStatus.success}</p>
            ) : (
              <p className="text-red-400">{t.updateStatus.error}</p>
            )}
          </div>
          
          <Link
            href={`/${lang}`}
            className="inline-block px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-500 transition-colors"
          >
            {t.backToHome}
          </Link>
        </div>
      </div>
    </div>
  )
} 
'use client'

import { useSearchParams, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { loadStripe } from '@stripe/stripe-js'

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

// 料金計算関数（11歳以下は無料、12歳以上は$20）
const calculatePrice = (age: number): number => {
  return age <= 11 ? 0 : 20;
};

type Participant = {
  name: string;
  age: number;
  gender: string;
  events: string[];
  eventLabels: string[];
}

export default function ConfirmPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [formData, setFormData] = useState<{
    name: string
    age: string
    email: string
    gender: string
    events: string[]
    eventLabels: string[]
    phone: string
    notes: string
    participants: Participant[]
    totalPrice: number
  }>({
    name: '',
    age: '',
    email: '',
    gender: '',
    events: [],
    eventLabels: [],
    phone: '',
    notes: '',
    participants: [],
    totalPrice: 0
  })
  
  const [dictionary, setDictionary] = useState<{
    title: string
    confirmTitle: string
    backButton: string
    proceedToPayment: string
    eventOptions: Record<string, string>
    genderOptions: Record<string, string>
    participants: {
      title: string
      noParticipants: string
    }
    pricing: {
      title: string
      free: string
      paid: string
      total: string
      currency: string
    }
  }>({
    title: 'Registration Confirmation',
    confirmTitle: 'Please confirm your registration details',
    backButton: 'Back',
    proceedToPayment: 'Proceed to Payment',
    eventOptions: {
      running: 'Running Race',
      obstacle: 'Obstacle Race',
      relay: 'Relay Race',
      ballgame: 'Ball Game',
      tugofwar: 'Tug of War',
      dance: 'Team Dance',
      tailtag: 'Tail Tag'
    },
    genderOptions: {
      male: 'Male',
      female: 'Female',
      other: 'Other'
    },
    participants: {
      title: 'Additional Participants',
      noParticipants: 'No additional participants'
    },
    pricing: {
      title: 'Pricing Details',
      free: 'Free (11 years and under)',
      paid: '$20 (12 years and older)',
      total: 'Total',
      currency: '$'
    }
  })

  // URLパラメータからデータを取得
  useEffect(() => {
    const name = searchParams.get('name') || ''
    const age = searchParams.get('age') || ''
    const email = searchParams.get('email') || ''
    const gender = searchParams.get('gender') || ''
    const eventsJson = searchParams.get('events') || '[]'
    const phone = searchParams.get('phone') || ''
    const notes = searchParams.get('notes') || ''
    const participantsJson = searchParams.get('participants') || '[]'
    
    try {
      const events = JSON.parse(eventsJson)
      const eventLabels = events.map((event: string) => dictionary.eventOptions[event] || event)
      const participants = JSON.parse(participantsJson)
      
      // 参加者のイベントラベルを設定
      const participantsWithLabels = participants.map((participant: any) => ({
        ...participant,
        eventLabels: participant.events.map((event: string) => dictionary.eventOptions[event] || event)
      }))
      
      // 代表者と追加参加者の料金計算
      const representativePrice = calculatePrice(Number(age))
      const participantsPrices = participantsWithLabels.reduce((total: number, p: Participant) => 
        total + calculatePrice(p.age), 0)
      const totalPrice = representativePrice + participantsPrices
      
      setFormData({
        name,
        age,
        email,
        gender,
        events,
        eventLabels,
        phone,
        notes,
        participants: participantsWithLabels,
        totalPrice
      })
      
      // 言語によって辞書を切り替える
      const lang = window.location.pathname.split('/')[1]
      if (lang === 'ja') {
        setDictionary({
          title: '登録内容確認',
          confirmTitle: '以下の内容で登録します',
          backButton: '戻る',
          proceedToPayment: '支払いに進む',
          eventOptions: {
            running: '徒競走',
            obstacle: '障害物競争',
            relay: 'リレー',
            ballgame: '玉入れ',
            tugofwar: '綱引き',
            dance: 'チームでダンス対決',
            tailtag: 'しっぽ取り'
          },
          genderOptions: {
            male: '男性',
            female: '女性',
            other: 'その他'
          },
          participants: {
            title: '追加参加者',
            noParticipants: '追加参加者はいません'
          },
          pricing: {
            title: '料金詳細',
            free: '無料（11歳以下）',
            paid: '20ドル（12歳以上）',
            total: '合計',
            currency: '$'
          }
        })
      }
    } catch (error) {
      console.error('Failed to parse data:', error)
    }
  }, [searchParams])

  // Stripe決済画面に進む
  const handleProceedToPayment = async () => {
    try {
      // 言語情報を取得
      const lang = window.location.pathname.split('/')[1]
      
      // サーバーサイドのAPIを呼び出す
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          events: formData.events,
          lang: lang,
          phone: formData.phone,
          participants: formData.participants,
          amount: formData.totalPrice, // 計算された合計金額
        }),
      })
      
      if (!response.ok) {
        throw new Error('決済セッションの作成に失敗しました。')
      }
      
      const { sessionId } = await response.json()
      
      // Stripeのチェックアウトページへリダイレクト
      const stripe = await stripePromise
      if (stripe) {
        const { error } = await stripe.redirectToCheckout({ sessionId })
        if (error) {
          console.error(error)
          alert('決済ページへの遷移に失敗しました。')
        }
      }
    } catch (error) {
      console.error('Error:', error)
      alert('エラーが発生しました。もう一度お試しください。')
    }
  }

  // 前のページに戻る
  const handleBack = () => {
    router.back()
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6 md:p-24">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">{dictionary.title}</h1>
        
        {/* 代表者情報 */}
        <div className="bg-gray-800 p-6 rounded-lg shadow-md mb-8">
          <h2 className="text-xl font-semibold mb-4">{dictionary.confirmTitle}</h2>
          
          <div className="grid grid-cols-1 gap-4">
            <div>
              <p className="text-gray-400">名前</p>
              <p className="text-lg">{formData.name}</p>
            </div>
            
            <div>
              <p className="text-gray-400">年齢</p>
              <p className="text-lg">{formData.age}</p>
            </div>
            
            <div>
              <p className="text-gray-400">メールアドレス</p>
              <p className="text-lg">{formData.email}</p>
            </div>
            
            <div>
              <p className="text-gray-400">性別</p>
              <p className="text-lg">{dictionary.genderOptions[formData.gender] || formData.gender}</p>
            </div>
            
            {formData.phone && (
              <div>
                <p className="text-gray-400">電話番号</p>
                <p className="text-lg">{formData.phone}</p>
              </div>
            )}
            
            <div>
              <p className="text-gray-400">参加種目</p>
              <ul className="list-disc pl-5">
                {formData.eventLabels.map((event, index) => (
                  <li key={index} className="text-lg">{event}</li>
                ))}
              </ul>
            </div>
            
            {formData.notes && (
              <div>
                <p className="text-gray-400">備考</p>
                <p className="text-lg whitespace-pre-line">{formData.notes}</p>
              </div>
            )}
          </div>
        </div>
        
        {/* 追加参加者情報 */}
        <div className="bg-gray-800 p-6 rounded-lg shadow-md mb-8">
          <h2 className="text-xl font-semibold mb-4">{dictionary.participants.title}</h2>
          
          {formData.participants.length === 0 ? (
            <p className="text-gray-400">{dictionary.participants.noParticipants}</p>
          ) : (
            <div className="space-y-6">
              {formData.participants.map((participant, index) => (
                <div key={index} className="border-t border-gray-700 pt-4 first:border-t-0 first:pt-0">
                  <h3 className="font-medium text-white mb-2">参加者 {index + 1}: {participant.name}</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-gray-400">年齢</p>
                      <p className="text-lg">{participant.age}</p>
                    </div>
                    
                    <div>
                      <p className="text-gray-400">性別</p>
                      <p className="text-lg">{dictionary.genderOptions[participant.gender] || participant.gender}</p>
                    </div>
                    
                    <div className="md:col-span-2">
                      <p className="text-gray-400">参加種目</p>
                      <ul className="list-disc pl-5">
                        {participant.eventLabels.map((event, eventIndex) => (
                          <li key={eventIndex} className="text-lg">{event}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        
        {/* 料金情報 */}
        <div className="bg-gray-800 p-6 rounded-lg shadow-md mb-8">
          <h2 className="text-xl font-semibold mb-4">{dictionary.pricing.title}</h2>
          
          <div className="border-b border-gray-700 pb-4 mb-4">
            <p className="text-gray-400 mb-2">
              {Number(formData.age) <= 11 ? dictionary.pricing.free : dictionary.pricing.paid}
            </p>
            
            {formData.participants.map((participant, index) => (
              <p key={index} className="text-gray-400">
                {participant.name}: {participant.age <= 11 ? dictionary.pricing.free : dictionary.pricing.paid}
              </p>
            ))}
          </div>
          
          <div className="flex justify-between items-center">
            <p className="font-semibold">{dictionary.pricing.total}</p>
            <p className="text-xl font-bold">{dictionary.pricing.currency}{formData.totalPrice}</p>
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4">
          <button
            onClick={handleBack}
            className="px-6 py-2 bg-gray-700 text-white rounded-md hover:bg-gray-600 transition-colors"
          >
            {dictionary.backButton}
          </button>
          
          <button
            onClick={handleProceedToPayment}
            className="px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-500 transition-colors"
          >
            {dictionary.proceedToPayment}
          </button>
        </div>
      </div>
    </div>
  )
} 
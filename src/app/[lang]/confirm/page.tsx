'use client'

import { useSearchParams, useRouter, usePathname } from 'next/navigation'
import { useEffect, useState, Suspense } from 'react'
import Link from 'next/link'
import { loadStripe } from '@stripe/stripe-js'

export const dynamic = 'force-dynamic'

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

// 料金計算関数（12歳未満は無料、12歳以上は$20）
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

function ConfirmPageContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()
  const [lang, setLang] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)
  const [formData, setFormData] = useState<{
    name: string
    age: string
    email: string
    gender: string
    events: string[]
    eventLabels: string[]
    phone: string
    clubExperience: string
    exerciseFrequency: string
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
    clubExperience: '',
    exerciseFrequency: '',
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
      details: {
        date: string
        venue: string
        participants: string
        fee: string
        format: string
        events: string
      }
    }
  }>(lang === 'ja' ? {
    title: '登録内容確認',
    confirmTitle: '以下の登録内容をご確認ください',
    backButton: '戻る',
    proceedToPayment: '支払いに進む',
    eventOptions: {
      running: '徒競走',
      obstacle: '障害物競走',
      relay: 'リレー',
      ballgame: '玉入れ',
      tugofwar: '綱引き',
      dance: 'チームダンス',
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
      title: 'イベント詳細',
      free: '無料（12歳未満）',
      paid: '$20（12歳以上）',
      total: '合計',
      currency: '$',
      details: {
        date: '日時：2025年5月4日（日）午前9時〜午後4時',
        venue: '会場：Woodside High School',
        participants: '参加者：ベイエリア在住（でなくても可）のご家族のみなさま',
        fee: '参加費：12歳以上$20（12歳未満は無料）',
        format: '形式：4チームに分かれて点数をほのぼの競い合います。',
        events: ''
      }
    }
  } : {
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
      title: 'Event Details',
      free: 'Free (under 12 years)',
      paid: '$20 (12 years and older)',
      total: 'Total',
      currency: '$',
      details: {
        date: 'Date: May 4, 2025 (Sunday) 9:00 AM - 4:00 PM',
        venue: 'Venue: Woodside High School',
        participants: 'Participants: Families residing in the Bay Area (others are welcome too)',
        fee: 'Fee: $20 for ages 12 and above (Free for under 12 years)',
        format: 'Format: Participants will be divided into 4 teams to compete for points in a friendly manner.',
        events: ''
      }
    }
  })

  // URLパラメータからデータとURLから言語を取得
  useEffect(() => {
    // URLから言語を取得
    if (pathname) {
      const pathParts = pathname.split('/');
      if (pathParts.length > 1) {
        const urlLang = pathParts[1];
        setLang(urlLang);
        
        // 言語に基づいて辞書を設定
        if (urlLang === 'ja') {
          setDictionary({
            title: '登録内容確認',
            confirmTitle: '以下の登録内容をご確認ください',
            backButton: '戻る',
            proceedToPayment: '支払いに進む',
            eventOptions: {
              running: '徒競走',
              obstacle: '障害物競走',
              relay: 'リレー',
              ballgame: '玉入れ',
              tugofwar: '綱引き',
              dance: 'チームダンス',
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
              title: 'イベント詳細',
              free: '無料（12歳未満）',
              paid: '$20（12歳以上）',
              total: '合計',
              currency: '$',
              details: {
                date: '日時：2025年5月4日（日）午前9時〜午後4時',
                venue: '会場：Woodside High School',
                participants: '参加者：ベイエリア在住（でなくても可）のご家族のみなさま',
                fee: '参加費：12歳以上$20（12歳未満は無料）',
                format: '形式：4チームに分かれて点数をほのぼの競い合います。',
                events: ''
              }
            }
          });
        }
      }
    }
    
    const name = searchParams.get('name') || ''
    const age = searchParams.get('age') || ''
    const email = searchParams.get('email') || ''
    const gender = searchParams.get('gender') || ''
    const eventsJson = searchParams.get('events') || '[]'
    const phone = searchParams.get('phone') || ''
    const clubExperience = searchParams.get('clubExperience') || ''
    const exerciseFrequency = searchParams.get('exerciseFrequency') || ''
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
        clubExperience,
        exerciseFrequency,
        notes,
        participants: participantsWithLabels,
        totalPrice
      })
    } catch (error) {
      console.error('Failed to parse data:', error)
    }
  }, [searchParams, pathname])

  // Stripe決済画面に進む
  const handleProceedToPayment = async () => {
    // 処理中の場合は実行しない（二重クリック防止）
    if (isProcessing) return;
    
    // セッション識別子をチェック（重複支払い防止）
    const sessionKey = `payment_${formData.email}_${formData.name}`;
    const existingSession = typeof window !== 'undefined' ? localStorage.getItem(sessionKey) : null;
    
    // 前回の支払いから5分以内の場合は警告を表示
    if (existingSession) {
      const lastPayment = JSON.parse(existingSession);
      const now = Date.now();
      const fiveMinutesAgo = now - 5 * 60 * 1000;
      
      if (lastPayment.timestamp > fiveMinutesAgo) {
        const confirmDuplicate = window.confirm(
          lang === 'ja' 
            ? '5分以内に同じ情報で支払い処理が行われています。重複して支払いを行う可能性があります。続行しますか？' 
            : 'A payment with the same information was processed within the last 5 minutes. You may be making a duplicate payment. Do you want to continue?'
        );
        
        if (!confirmDuplicate) {
          return;
        }
      }
    }
    
    try {
      // 処理中フラグをON
      setIsProcessing(true);
      
      // サーバーサイドのAPIを呼び出す
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: formData.name,
          age: Number(formData.age),
          email: formData.email,
          gender: formData.gender,
          events: formData.events,
          phone: formData.phone,
          clubExperience: formData.clubExperience,
          exerciseFrequency: formData.exerciseFrequency,
          notes: formData.notes,
          participants: formData.participants.map(p => ({
            name: p.name,
            age: p.age,
            gender: p.gender,
            events: p.events
          })),
          amount: formData.totalPrice,
          locale: lang,
        })
      })
      
      if (!response.ok) {
        throw new Error('決済セッションの作成に失敗しました。')
      }
      
      const { sessionId } = await response.json()
      
      // セッション情報をローカルストレージに保存
      if (typeof window !== 'undefined') {
        localStorage.setItem(sessionKey, JSON.stringify({
          timestamp: Date.now(),
          sessionId
        }));
      }
      
      // Stripeのチェックアウトページへリダイレクト
      const stripe = await stripePromise
      if (stripe) {
        const { error } = await stripe.redirectToCheckout({ sessionId })
        if (error) {
          console.error(error)
          alert('決済ページへの遷移に失敗しました。')
          // エラー時はフラグをOFF
          setIsProcessing(false);
        }
      }
    } catch (error) {
      console.error('Error:', error)
      alert('エラーが発生しました。もう一度お試しください。')
      setIsProcessing(false);
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
        
        {/* イベント詳細 */}
        <div className="bg-gray-800 p-6 rounded-lg shadow-md mb-8">
          <h2 className="text-xl font-semibold mb-4">{dictionary.pricing.title}</h2>
          <ul className="space-y-2 text-gray-300">
            <li>{dictionary.pricing.details.date}</li>
            <li>{dictionary.pricing.details.venue}</li>
            <li>{dictionary.pricing.details.participants}</li>
            <li>{dictionary.pricing.details.fee}</li>
            <li>{dictionary.pricing.details.format}</li>
            <li>{dictionary.pricing.details.events}</li>
          </ul>
        </div>
        
        {/* 注意書き */}
        <div className="bg-gray-800 p-6 rounded-lg shadow-md mb-8">
          <div className="text-amber-400 text-sm space-y-2">
            {lang === 'ja' ? (
              <>
                <p>※ お申込み後のキャンセルは承っておりません。内容をご確認のうえ、送信をお願いします。</p>
                <p>※ 送信ボタンを何度も押すと、まれに二重で決済されてしまうことがあります。1回だけ押して、そのまま少しお待ちください。</p>
              </>
            ) : (
              <>
                <p>* We do not accept cancellations after submission. Please confirm your details before proceeding.</p>
                <p>* Pressing the submission button multiple times may occasionally result in duplicate charges. Please press it only once and wait patiently.</p>
              </>
            )}
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
            disabled={isProcessing}
            className={`px-6 py-2 ${isProcessing ? 'bg-gray-500 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-500'} text-white rounded-md transition-colors flex items-center justify-center`}
          >
            {isProcessing ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                {lang === 'ja' ? '処理中...' : 'Processing...'}
              </>
            ) : (
              dictionary.proceedToPayment
            )}
          </button>
        </div>
      </div>
    </div>
  )
}

export default function ConfirmPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-900 text-white p-6 md:p-24">
        <div className="max-w-2xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-700 rounded w-1/2 mb-8"></div>
            <div className="space-y-4">
              <div className="h-4 bg-gray-700 rounded w-3/4"></div>
              <div className="h-4 bg-gray-700 rounded w-1/2"></div>
              <div className="h-4 bg-gray-700 rounded w-2/3"></div>
            </div>
          </div>
        </div>
      </div>
    }>
      <ConfirmPageContent />
    </Suspense>
  )
} 
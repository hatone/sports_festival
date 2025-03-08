'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { getDictionary } from '../../i18n'

export const dynamic = 'force-dynamic'

function DisclaimerContent({
  lang
}: {
  lang: string
}) {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [formData, setFormData] = useState<{
    name: string
    age: string
    email: string
    gender: string
    events: string[]
    phone: string
    notes: string
    participants: any[]
  }>({
    name: '',
    age: '',
    email: '',
    gender: '',
    events: [],
    phone: '',
    notes: '',
    participants: []
  })
  
  const [dictionary, setDictionary] = useState<{
    title: string
    content: string[]
    sections: {
      liability: string
      minors: string
      health: string
      photo: string
      personal: string
      indemnity: string
      conclusion: string
    }
    agreement: string
    nameConfirmation: string
    namePlaceholder: string
    submitButton: string
    backButton: string
  }>({
    title: 'Disclaimer and Consent Form',
    content: [],
    sections: {
      liability: 'Liability Waiver',
      minors: 'Participation of Minors',
      health: 'Health Condition Confirmation',
      photo: 'Photography & Media Release',
      personal: 'Personal Information Handling',
      indemnity: 'Indemnity',
      conclusion: 'Conclusion'
    },
    agreement: 'I have read and understood all the terms of this disclaimer and agree to them.',
    nameConfirmation: 'Type your name as signature:',
    namePlaceholder: 'Your full name',
    submitButton: 'Submit and Proceed to Payment',
    backButton: 'Back'
  })
  
  const [agreed, setAgreed] = useState(false)
  const [signature, setSignature] = useState('')
  const [error, setError] = useState('')
  
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
      const participants = JSON.parse(participantsJson)
      
      setFormData({
        name,
        age,
        email,
        gender,
        events,
        phone,
        notes,
        participants
      })
      
      // 言語によって辞書を切り替える
      if (lang === 'ja') {
        setDictionary({
          title: '免責事項および同意書',
          content: [
            '1. 免責事項（Liability Waiver）',
            '私は、運動会への参加がランニング、ジャンプ、その他の身体的活動を伴うものであり、転倒、衝突、疲労、天候による影響など、負傷や事故のリスクを伴うことを理解します。私は自身の健康状態を十分に考慮し、自己責任で参加することを選択します。',
            '私は、主催者、協賛者、スタッフ、ボランティア、会場提供者（以下「関係者」）に対し、運動会への参加中に生じた傷害、疾病、死亡、または財産の損害について、関係者の故意または重大な過失に起因する場合を除き、いかなる責任も追及せず、訴訟を提起しないことに同意します。',
            '2. 未成年者の参加について',
            '18歳未満の参加者は、親または法的保護者（以下「保護者」）の同意が必要です。保護者は本書に署名することで、参加者が本同意書の全条件を理解し遵守することを保証するとともに、参加者の行動およびその結果について責任を負うことに同意します。',
            '3. 健康状態の確認（Health Condition Confirmation）',
            '私は、運動会に参加するのに適した健康状態であることを確認し、必要に応じて事前に医師の診断を受けています。イベント中に体調不良を感じた場合、直ちに運営スタッフに報告し、スタッフの指示に従うことに同意します。また、主催者が緊急と判断した場合、医療機関への搬送や応急処置を許可します。',
            '4. 写真・映像撮影およびメディアへの使用（Photography & Media Release）',
            '運動会では、写真および映像の撮影が行われます。これらの素材は、イベントの記録、プロモーション、報告、広報活動（SNS、ウェブサイト、パンフレット、広告等）に使用される可能性があります。私は、関係者が私の写真・映像を上記の目的で使用することに同意し、これに対する報酬や追加の権利を求めません。',
            '撮影またはメディア露出を希望しない場合、運営が提供する識別用印（例：ステッカーやたすき）を受け取り、イベント当日、運営スタッフに分かるよう明確に身につけることに同意します。',
            '5. 個人情報の取り扱い（Personal Information Handling）',
            '本フォームに記載された個人情報は、運動会の運営および緊急時の連絡以外の目的には使用しません。情報は適切に管理され、イベント終了後は法令に従い安全に廃棄されます。',
            '6. 補償（Indemnity）',
            '私は、運動会中の私の行動が第三者に損害を与えた場合、その責任を負い、関係者をあらゆる請求、損失、訴訟から保護し補償することに同意します。',
            '私は、本同意書の全内容を読み、理解し、免責事項、撮影ポリシー、その他すべての条件に同意した上で、運動会への参加を申し込みます。',
            '複数名を同時に申請する場合、申請代表者は、申請する全員が本同意書の全内容を読み、理解し、同意していることを確認し、その確認義務を負います。',
            '18歳未満の参加者が含まれる場合、申請代表者は、各未成年者の親または法的保護者（以下「保護者」）が本同意書の全条件に同意し、未成年者の行動およびその結果に対する責任を負うことを保証します。保護者の署名が別途必要な場合、申請代表者はその提出を確保する責任を負います。'
          ],
          sections: {
            liability: '免責事項',
            minors: '未成年者の参加について',
            health: '健康状態の確認',
            photo: '写真・映像撮影およびメディアへの使用',
            personal: '個人情報の取り扱い',
            indemnity: '補償',
            conclusion: '結論'
          },
          agreement: '免責事項のすべての内容を理解し、同意します。',
          nameConfirmation: '署名の代わりに名前を入力してください：',
          namePlaceholder: 'あなたの氏名',
          submitButton: '同意して支払いに進む',
          backButton: '戻る'
        })
      } else {
        setDictionary({
          title: 'Disclaimer and Consent Form',
          content: [
            "Atsushi Tamura's Silicon Valley Sports Festival Consent Form",
            "The event \"Atsushi Tamura's Silicon Valley Sports Festival\" (hereinafter \"Sports Festival\") is organized by Inter-Pacific Publications, Inc. and will be held on May 4, 2025, at Woodside High School. This consent form outlines the terms and conditions for participation. Please read the following carefully, and by signing below, you acknowledge your understanding and agreement to these terms, which are legally binding.",
            "1. Liability Waiver",
            "I understand that participation in the Sports Festival involves physical activities such as running, jumping, and other exertions, which carry inherent risks of injury or accidents, including but not limited to falls, collisions, fatigue, or weather-related effects. I have assessed my health condition and choose to participate at my own risk.",
            "I agree not to hold the organizers, sponsors, staff, volunteers, or venue providers (collectively, \"Related Parties\") liable for any injury, illness, death, or property damage arising from my participation in the Sports Festival, except in cases of intentional misconduct or gross negligence by the Related Parties. I waive any right to pursue claims or lawsuits against them under such circumstances.",
            "2. Participation of Minors",
            "Participants under 18 years of age require the consent of a parent or legal guardian (hereinafter \"Guardian\"). By signing this form, the Guardian confirms that the minor understands and will comply with all terms herein and accepts responsibility for the minor's actions and their consequences.",
            "3. Health Condition Confirmation",
            "I confirm that I am in suitable health to participate in the Sports Festival and have, if necessary, consulted a physician prior to participation. If I experience any health issues during the event, I agree to immediately notify the event staff and follow their instructions. I also authorize the organizers to arrange emergency medical transport or treatment if they deem it necessary.",
            "4. Photography & Media Release",
            "The Sports Festival will involve photography and video recording. These materials may be used for event documentation, promotion, reporting, or publicity purposes (e.g., social media, websites, brochures, advertisements). I grant the Related Parties permission to use my image or likeness for these purposes without compensation or additional claims to rights.",
            "If I do not wish to be photographed or featured in media, I agree to obtain and visibly wear an identification marker (e.g., sticker or sash) provided by the organizers on the event day to make my preference clear to staff.",
            "5. Personal Information Handling",
            "Personal information provided in this form will be used solely for the operation of the Sports Festival and emergency contact purposes. It will be securely managed and disposed of in accordance with applicable laws after the event concludes.",
            "6. Indemnity",
            "I agree to take responsibility for any harm or damage my actions may cause to third parties during the Sports Festival. I will indemnify and hold the Related Parties harmless from any claims, losses, or lawsuits arising from such incidents.",
            "I have read and understood the entire contents of this consent form, including the liability waiver, photography policy, and all other terms, and I agree to these conditions in applying to participate in the Sports Festival.",
            "When registering multiple participants, the representative confirms that all individuals listed have read, understood, and agreed to the full contents of this consent form and assumes responsibility for ensuring this confirmation.",
            "If participants under 18 years of age are included, the representative guarantees that each minor's parent or legal guardian (hereinafter \"Guardian\") has agreed to all terms of this consent form and accepts responsibility for the minor's actions and their consequences. Where a separate Guardian signature is required, the representative is responsible for ensuring its submission."
          ],
          sections: {
            liability: 'Liability Waiver',
            minors: 'Participation of Minors',
            health: 'Health Condition Confirmation',
            photo: 'Photography & Media Release',
            personal: 'Personal Information Handling',
            indemnity: 'Indemnity',
            conclusion: 'Conclusion'
          },
          agreement: 'I have read and understood all the terms of this disclaimer and agree to them.',
          nameConfirmation: 'Type your name as signature:',
          namePlaceholder: 'Your full name',
          submitButton: 'Submit and Proceed to Payment',
          backButton: 'Back'
        })
      }
    } catch (error) {
      console.error('Failed to parse data:', error)
    }
  }, [searchParams, lang])
  
  // 同意して支払いに進む
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!agreed) {
      setError(lang === 'ja' ? '同意が必要です' : 'Agreement is required')
      return
    }
    
    if (!signature) {
      setError(lang === 'ja' ? '署名が必要です' : 'Signature is required')
      return
    }
    
    // 確認ページへのURLパラメータを作成
    const params = new URLSearchParams()
    params.set('name', formData.name)
    params.set('age', formData.age)
    params.set('email', formData.email)
    params.set('gender', formData.gender)
    params.set('events', JSON.stringify(formData.events))
    params.set('phone', formData.phone || '')
    params.set('notes', formData.notes || '')
    params.set('participants', JSON.stringify(formData.participants || []))
    params.set('signature', signature) // 署名情報も追加
    
    // 確認ページへ遷移
    router.push(`/${lang}/confirm?${params.toString()}`)
  }
  
  // 前のページに戻る
  const handleBack = () => {
    router.back()
  }
  
  return (
    <div className="min-h-screen bg-gray-900 text-white p-6 md:p-24">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">{dictionary.title}</h1>
        
        <div className="bg-gray-800 p-6 rounded-lg shadow-md mb-8">
          <div className="prose prose-invert max-w-none">
            {dictionary.content.map((paragraph, index) => (
              <p key={index} className={`mb-4 ${paragraph.startsWith('1.') || paragraph.startsWith('2.') || paragraph.startsWith('3.') || paragraph.startsWith('4.') || paragraph.startsWith('5.') || paragraph.startsWith('6.') ? 'font-semibold mt-6' : ''}`}>
                {paragraph}
              </p>
            ))}
          </div>
        </div>
        
        <form onSubmit={handleSubmit} className="bg-gray-800 p-6 rounded-lg shadow-md">
          <div className="mb-6">
            <div className="flex items-center mb-4">
              <input
                id="agreement"
                type="checkbox"
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-500 rounded bg-gray-700"
                checked={agreed}
                onChange={(e) => setAgreed(e.target.checked)}
                required
              />
              <label htmlFor="agreement" className="ml-2 block text-sm text-white">
                {dictionary.agreement}
              </label>
            </div>
            
            <div className="mb-4">
              <label htmlFor="signature" className="block text-sm font-medium text-white mb-2">
                {dictionary.nameConfirmation}
              </label>
              <input
                type="text"
                id="signature"
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                value={signature}
                onChange={(e) => setSignature(e.target.value)}
                placeholder={dictionary.namePlaceholder}
                required
              />
            </div>
            
            {error && (
              <p className="text-red-500 text-sm mb-4">{error}</p>
            )}
            
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                type="button"
                onClick={handleBack}
                className="px-4 py-2 bg-gray-700 text-white rounded-md hover:bg-gray-600 transition-colors"
              >
                {dictionary.backButton}
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-500 transition-colors"
              >
                {dictionary.submitButton}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}

export default function DisclaimerPage({
  params: { lang }
}: {
  params: { lang: string }
}) {
  return (
    <DisclaimerContent lang={lang} />
  )
} 
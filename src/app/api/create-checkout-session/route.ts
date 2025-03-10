import { NextResponse } from 'next/server'
import Stripe from 'stripe'

// 環境変数からStripe APIキーを取得
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-02-24.acacia',
})

export async function POST(request: Request) {
  try {
    const { name, email, events, lang, phone, participants, amount, gender, notes } = await request.json()
    
    // 合計参加者数（代表者 + 追加参加者）
    const totalParticipants = 1 + (participants?.length || 0)
    
    // 受け取った金額を使用（11歳以下は無料、12歳以上は$20）
    // クライアント側で計算された金額をセント単位に変換（ドル→日本円）
    const unitAmount = amount * 100
    
    // 参加者情報をJSON文字列に変換
    const participantsInfo = JSON.stringify(participants || [])
    
    // 選択したイベントをカンマ区切りの文字列に変換
    const eventsString = Array.isArray(events) ? events.join(', ') : ''
    
    // Stripeセッションを作成
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd', // 米ドルに変更
            product_data: {
              name: '運動会参加費',
              description: `${name}様を含む ${totalParticipants}名`,
            },
            unit_amount: unitAmount,
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/${lang}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/${lang}/payment-cancel`,
      customer_email: email,
      metadata: {
        name: name,
        email: email,
        phone: phone || '',
        gender: gender || '',
        events: eventsString,
        notes: notes || '',
        participantsCount: totalParticipants.toString(),
        participants: participantsInfo.length > 500 ? '参加者情報は長すぎるため省略されました' : participantsInfo,
        language: lang
      },
    })
    
    return NextResponse.json({ sessionId: session.id })
  } catch (error) {
    console.error('Stripe API Error:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
} 
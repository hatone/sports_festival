import { NextResponse } from 'next/server'
import Stripe from 'stripe'
import { appendToGoogleSheet } from '../../utils/googleSheets'

// 環境変数からStripe APIキーを取得
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-02-24.acacia',
})

export async function POST(request: Request) {
  try {
    const { name, email, events, lang, phone, participants, amount, gender, notes, age } = await request.json()
    
    
    // 合計参加者数（代表者 + 追加参加者）
    const totalParticipants = 1 + (participants?.length || 0)
    
    // 年齢別の参加者数をカウント
    let adultCount = 0; // 12歳以上
    let childCount = 0; // 12歳未満
    
    // 代表者の年齢をチェック
    if (Number(age) <= 11) {
      childCount++;
    } else {
      adultCount++;
    }
    
    // 追加参加者の年齢をチェック
    if (participants && participants.length > 0) {
      participants.forEach((participant: any) => {
        if (participant.age <= 11) {
          childCount++;
        } else {
          adultCount++;
        }
      });
    }
    
    // line_itemsを作成
    const lineItems: any[] = [];
    
    // 大人（12歳以上）の参加費を追加
    if (adultCount > 0) {
      lineItems.push({
        price_data: {
          currency: 'usd',
          product_data: {
            name: '運動会参加費 (12歳以上)',
            description: '12歳以上の参加者',
          },
          unit_amount: 2000, // $20.00
        },
        quantity: adultCount,
      });
    }
    
    // 子供（12歳未満）の参加費を追加（無料だが表示のために含める）
    if (childCount > 0) {
      lineItems.push({
        price_data: {
          currency: 'usd',
          product_data: {
            name: '運動会参加費 (12歳未満)',
            description: '12歳未満の参加者 (無料)',
          },
          unit_amount: 0, // $0.00（無料）
        },
        quantity: childCount,
      });
    }
    
    // 参加者情報をJSON文字列に変換
    const participantsInfo = JSON.stringify(participants || [])
    
    // 選択したイベントをカンマ区切りの文字列に変換
    const eventsString = Array.isArray(events) ? events.join(', ') : ''
    
    // Stripeセッションを作成
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL || 'https://sports-festival-r16r05e2s-hatones-projects.vercel.app'}/${lang}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL || 'https://sports-festival-r16r05e2s-hatones-projects.vercel.app'}/${lang}/payment-cancel`,
      customer_email: email,
      metadata: {
        name: name,
        email: email,
        phone: phone || '',
        gender: gender || '',
        events: eventsString,
        notes: notes || '',
        participantsCount: totalParticipants.toString(),
        adultCount: adultCount.toString(),
        childCount: childCount.toString(),
        participants: participantsInfo.length > 500 ? '参加者情報は長すぎるため省略されました' : participantsInfo,
        language: lang
      },
    })
    
    // Google Sheetsにデータを追加
    try {
      console.log('Google Sheetsにデータを追加します...');
      const sheetResult = await appendToGoogleSheet({
        name,
        age,
        email,
        gender,
        events,
        phone,
        notes,
        participants,
        amount,
        adultCount,
        childCount,
        paymentStatus: 'pending',
        sessionId: session.id
      });
      console.log('Google Sheetsへのデータ追加が完了しました:', sheetResult);
    } catch (sheetError: any) {
      console.error('Google Sheetsへのデータ追加に失敗しました:', sheetError.message);
      if (sheetError.stack) {
        console.error('エラースタックトレース:', sheetError.stack);
      }
      // スプレッドシートへの追加が失敗しても、決済プロセスは継続
    }
    
    return NextResponse.json({ sessionId: session.id })
  } catch (error) {
    console.error('Stripe API Error:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
} 
import { NextResponse } from 'next/server'
import { appendToGoogleSheet } from '../../utils/googleSheets'

export async function POST(request: Request) {
  try {
    const data = await request.json()
    
    // 現在の日時を取得
    const now = new Date()
    const registrationDate = now.toLocaleString('ja-JP', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    }).replace(/\//g, '-')
    
    // イベント情報を文字列に変換
    const eventsString = data.events.join(', ')
    
    // 追加参加者情報を文字列に変換
    let participantsString = ''
    if (data.participants && data.participants.length > 0) {
      participantsString = data.participants.map((p: any) => 
        `${p.name} (${p.age}歳, ${p.gender}) - ${p.events.join(', ')}`
      ).join(' | ')
    }
    
    // スプレッドシートに追加する行データ
    const rowData = [
      registrationDate,                 // 登録日時
      data.name,                        // 代表者名
      data.age,                         // 代表者年齢
      data.gender,                      // 代表者性別
      data.email,                       // メールアドレス
      data.phone || '',                 // 電話番号
      eventsString,                     // 選択イベント
      participantsString,               // 追加参加者情報
      data.clubExperience || '',        // 最終部活経験
      data.exerciseFrequency || '',     // 運動頻度
      data.notes || '',                 // 備考
      'Waiting List',                   // ステータス
      ''                                // StripeセッションID（空欄）
    ]
    
    // Waitingリスト用のシートにデータを追加
    await appendToGoogleSheet({
      ...data,
      sheetName: 'waiting',
      range: 'A:M',
      values: [rowData]
    })
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error adding to waiting list:', error)
    return NextResponse.json(
      { error: 'Failed to add to waiting list' },
      { status: 500 }
    )
  }
} 
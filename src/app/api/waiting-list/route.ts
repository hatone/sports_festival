import { NextResponse } from 'next/server'
import { appendToGoogleSheet } from '../../utils/googleSheets'

export async function POST(request: Request) {
  try {
    console.log('Waitingリストへの登録処理を開始します');
    
    // リクエストボディをパース
    const data = await request.json()
    console.log('リクエストデータを受信:', { name: data.name, email: data.email });
    
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
    const eventsString = Array.isArray(data.events) ? data.events.join(', ') : '';
    
    // 追加参加者情報を文字列に変換
    let participantsString = ''
    if (data.participants && data.participants.length > 0) {
      participantsString = data.participants.map((p: any) => 
        `${p.name} (${p.age}歳, ${p.gender}) - ${Array.isArray(p.events) ? p.events.join(', ') : ''}`
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
    
    console.log('スプレッドシートに追加するデータを準備しました');
    
    try {
      // Waitingリスト用のシートにデータを追加
      console.log('スプレッドシートへのデータ追加を開始します');
      await appendToGoogleSheet({
        sheetId: '1680624835', // waitingシートのID
        range: 'A:M',
        values: [rowData]
      })
      console.log('スプレッドシートへのデータ追加が完了しました');
      
      return NextResponse.json({ success: true })
    } catch (sheetError: any) {
      console.error('スプレッドシートへのデータ追加でエラーが発生しました:', sheetError);
      console.error('エラー詳細:', sheetError.message);
      if (sheetError.response) {
        console.error('レスポンス情報:', sheetError.response.data);
      }
      return NextResponse.json(
        { error: 'スプレッドシートへのデータ追加に失敗しました: ' + sheetError.message },
        { status: 500 }
      )
    }
  } catch (error: any) {
    console.error('Waitingリスト登録処理でエラーが発生しました:', error);
    console.error('エラー詳細:', error.message);
    return NextResponse.json(
      { error: 'Waitingリスト登録に失敗しました: ' + error.message },
      { status: 500 }
    )
  }
} 
import { google } from 'googleapis';

// 環境変数から認証情報を取得
const getAuth = () => {
  try {
    // 環境変数から認証情報を取得
    const credentials = process.env.GOOGLE_SHEETS_CREDENTIALS;
    
    if (!credentials) {
      throw new Error('Google Sheets認証情報が設定されていません');
    }
    
    const parsedCredentials = JSON.parse(credentials);
    
    const auth = new google.auth.JWT(
      parsedCredentials.client_email,
      undefined,
      parsedCredentials.private_key,
      ['https://www.googleapis.com/auth/spreadsheets']
    );
    
    return auth;
  } catch (error) {
    console.error('Google認証エラー:', error);
    throw error;
  }
};

/**
 * 参加登録データをGoogle Sheetsに追加する
 */
export const appendToGoogleSheet = async (data: any) => {
  try {
    const auth = getAuth();
    const sheets = google.sheets({ version: 'v4', auth });
    
    const spreadsheetId = process.env.GOOGLE_SHEETS_ID || '1WLJy_eDXW5xAdKLmAboriMXfAFGvBXsa03tYVfeePVg';
    
    // イベント選択をカンマ区切り文字列に変換
    const eventsString = Array.isArray(data.events) ? data.events.join(', ') : data.events;
    
    // 追加参加者情報を整形
    let participantsString = '';
    if (data.participants && data.participants.length > 0) {
      participantsString = data.participants.map((p: any, index: number) => {
        const pEvents = Array.isArray(p.events) ? p.events.join(', ') : p.events;
        return `参加者${index + 2}: ${p.name} (${p.age}歳, ${p.gender}) - イベント: ${pEvents}`;
      }).join(' | ');
    }
    
    // 現在の日時
    const now = new Date();
    const registrationDate = now.toISOString();
    
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
      data.notes || '',                 // 備考
      data.amount,                      // 合計金額
      data.paymentStatus || 'pending',  // 支払い状況
      data.sessionId || ''              // StripeセッションID
    ];
    
    // シートにデータを追加
    const result = await sheets.spreadsheets.values.append({
      spreadsheetId,
      range: 'Sheet1!A:L',  // スプレッドシートの範囲を指定
      valueInputOption: 'RAW',
      requestBody: {
        values: [rowData]
      }
    });
    
    console.log('スプレッドシートに登録データを追加しました:', result.data);
    return result.data;
    
  } catch (error) {
    console.error('スプレッドシートへのデータ追加エラー:', error);
    throw error;
  }
}; 
import { google } from 'googleapis';

// 環境変数から認証情報を取得
const getAuth = () => {
  try {
    console.log('Google Sheets認証開始...');
    
    // 環境変数から認証情報を取得
    const credentials = process.env.GOOGLE_SHEETS_CREDENTIALS;
    
    if (!credentials) {
      console.error('環境変数 GOOGLE_SHEETS_CREDENTIALS が設定されていません');
      throw new Error('Google Sheets認証情報が設定されていません');
    }
    
    console.log('認証情報が見つかりました。JSONとして解析します...');
    
    try {
      const parsedCredentials = JSON.parse(credentials);
      console.log('認証情報を正常に解析しました。client_email:', parsedCredentials.client_email?.substring(0, 5) + '...');
      
      const auth = new google.auth.JWT(
        parsedCredentials.client_email,
        undefined,
        parsedCredentials.private_key,
        ['https://www.googleapis.com/auth/spreadsheets']
      );
      
      console.log('JWT認証オブジェクトを作成しました');
      return auth;
    } catch (parseError) {
      console.error('認証情報のJSONパースに失敗しました:', parseError);
      throw new Error('認証情報の形式が不正です');
    }
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
    console.log('Google Sheetsへのデータ追加を開始します...');
    
    const auth = getAuth();
    console.log('認証が完了しました。Google Sheets APIを初期化します...');
    
    const sheets = google.sheets({ version: 'v4', auth });
    
    const spreadsheetId = process.env.GOOGLE_SHEETS_ID || '1WLJy_eDXW5xAdKLmAboriMXfAFGvBXsa03tYVfeePVg';
    console.log('スプレッドシートID:', spreadsheetId);
    
    // スプレッドシート情報を取得して最初のシート名を確認
    let sheetName = 'master';
    try {
      const spreadsheetInfo = await sheets.spreadsheets.get({
        spreadsheetId,
        fields: 'sheets.properties'
      });
      
      if (spreadsheetInfo.data.sheets && spreadsheetInfo.data.sheets.length > 0) {
        // @ts-ignore
        sheetName = spreadsheetInfo.data.sheets[0].properties.title;
        console.log('取得したシート名:', sheetName);
      }
    } catch (sheetInfoError) {
      console.error('シート情報の取得に失敗しました。デフォルトのシート名を使用します:', sheetInfoError);
    }
    
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
      data.clubExperience || '',        // 最終部活経験
      data.exerciseFrequency || '',     // 運動頻度
      data.notes || '',                 // 備考
      data.amount,                      // 合計金額
      data.sessionId || ''              // StripeセッションID
    ];
    
    console.log('スプレッドシートに追加するデータを準備しました。データ追加を実行します...');
    console.log(`使用するシート名と範囲: ${sheetName}!A:M`);
    
    try {
      // シートにデータを追加
      const result = await sheets.spreadsheets.values.append({
        spreadsheetId,
        range: `${sheetName}!A:M`,  // 動的に取得したシート名を使用
        valueInputOption: 'RAW',
        requestBody: {
          values: [rowData]
        }
      });
      
      console.log('スプレッドシートにデータを追加しました。レスポンス:', JSON.stringify(result.data));
      return result.data;
    } catch (apiError: any) {
      console.error('Google Sheets API呼び出しエラー:', apiError.message);
      if (apiError.response) {
        console.error('エラーレスポンス:', JSON.stringify(apiError.response.data));
      }
      throw apiError;
    }
  } catch (error: any) {
    console.error('スプレッドシートへのデータ追加エラー:', error.message);
    if (error.stack) {
      console.error('スタックトレース:', error.stack);
    }
    throw error;
  }
}; 
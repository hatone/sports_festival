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
    
    // 環境変数の確認
    if (!process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL) {
      throw new Error('環境変数 GOOGLE_SERVICE_ACCOUNT_EMAIL が設定されていません');
    }
    
    if (!process.env.GOOGLE_PRIVATE_KEY) {
      throw new Error('環境変数 GOOGLE_PRIVATE_KEY が設定されていません');
    }
    
    if (!process.env.GOOGLE_SHEET_ID) {
      throw new Error('環境変数 GOOGLE_SHEET_ID が設定されていません');
    }
    
    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
        private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      },
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    })
    
    console.log('認証情報を設定しました。Google Sheets APIを初期化します...');
    
    const sheets = google.sheets({ version: 'v4', auth })
    
    // レンジの設定
    let rangeString;
    if (data.sheetId) {
      console.log(`シートID ${data.sheetId} が指定されました。シートIDを使用してデータを追加します。`);
      rangeString = `${data.sheetId}!${data.range}`;
    } else if (data.sheetName) {
      console.log(`シート名 ${data.sheetName} が指定されました。シート名を使用してデータを追加します。`);
      rangeString = `${data.sheetName}!${data.range}`;
    } else {
      console.log('シートIDもシート名も指定されていません。デフォルトの範囲を使用します。');
      rangeString = data.range;
    }
    
    console.log(`スプレッドシートID: ${process.env.GOOGLE_SHEET_ID}`);
    console.log(`使用する範囲: ${rangeString}`);
    
    try {
      // スプレッドシートにデータを追加
      const result = await sheets.spreadsheets.values.append({
        spreadsheetId: process.env.GOOGLE_SHEET_ID,
        range: rangeString,
        valueInputOption: 'USER_ENTERED',
        requestBody: {
          values: data.values,
        },
      })
      
      console.log('スプレッドシートにデータを追加しました。', result.data);
      return true
    } catch (apiError: any) {
      console.error('Google Sheets API呼び出しエラー:', apiError.message);
      if (apiError.response) {
        console.error('エラーレスポンス:', apiError.response.data);
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
} 
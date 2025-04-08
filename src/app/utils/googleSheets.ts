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
    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
        private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      },
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    })

    const sheets = google.sheets({ version: 'v4', auth })
    
    // スプレッドシートにデータを追加
    await sheets.spreadsheets.values.append({
      spreadsheetId: process.env.GOOGLE_SHEET_ID,
      range: data.sheetId ? `${data.sheetId}!${data.range}` : data.range,
      valueInputOption: 'USER_ENTERED',
      requestBody: {
        values: data.values,
      },
    })

    return true
  } catch (error) {
    console.error('Error appending to Google Sheet:', error)
    throw error
  }
} 
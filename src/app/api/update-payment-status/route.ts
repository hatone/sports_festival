import { NextResponse } from 'next/server'
import Stripe from 'stripe'
import { google } from 'googleapis'

// 環境変数からStripe APIキーを取得
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-02-24.acacia',
})

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

// スプレッドシートの支払い状況を更新
const updatePaymentStatus = async (sessionId: string, status: string) => {
  try {
    const auth = getAuth();
    const sheets = google.sheets({ version: 'v4', auth });
    
    const spreadsheetId = process.env.GOOGLE_SHEETS_ID || '1WLJy_eDXW5xAdKLmAboriMXfAFGvBXsa03tYVfeePVg';
    
    // スプレッドシートからデータを取得
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: 'Sheet1!A:L',
    });
    
    const rows = response.data.values;
    if (!rows || rows.length === 0) {
      console.log('データが見つかりませんでした');
      return;
    }
    
    // セッションIDが一致する行を検索
    let rowIndex = -1;
    for (let i = 0; i < rows.length; i++) {
      if (rows[i][11] === sessionId) { // 12列目（L列）がセッションID
        rowIndex = i;
        break;
      }
    }
    
    if (rowIndex === -1) {
      console.log(`セッションID ${sessionId} のデータが見つかりませんでした`);
      return;
    }
    
    // 支払い状況を更新
    await sheets.spreadsheets.values.update({
      spreadsheetId,
      range: `Sheet1!K${rowIndex + 1}`, // 11列目（K列）が支払い状況
      valueInputOption: 'RAW',
      requestBody: {
        values: [[status]]
      }
    });
    
    console.log(`セッションID ${sessionId} の支払い状況を ${status} に更新しました`);
    
  } catch (error) {
    console.error('スプレッドシートの更新エラー:', error);
    throw error;
  }
};

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const sessionId = searchParams.get('session_id');
  
  if (!sessionId) {
    return NextResponse.json({ error: 'セッションIDが必要です' }, { status: 400 });
  }
  
  try {
    // Stripeからセッション情報を取得
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    
    // 支払い状況を更新
    if (session.payment_status === 'paid') {
      await updatePaymentStatus(sessionId, 'paid');
      return NextResponse.json({ success: true, status: 'paid' });
    } else {
      await updatePaymentStatus(sessionId, session.payment_status);
      return NextResponse.json({ success: true, status: session.payment_status });
    }
    
  } catch (error) {
    console.error('支払い状況の更新エラー:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
} 
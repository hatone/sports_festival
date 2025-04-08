import { NextResponse } from 'next/server'
import { google } from 'googleapis'

export async function GET() {
  try {
    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
        private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      },
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    })

    const sheets = google.sheets({ version: 'v4', auth })
    
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: process.env.GOOGLE_SHEET_ID,
      range: 'B1', // B1セルの値を取得
    })

    const currentParticipants = parseInt(response.data.values?.[0]?.[0] || '0')
    
    return NextResponse.json({ currentParticipants })
  } catch (error) {
    console.error('Error fetching current participants:', error)
    return NextResponse.json(
      { error: 'Failed to fetch current participants' },
      { status: 500 }
    )
  }
} 
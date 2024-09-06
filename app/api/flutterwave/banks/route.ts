// app/api/flutterwave/banks/route.ts
import { NextResponse } from 'next/server';
import axios from 'axios';

export async function GET() {
  try {
    const response = await axios.get('https://api.flutterwave.com/v3/banks/NG', {
      headers: {
        'Authorization': `Bearer ${process.env.FLUTTERWAVE_SECRET_KEY}`, // Replace with your actual API key
      },
    });

    return NextResponse.json(response.data);
  } catch (error) {
    console.error('Error fetching banks:', error);
    return NextResponse.error();
  }
}

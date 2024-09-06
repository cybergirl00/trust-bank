// app/api/flutterwave/fetchBalance/route.ts
import { NextResponse } from 'next/server';
import axios from 'axios';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const accountRef = searchParams.get('accountRef');

  console.log('Account Reference:', accountRef); // Log the account reference

  if (!accountRef) {
    return NextResponse.json({ error: 'Account reference is required' }, { status: 400 });
  }

  try {
    const response = await axios.get(
      `https://api.flutterwave.com/v3/payout-subaccounts/${accountRef}/balances`,
      {
        headers: {
          Authorization: `Bearer ${process.env.FLUTTERWAVE_SECRET_KEY}`, // Ensure this key is correct
        },
      }
    );

    console.log('API Response:', response.data); // Log the API response
    return NextResponse.json(response.data);
  } catch (error) {
    console.error('Error details:', error); // Log the error details
    const errorMessage = (error as any).response?.data?.message || 'An unknown error occurred';
    return NextResponse.json({ error: 'Failed to fetch balance', details: errorMessage }, { status: 500 });
  }
}

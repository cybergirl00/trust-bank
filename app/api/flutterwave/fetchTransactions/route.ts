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
      `https://api.flutterwave.com/v3/payout-subaccounts/${accountRef}/transactions`,
      {
        headers: {
          Authorization: `Bearer ${process.env.FLUTTERWAVE_SECRET_KEY}`,
        },
      }
    );

    return NextResponse.json(response.data);
  } catch (error) {
    console.error('Error fetching transactions:', error); // Log error details
    const errorMessage = (error as any).message || 'An unknown error occurred';
    return NextResponse.json({ error: 'Failed to fetch transactions', details: errorMessage }, { status: 500 });
  }
}

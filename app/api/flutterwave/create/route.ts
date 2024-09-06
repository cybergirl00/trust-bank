import { NextResponse } from 'next/server';
import axios from 'axios';

export async function POST(request: Request) {
  const { email, account_name, mobilenumber } = await request.json();

  try {
    const response = await axios.post(
      'https://api.flutterwave.com/v3/payout-subaccounts',
      {
        account_name,
        email,
        mobilenumber,
        country: 'NG'
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.FLUTTERWAVE_SECRET_KEY}`,
        },
      }
    );

    return NextResponse.json(response.data);
  } catch (error) {
    if (axios.isAxiosError(error)) {
      // Handle Axios-specific errors
      console.error('Error creating payout subaccount:', error.response ? error.response.data : error.message);
      return NextResponse.json({ error: 'Failed to create payout subaccount', details: error.response ? error.response.data : error.message }, { status: 500 });
    } else if (error instanceof Error) {
      // Handle generic errors
      console.error('Error creating payout subaccount:', error.message);
      return NextResponse.json({ error: 'Failed to create payout subaccount', details: error.message }, { status: 500 });
    } else {
      // Handle unknown errors
      console.error('Unexpected error:', error);
      return NextResponse.json({ error: 'Failed to create payout subaccount', details: 'An unknown error occurred' }, { status: 500 });
    }
  }
}

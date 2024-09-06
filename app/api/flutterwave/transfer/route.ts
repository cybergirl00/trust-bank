import { NextResponse } from 'next/server';
import axios from 'axios';

export async function POST(req: Request) {
  try {
    const body = await req.json(); // Get request payload
    const response = await axios.post('https://api.flutterwave.com/v3/transfers', {
      account_bank: body.account_bank,
      account_number: body.account_number,
      amount: body.amount,
      narration: body.narration,
      reference: body.reference,
      debit_subaccount: body.debit_subaccount
    }, {
      headers: {
        'Authorization': `Bearer ${process.env.FLUTTERWAVE_SECRET_KEY}`,
        'Content-Type': 'application/json',
      },
    });

    return NextResponse.json(response.data);
  } catch (error) {
    console.error('Transfer Error:', error);

    if (axios.isAxiosError(error)) {
      // If the error is an AxiosError
      return NextResponse.json({
        error: 'Transfer failed',
        details: error.response ? error.response.data : 'Unknown error'
      }, { status: 500 });
    } else if (error instanceof Error) {
      // If it's a general error
      return NextResponse.json({
        error: 'Transfer failed',
        details: error.message
      }, { status: 500 });
    } else {
      // If it's some unknown type of error
      return NextResponse.json({
        error: 'Transfer failed',
        details: 'Unknown error'
      }, { status: 500 });
    }
  }
}

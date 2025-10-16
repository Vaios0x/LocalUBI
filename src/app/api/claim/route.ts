import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { address, amount } = body;

    // Validate required fields
    if (!address || !amount) {
      return NextResponse.json(
        { error: 'Address and amount are required' },
        { status: 400 }
      );
    }

    // Mock claim processing - replace with actual blockchain interaction
    const claimRecord = {
      id: Math.random().toString(36).substr(2, 9),
      address,
      amount: parseInt(amount),
      txHash: `0x${Math.random().toString(16).slice(2, 10)}`,
      timestamp: new Date().toISOString(),
      status: 'success'
    };

    // Simulate processing time
    await new Promise(resolve => setTimeout(resolve, 1000));

    return NextResponse.json(claimRecord, { status: 201 });
  } catch (error) {
    console.error('Error processing claim:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const address = searchParams.get('address');

    if (!address) {
      return NextResponse.json(
        { error: 'Address parameter is required' },
        { status: 400 }
      );
    }

    // Mock claim history - replace with actual database query
    const claimHistory = [
      {
        id: '1',
        amount: 50,
        txHash: '0x1234...5678',
        timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
        status: 'success'
      },
      {
        id: '2',
        amount: 50,
        txHash: '0x8765...4321',
        timestamp: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString(),
        status: 'success'
      },
      {
        id: '3',
        amount: 50,
        txHash: '0x1111...2222',
        timestamp: new Date(Date.now() - 72 * 60 * 60 * 1000).toISOString(),
        status: 'success'
      }
    ];

    return NextResponse.json({ claims: claimHistory });
  } catch (error) {
    console.error('Error fetching claim history:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

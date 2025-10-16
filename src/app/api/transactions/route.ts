import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const address = searchParams.get('address');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');

    if (!address) {
      return NextResponse.json(
        { error: 'Address parameter is required' },
        { status: 400 }
      );
    }

    // Mock transaction data - replace with actual database query
    const transactions = [
      {
        id: '1',
        type: 'received',
        amount: 50,
        currency: 'G$',
        description: 'UBI Diario',
        txHash: '0x1234...5678',
        timestamp: new Date().toISOString(),
        status: 'confirmed'
      },
      {
        id: '2',
        type: 'sent',
        amount: 500,
        currency: 'G$',
        description: 'Pago Tanda #3',
        txHash: '0x8765...4321',
        timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
        status: 'confirmed'
      },
      {
        id: '3',
        type: 'received',
        amount: 5000,
        currency: 'G$',
        description: 'Payout Tanda #2',
        txHash: '0x1111...2222',
        timestamp: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString(),
        status: 'confirmed'
      },
      {
        id: '4',
        type: 'sent',
        amount: 200,
        currency: 'G$',
        description: 'Compra Marketplace',
        txHash: '0x3333...4444',
        timestamp: new Date(Date.now() - 72 * 60 * 60 * 1000).toISOString(),
        status: 'confirmed'
      },
      {
        id: '5',
        type: 'received',
        amount: 50,
        currency: 'G$',
        description: 'UBI Diario',
        txHash: '0x5555...6666',
        timestamp: new Date(Date.now() - 96 * 60 * 60 * 1000).toISOString(),
        status: 'confirmed'
      }
    ];

    // Paginate results
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedTransactions = transactions.slice(startIndex, endIndex);

    return NextResponse.json({
      transactions: paginatedTransactions,
      pagination: {
        page,
        limit,
        total: transactions.length,
        pages: Math.ceil(transactions.length / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching transactions:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

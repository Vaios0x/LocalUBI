import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    // Get query parameters
    const { searchParams } = new URL(request.url);
    const address = searchParams.get('address');

    if (!address) {
      return NextResponse.json(
        { error: 'Address parameter is required' },
        { status: 400 }
      );
    }

    // Mock user data - replace with actual database query
    const user = {
      address,
      ensName: null,
      balance: '1250.50',
      totalClaimed: 1250,
      streak: 25,
      joinDate: new Date('2024-01-15').toISOString(),
      tandas: {
        active: 2,
        completed: 1,
        total: 3
      },
      stats: {
        totalSaved: 5000,
        totalSpent: 2500,
        transactions: 45
      }
    };

    return NextResponse.json(user);
  } catch (error) {
    console.error('Error fetching user:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { address, ensName } = body;

    // Validate required fields
    if (!address) {
      return NextResponse.json(
        { error: 'Address is required' },
        { status: 400 }
      );
    }

    // Mock user creation - replace with actual database operation
    const newUser = {
      address,
      ensName: ensName || null,
      balance: '0',
      totalClaimed: 0,
      streak: 0,
      joinDate: new Date().toISOString(),
      tandas: {
        active: 0,
        completed: 0,
        total: 0
      },
      stats: {
        totalSaved: 0,
        totalSpent: 0,
        transactions: 0
      }
    };

    return NextResponse.json(newUser, { status: 201 });
  } catch (error) {
    console.error('Error creating user:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

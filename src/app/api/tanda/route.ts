import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    // Get query parameters
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const status = searchParams.get('status') || 'all';

    // Mock data - replace with actual database query
    const tandas = [
      {
        id: 1,
        name: 'Tanda Familia González',
        description: 'Tanda familiar para ahorro navideño',
        monthlyAmount: 1000,
        maxMembers: 8,
        currentMembers: 6,
        isActive: true,
        isCompleted: false,
        creator: '0x1234...5678',
        startTime: new Date().toISOString(),
      },
      {
        id: 2,
        name: 'Tanda Vecinos Colonia',
        description: 'Ahorro comunitario para mejoras',
        monthlyAmount: 500,
        maxMembers: 12,
        currentMembers: 12,
        isActive: true,
        isCompleted: false,
        creator: '0x8765...4321',
        startTime: new Date().toISOString(),
      },
    ];

    // Filter by status
    const filteredTandas = status === 'all' 
      ? tandas 
      : tandas.filter(t => 
          status === 'active' ? t.isActive && !t.isCompleted :
          status === 'completed' ? t.isCompleted :
          status === 'available' ? !t.isActive && t.currentMembers < t.maxMembers :
          tandas
        );

    // Paginate
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedTandas = filteredTandas.slice(startIndex, endIndex);

    return NextResponse.json({
      tandas: paginatedTandas,
      pagination: {
        page,
        limit,
        total: filteredTandas.length,
        pages: Math.ceil(filteredTandas.length / limit),
      },
    });
  } catch (error) {
    console.error('Error fetching tandas:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, description, monthlyAmount, maxMembers, frequency } = body;

    // Validate required fields
    if (!name || !monthlyAmount || !maxMembers || !frequency) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Validate amounts
    if (monthlyAmount < 100) {
      return NextResponse.json(
        { error: 'Monthly amount too low (minimum 100 G$)' },
        { status: 400 }
      );
    }

    if (maxMembers < 3 || maxMembers > 20) {
      return NextResponse.json(
        { error: 'Invalid member count (3-20 members)' },
        { status: 400 }
      );
    }

    // Mock creation - replace with actual contract interaction
    const newTanda = {
      id: Math.floor(Math.random() * 1000) + 1,
      name,
      description,
      monthlyAmount,
      maxMembers,
      currentMembers: 1,
      isActive: false,
      isCompleted: false,
      creator: '0x1234...5678', // Get from wallet
      createdAt: new Date().toISOString(),
    };

    return NextResponse.json(newTanda, { status: 201 });
  } catch (error) {
    console.error('Error creating tanda:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

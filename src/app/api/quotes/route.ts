import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// GET /api/quotes - Get all quotes or a random quote
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const random = searchParams.get('random');
    
    if (random === 'true') {
      // Get a random quote
      const count = await prisma.motivationalQuote.count();
      
      if (count === 0) {
        return NextResponse.json(null);
      }
      
      const skip = Math.floor(Math.random() * count);
      const quotes = await prisma.motivationalQuote.findMany({
        take: 1,
        skip,
      });
      
      return NextResponse.json(quotes[0] || null);
    }
    
    // Get all quotes
    const quotes = await prisma.motivationalQuote.findMany({
      orderBy: { createdAt: 'desc' },
    });
    
    return NextResponse.json(quotes);
  } catch (error) {
    console.error('Error fetching quotes:', error);
    return NextResponse.json(
      { error: 'Failed to fetch quotes' },
      { status: 500 }
    );
  }
}

// POST /api/quotes - Create a new quote
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { content, author, isFavorite } = body;
    
    if (!content) {
      return NextResponse.json(
        { error: 'Content is required' },
        { status: 400 }
      );
    }
    
    const quote = await prisma.motivationalQuote.create({
      data: {
        content,
        author: author || null,
        isFavorite: isFavorite || false,
      },
    });
    
    return NextResponse.json(quote, { status: 201 });
  } catch (error) {
    console.error('Error creating quote:', error);
    return NextResponse.json(
      { error: 'Failed to create quote' },
      { status: 500 }
    );
  }
}

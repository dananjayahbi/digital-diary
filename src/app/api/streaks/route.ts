import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// GET /api/streaks - Get all streaks
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');
    
    let whereClause = {};
    if (type) {
      whereClause = { type };
    }
    
    const streaks = await prisma.streak.findMany({
      where: whereClause,
    });
    
    // Also get active days for journal streak (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const diaryEntries = await prisma.diaryEntry.findMany({
      where: {
        date: {
          gte: thirtyDaysAgo,
        },
      },
      select: {
        date: true,
      },
      distinct: ['date'],
    });
    
    const activeDays = diaryEntries.map(entry => entry.date);
    
    return NextResponse.json({ streaks, activeDays });
  } catch (error) {
    console.error('Error fetching streaks:', error);
    return NextResponse.json(
      { error: 'Failed to fetch streaks' },
      { status: 500 }
    );
  }
}

// POST /api/streaks - Create or update a streak
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { type } = body;
    
    if (!type) {
      return NextResponse.json(
        { error: 'Type is required' },
        { status: 400 }
      );
    }
    
    // Find existing streak or create new one
    let streak = await prisma.streak.findFirst({
      where: { type },
    });
    
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    
    if (!streak) {
      streak = await prisma.streak.create({
        data: {
          type,
          currentStreak: 1,
          longestStreak: 1,
          lastActivityAt: now,
        },
      });
    } else {
      const lastActivity = streak.lastActivityAt;
      
      if (lastActivity) {
        const lastActivityDate = new Date(
          lastActivity.getFullYear(),
          lastActivity.getMonth(),
          lastActivity.getDate()
        );
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);
        
        if (lastActivityDate.getTime() === today.getTime()) {
          // Already recorded today
          return NextResponse.json(streak);
        } else if (lastActivityDate.getTime() === yesterday.getTime()) {
          // Consecutive day
          const newStreak = streak.currentStreak + 1;
          streak = await prisma.streak.update({
            where: { id: streak.id },
            data: {
              currentStreak: newStreak,
              longestStreak: Math.max(newStreak, streak.longestStreak),
              lastActivityAt: now,
            },
          });
        } else {
          // Streak broken
          streak = await prisma.streak.update({
            where: { id: streak.id },
            data: {
              currentStreak: 1,
              lastActivityAt: now,
            },
          });
        }
      } else {
        streak = await prisma.streak.update({
          where: { id: streak.id },
          data: {
            currentStreak: 1,
            lastActivityAt: now,
          },
        });
      }
    }
    
    return NextResponse.json(streak);
  } catch (error) {
    console.error('Error updating streak:', error);
    return NextResponse.json(
      { error: 'Failed to update streak' },
      { status: 500 }
    );
  }
}

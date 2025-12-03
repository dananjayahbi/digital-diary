import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// GET /api/diary - Get diary entries with optional date filter
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const dateParam = searchParams.get('date');
    const limit = searchParams.get('limit');
    
    let whereClause = {};
    
    if (dateParam) {
      const date = new Date(dateParam);
      const startOfDay = new Date(date);
      startOfDay.setHours(0, 0, 0, 0);
      const endOfDay = new Date(date);
      endOfDay.setHours(23, 59, 59, 999);
      
      whereClause = {
        date: {
          gte: startOfDay,
          lte: endOfDay,
        },
      };
    }
    
    const entries = await prisma.diaryEntry.findMany({
      where: whereClause,
      orderBy: { date: 'desc' },
      take: limit ? parseInt(limit) : undefined,
    });
    
    return NextResponse.json(entries);
  } catch (error) {
    console.error('Error fetching diary entries:', error);
    return NextResponse.json(
      { error: 'Failed to fetch diary entries' },
      { status: 500 }
    );
  }
}

// POST /api/diary - Create a new diary entry
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      title,
      content,
      mood,
      moodScore,
      prompt,
      weather,
      location,
      date,
    } = body;
    
    if (!content) {
      return NextResponse.json(
        { error: 'Content is required' },
        { status: 400 }
      );
    }
    
    const entry = await prisma.diaryEntry.create({
      data: {
        title,
        content,
        mood,
        moodScore,
        prompt,
        weather,
        location,
        date: date ? new Date(date) : new Date(),
      },
    });
    
    // Update streak when creating a diary entry
    await updateJournalStreak();
    
    return NextResponse.json(entry, { status: 201 });
  } catch (error) {
    console.error('Error creating diary entry:', error);
    return NextResponse.json(
      { error: 'Failed to create diary entry' },
      { status: 500 }
    );
  }
}

// Helper function to update journal streak
async function updateJournalStreak() {
  try {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    // Find or create journal streak
    let streak = await prisma.streak.findFirst({
      where: { type: 'journal' },
    });
    
    if (!streak) {
      // Create new streak if doesn't exist
      streak = await prisma.streak.create({
        data: {
          type: 'journal',
          currentStreak: 1,
          longestStreak: 1,
          lastActivityAt: now,
        },
      });
      return streak;
    }
    
    const lastActivity = streak.lastActivityAt;
    
    if (!lastActivity) {
      // First activity
      await prisma.streak.update({
        where: { id: streak.id },
        data: {
          currentStreak: 1,
          longestStreak: Math.max(1, streak.longestStreak),
          lastActivityAt: now,
        },
      });
    } else {
      const lastActivityDate = new Date(
        lastActivity.getFullYear(),
        lastActivity.getMonth(),
        lastActivity.getDate()
      );
      
      if (lastActivityDate.getTime() === today.getTime()) {
        // Already logged today, no change
        return streak;
      } else if (lastActivityDate.getTime() === yesterday.getTime()) {
        // Consecutive day - increment streak
        const newStreak = streak.currentStreak + 1;
        await prisma.streak.update({
          where: { id: streak.id },
          data: {
            currentStreak: newStreak,
            longestStreak: Math.max(newStreak, streak.longestStreak),
            lastActivityAt: now,
          },
        });
      } else {
        // Streak broken - reset to 1
        await prisma.streak.update({
          where: { id: streak.id },
          data: {
            currentStreak: 1,
            lastActivityAt: now,
          },
        });
      }
    }
    
    return streak;
  } catch (error) {
    console.error('Error updating journal streak:', error);
  }
}

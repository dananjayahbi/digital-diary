import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// Sri Lanka Standard Time offset: UTC+5:30 (5.5 hours = 330 minutes)
const SLST_OFFSET_MINUTES = 330;

// Helper function to get start of day in SLST timezone, returned as UTC
function getStartOfDayInSLST(year: number, month: number, day: number): Date {
  // Create date at midnight in local time, then convert to UTC
  // Start of day in SLST is 00:00 SLST = 18:30 previous day UTC (or -5:30 hours)
  const utcDate = new Date(Date.UTC(year, month - 1, day, 0, 0, 0, 0));
  // Subtract SLST offset to get the UTC equivalent of midnight in SLST
  utcDate.setUTCMinutes(utcDate.getUTCMinutes() - SLST_OFFSET_MINUTES);
  return utcDate;
}

// Helper function to get end of day in SLST timezone, returned as UTC
function getEndOfDayInSLST(year: number, month: number, day: number): Date {
  // End of day in SLST is 23:59:59.999 SLST
  const utcDate = new Date(Date.UTC(year, month - 1, day, 23, 59, 59, 999));
  // Subtract SLST offset to get the UTC equivalent
  utcDate.setUTCMinutes(utcDate.getUTCMinutes() - SLST_OFFSET_MINUTES);
  return utcDate;
}

// Helper function to get the date in SLST for storing
function getDateInSLST(year: number, month: number, day: number): Date {
  // Store the date at noon SLST (to avoid date boundary issues)
  const utcDate = new Date(Date.UTC(year, month - 1, day, 12, 0, 0, 0));
  // Subtract SLST offset to get UTC time that represents noon in SLST
  utcDate.setUTCMinutes(utcDate.getUTCMinutes() - SLST_OFFSET_MINUTES);
  return utcDate;
}

// GET /api/tasks - Get all tasks with optional date filter
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const dateParam = searchParams.get('date');
    
    let whereClause = {};
    
    if (dateParam) {
      // Parse the date string (YYYY-MM-DD format) 
      const [year, month, day] = dateParam.split('-').map(Number);
      
      // Get start and end of day in SLST timezone
      const startOfDay = getStartOfDayInSLST(year, month, day);
      const endOfDay = getEndOfDayInSLST(year, month, day);
      
      whereClause = {
        date: {
          gte: startOfDay,
          lte: endOfDay,
        },
      };
    }
    
    const tasks = await prisma.task.findMany({
      where: whereClause,
      include: {
        category: true,
      },
      orderBy: [
        { startTime: 'asc' },
        { order: 'asc' },
      ],
    });
    
    return NextResponse.json(tasks);
  } catch (error) {
    console.error('Error fetching tasks:', error);
    return NextResponse.json(
      { error: 'Failed to fetch tasks' },
      { status: 500 }
    );
  }
}

// POST /api/tasks - Create a new task
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      title,
      description,
      startTime,
      endTime,
      duration,
      priority,
      categoryId,
      date,
    } = body;
    
    if (!title) {
      return NextResponse.json(
        { error: 'Title is required' },
        { status: 400 }
      );
    }
    
    // Parse the date properly - handle both ISO string and date string formats
    let taskDate: Date;
    if (date) {
      const dateStr = date.split('T')[0]; // Get YYYY-MM-DD part
      const [year, month, day] = dateStr.split('-').map(Number);
      // Store the date using SLST timezone reference
      taskDate = getDateInSLST(year, month, day);
    } else {
      // Get current date in SLST
      const now = new Date();
      // Add SLST offset to get the current date in Sri Lanka
      const slstNow = new Date(now.getTime() + SLST_OFFSET_MINUTES * 60 * 1000);
      taskDate = getDateInSLST(slstNow.getUTCFullYear(), slstNow.getUTCMonth() + 1, slstNow.getUTCDate());
    }
    
    // Get the max order for the day to append at the end
    // Parse taskDate to get year, month, day in SLST
    const slstTaskDate = new Date(taskDate.getTime() + SLST_OFFSET_MINUTES * 60 * 1000);
    const year = slstTaskDate.getUTCFullYear();
    const month = slstTaskDate.getUTCMonth() + 1;
    const day = slstTaskDate.getUTCDate();
    
    const startOfDay = getStartOfDayInSLST(year, month, day);
    const endOfDay = getEndOfDayInSLST(year, month, day);
    
    const maxOrder = await prisma.task.aggregate({
      _max: { order: true },
      where: {
        date: {
          gte: startOfDay,
          lte: endOfDay,
        },
      },
    });
    
    const task = await prisma.task.create({
      data: {
        title,
        description,
        startTime: startTime ? new Date(startTime) : null,
        endTime: endTime ? new Date(endTime) : null,
        duration,
        priority: priority || 'medium',
        categoryId,
        date: taskDate,
        order: (maxOrder._max.order ?? -1) + 1,
      },
      include: {
        category: true,
      },
    });
    
    return NextResponse.json(task, { status: 201 });
  } catch (error) {
    console.error('Error creating task:', error);
    return NextResponse.json(
      { error: 'Failed to create task' },
      { status: 500 }
    );
  }
}

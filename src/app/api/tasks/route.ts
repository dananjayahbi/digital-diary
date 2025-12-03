import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// GET /api/tasks - Get all tasks with optional date filter
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const dateParam = searchParams.get('date');
    
    let whereClause = {};
    
    if (dateParam) {
      const date = new Date(dateParam);
      const startOfDay = new Date(date.setHours(0, 0, 0, 0));
      const endOfDay = new Date(date.setHours(23, 59, 59, 999));
      
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
    
    // Get the max order for the day to append at the end
    const maxOrder = await prisma.task.aggregate({
      _max: { order: true },
      where: {
        date: date ? new Date(date) : new Date(),
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
        date: date ? new Date(date) : new Date(),
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

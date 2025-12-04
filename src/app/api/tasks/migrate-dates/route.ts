import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// Sri Lanka Standard Time offset: UTC+5:30 (5.5 hours = 330 minutes)
const SLST_OFFSET_MINUTES = 330;

// This endpoint migrates existing task dates to use SLST timezone reference
// It converts dates that were stored in UTC to their SLST equivalent
export async function POST(request: NextRequest) {
  try {
    // Get all tasks
    const tasks = await prisma.task.findMany({
      select: {
        id: true,
        date: true,
        createdAt: true,
      },
    });

    const updates = [];

    for (const task of tasks) {
      // The date was stored in UTC, but we need it to represent the date in SLST
      // If the task was created on Dec 4th at 22:00 UTC, that's Dec 5th 03:30 SLST
      // So we need to adjust the date to reflect the correct SLST date
      
      const originalDate = new Date(task.date);
      const createdAt = new Date(task.createdAt);
      
      // Convert createdAt to SLST to determine what date it actually was in Sri Lanka
      const slstCreatedAt = new Date(createdAt.getTime() + SLST_OFFSET_MINUTES * 60 * 1000);
      
      // Get the SLST date components from createdAt
      const year = slstCreatedAt.getUTCFullYear();
      const month = slstCreatedAt.getUTCMonth();
      const day = slstCreatedAt.getUTCDate();
      
      // Create a new date at noon SLST for this date
      // Noon SLST = 06:30 UTC
      const correctedDate = new Date(Date.UTC(year, month, day, 6, 30, 0, 0));
      
      // Only update if the date is different
      if (originalDate.getTime() !== correctedDate.getTime()) {
        updates.push({
          id: task.id,
          originalDate: originalDate.toISOString(),
          correctedDate: correctedDate.toISOString(),
          createdAt: createdAt.toISOString(),
        });
        
        // Update the task
        await prisma.task.update({
          where: { id: task.id },
          data: { date: correctedDate },
        });
      }
    }

    return NextResponse.json({
      message: `Successfully migrated ${updates.length} tasks`,
      updates,
    });
  } catch (error) {
    console.error('Error migrating task dates:', error);
    return NextResponse.json(
      { error: 'Failed to migrate task dates' },
      { status: 500 }
    );
  }
}

// GET endpoint to preview the changes without applying them
export async function GET(request: NextRequest) {
  try {
    const tasks = await prisma.task.findMany({
      select: {
        id: true,
        title: true,
        date: true,
        createdAt: true,
      },
    });

    const preview = tasks.map((task) => {
      const originalDate = new Date(task.date);
      const createdAt = new Date(task.createdAt);
      
      // Convert createdAt to SLST
      const slstCreatedAt = new Date(createdAt.getTime() + SLST_OFFSET_MINUTES * 60 * 1000);
      
      const year = slstCreatedAt.getUTCFullYear();
      const month = slstCreatedAt.getUTCMonth();
      const day = slstCreatedAt.getUTCDate();
      
      // Create a new date at noon SLST for this date (06:30 UTC)
      const correctedDate = new Date(Date.UTC(year, month, day, 6, 30, 0, 0));
      
      return {
        id: task.id,
        title: task.title,
        originalDate: originalDate.toISOString(),
        originalDateLocal: originalDate.toLocaleDateString('en-US', { 
          timeZone: 'Asia/Colombo',
          year: 'numeric', 
          month: 'short', 
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        }),
        correctedDate: correctedDate.toISOString(),
        correctedDateLocal: correctedDate.toLocaleDateString('en-US', { 
          timeZone: 'Asia/Colombo',
          year: 'numeric', 
          month: 'short', 
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        }),
        createdAt: createdAt.toISOString(),
        createdAtSLST: slstCreatedAt.toISOString(),
        needsUpdate: originalDate.getTime() !== correctedDate.getTime(),
      };
    });

    return NextResponse.json({
      totalTasks: tasks.length,
      tasksNeedingUpdate: preview.filter(p => p.needsUpdate).length,
      preview,
    });
  } catch (error) {
    console.error('Error previewing task date migration:', error);
    return NextResponse.json(
      { error: 'Failed to preview task date migration' },
      { status: 500 }
    );
  }
}

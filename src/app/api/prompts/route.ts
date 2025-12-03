import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// Default prompts to seed if none exist
const defaultPrompts = [
  { content: "I slow down to hear the flowers bloom and feel the gentle touch of the breeze.", category: "mindfulness" },
  { content: "What are three things you're grateful for today?", category: "gratitude" },
  { content: "Describe a moment today that made you smile.", category: "reflection" },
  { content: "What would you tell your younger self?", category: "reflection" },
  { content: "What's one small step you can take today toward your dreams?", category: "motivation" },
  { content: "Notice five things you can see, four you can touch, three you can hear, two you can smell, and one you can taste.", category: "mindfulness" },
  { content: "What does your ideal day look like?", category: "reflection" },
  { content: "Write about something that's been on your mind lately.", category: "reflection" },
  { content: "What lesson did today teach you?", category: "reflection" },
  { content: "List three things that brought you peace today.", category: "gratitude" },
];

// GET /api/prompts - Get a random daily prompt
export async function GET() {
  try {
    // Check if we have any prompts
    const count = await prisma.dailyPrompt.count({
      where: { isActive: true },
    });
    
    // Seed default prompts if none exist
    if (count === 0) {
      await prisma.dailyPrompt.createMany({
        data: defaultPrompts,
      });
    }
    
    // Get a random active prompt
    // Use a simple approach: get all and pick random
    const prompts = await prisma.dailyPrompt.findMany({
      where: { isActive: true },
    });
    
    if (prompts.length === 0) {
      return NextResponse.json({ content: "Take a moment to reflect on your day." });
    }
    
    // Use date as seed for consistent daily prompt
    const today = new Date();
    const seed = today.getFullYear() * 10000 + (today.getMonth() + 1) * 100 + today.getDate();
    const index = seed % prompts.length;
    
    return NextResponse.json(prompts[index]);
  } catch (error) {
    console.error('Error fetching prompt:', error);
    return NextResponse.json(
      { error: 'Failed to fetch prompt' },
      { status: 500 }
    );
  }
}

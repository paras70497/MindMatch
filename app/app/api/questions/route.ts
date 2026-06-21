import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Question from '@/models/Question';

export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const category = searchParams.get('category');
    const limit = parseInt(searchParams.get('limit') || '10');
    
    const filter: Record<string, unknown> = { isActive: true };
    if (category && category !== 'random') {
      filter.category = category;
    }

    const questions = await Question.aggregate([
      { $match: filter },
      { $sample: { size: limit } },
    ]);

    return NextResponse.json({ questions });
  } catch (error) {
    console.error('GET /api/questions error:', error);
    return NextResponse.json({ error: 'Failed to fetch questions' }, { status: 500 });
  }
}

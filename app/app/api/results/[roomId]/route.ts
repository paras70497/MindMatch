import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Result from '@/models/Result';

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ roomId: string }> }
) {
  try {
    await connectDB();
    const { roomId } = await params;
    
    const result = await Result.findOne({ roomId });
    
    if (!result) {
      return NextResponse.json({ error: 'Results not found' }, { status: 404 });
    }

    return NextResponse.json(result.toObject());
  } catch (error) {
    console.error('GET /api/results/[roomId] error:', error);
    return NextResponse.json({ error: 'Failed to fetch results' }, { status: 500 });
  }
}

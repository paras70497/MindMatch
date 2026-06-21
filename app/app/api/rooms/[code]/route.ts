import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Room from '@/models/Room';

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ code: string }> }
) {
  try {
    await connectDB();
    const { code } = await params;
    
    const room = await Room.findOne({ code: code.toUpperCase() });
    
    if (!room) {
      return NextResponse.json({ error: 'Room not found' }, { status: 404 });
    }

    return NextResponse.json({
      roomId: room._id.toString(),
      code: room.code,
      status: room.status,
      players: room.players,
      config: room.config,
      currentQuestionIndex: room.currentQuestionIndex,
    });
  } catch (error) {
    console.error('GET /api/rooms/[code] error:', error);
    return NextResponse.json({ error: 'Failed to fetch room' }, { status: 500 });
  }
}

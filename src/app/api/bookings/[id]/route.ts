import Booking from '@/lib/api-models/Booking';
import { getServerSessionWithAuthOptions } from '@/lib/serverUtils';
import mongoose from 'mongoose';
import { NextRequest, NextResponse } from 'next/server';

export const GET = async (req: NextRequest, { params }: { params: Promise<{ id: string }> }) => {
  try {
    const session = await getServerSessionWithAuthOptions();
    const userId = session?.user?.id;
    const { id } = await params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ message: 'Invalid booking ID' }, { status: 400 });
    }

    const booking = await Booking.findOne({ _id: id, userId });

    if (!booking) {
      return NextResponse.json({ message: 'Booking not found' }, { status: 404 });
    }

    return NextResponse.json(booking);
  } catch (error) {
    console.error('❌ Booking Detail GET error:', (error as Error).message);
    return NextResponse.json(
      { message: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 },
    );
  }
};

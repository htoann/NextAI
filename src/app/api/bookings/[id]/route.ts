import Booking from '@/lib/api-models/Booking';
import { authOptions } from '@/lib/utils';
import mongoose from 'mongoose';
import { getServerSession } from 'next-auth';
import { NextRequest, NextResponse } from 'next/server';

export const GET = async (req: NextRequest, { params }: { params: { id: string } }) => {
  try {
    const session = await getServerSession(authOptions);
    const userId = session?.user?.id;
    const { id } = params;

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

export const DELETE = async (req: NextRequest, { params }: { params: Promise<{ id: string }> }) => {
  try {
    const session = await getServerSession(authOptions);
    const userId = session?.user?.id;
    const { id } = await params;

    const deleted = await Booking.findOneAndDelete({ bookingId: id, userId });

    if (!deleted) {
      return NextResponse.json({ message: 'Booking not found or not authorized' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Booking deleted successfully' });
  } catch (error) {
    console.error('❌ Booking DELETE error:', (error as Error).message);
    return NextResponse.json(
      { message: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 },
    );
  }
};

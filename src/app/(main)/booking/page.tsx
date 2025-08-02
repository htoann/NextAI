'use client';

import { booking } from '@/lib/services/booking';
import { Button, Card, Divider, message, Space, Tag, Typography } from 'antd';
import { useSession } from 'next-auth/react';
import { useState } from 'react';

const { Title } = Typography;

const rows = ['A', 'B', 'C', 'D'];
const seatsPerRow = 8;

const showtimesData: Record<string, string[]> = {
  '02/08/2025': ['14:00', '17:00', '20:00'],
  '03/08/2025': ['15:00', '18:00'],
};

const initialBookedMap: Record<string, string[]> = {
  '02/08/2025|14:00': ['A1', 'A2'],
  '02/08/2025|17:00': ['B1'],
  '03/08/2025|15:00': ['C3'],
};

export default function BookingPage() {
  const { data: session } = useSession();
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [selectedSeat, setSelectedSeat] = useState<string | null>(null);
  const [bookedMap, setBookedMap] = useState(initialBookedMap);
  const [loading, setLoading] = useState(false);

  const showtimeKey = selectedDate && selectedTime ? `${selectedDate}|${selectedTime}` : null;

  const handleSelectSeat = (seatId: string) => {
    if (!showtimeKey || bookedMap[showtimeKey]?.includes(seatId)) return;
    setSelectedSeat(seatId);
  };

  const handleBooking = async () => {
    if (!selectedDate || !selectedTime || !selectedSeat) {
      message.warning('Select date, time and seat first.');
      return;
    }

    setLoading(true);
    try {
      const res = await booking({
        email: session?.user?.email || '',
        seatId: selectedSeat,
        showtimeId: `${selectedDate}|${selectedTime}`,
      });

      if (res.success) {
        message.success(`Seat ${selectedSeat} booked!`);
        setBookedMap((prev) => ({
          ...prev,
          [showtimeKey!]: [...(prev[showtimeKey!] || []), selectedSeat],
        }));
        setSelectedSeat(null);
      } else {
        message.error(res.error || 'Booking failed.');
      }
    } catch (err) {
      message.error('Booking failed: ' + (err as Error).message);
    }
    setLoading(false);
  };

  const renderSeat = (seatId: string) => {
    const isBooked = showtimeKey ? bookedMap[showtimeKey]?.includes(seatId) : false;
    const isSelected = selectedSeat === seatId;

    const seatColors = {
      booked: { background: '#ffccc7', border: undefined },
      selected: { background: '#52c41a', border: '#52c41a' },
      available: { background: undefined, border: undefined },
    };

    const colorConfig = isBooked ? seatColors.booked : isSelected ? seatColors.selected : seatColors.available;

    return (
      <Button
        key={seatId}
        aria-label={`Seat ${seatId} ${isBooked ? 'booked' : isSelected ? 'selected' : 'available'}`}
        disabled={isBooked}
        danger={isBooked}
        onClick={() => handleSelectSeat(seatId)}
        style={{
          width: 48,
          height: 48,
          margin: 4,
          backgroundColor: colorConfig.background,
          borderColor: colorConfig.border,
        }}
      >
        {seatId}
      </Button>
    );
  };
  return (
    <div style={{ padding: '24px', background: '#f9f9f9', minHeight: 'calc(100vh - 56px)' }}>
      <Card style={{ maxWidth: 600, margin: '0 auto' }}>
        <Space direction="vertical" size="large" style={{ width: '100%' }}>
          <Title level={3} style={{ textAlign: 'center', marginBottom: 0 }}>
            🎟 Book Your Seat
          </Title>

          {/* Date buttons */}
          <Space wrap style={{ justifyContent: 'center', marginTop: 8 }}>
            {Object.keys(showtimesData).map((date) => (
              <Button
                key={date}
                type={selectedDate === date ? 'primary' : 'default'}
                onClick={() => {
                  setSelectedDate(date);
                  setSelectedTime(null);
                  setSelectedSeat(null);
                }}
              >
                {date}
              </Button>
            ))}
          </Space>

          {/* Time buttons */}
          {selectedDate && (
            <Space wrap style={{ justifyContent: 'center', marginTop: 4 }}>
              {showtimesData[selectedDate].map((time) => (
                <Button
                  key={time}
                  type={selectedTime === time ? 'primary' : 'default'}
                  onClick={() => {
                    setSelectedTime(time);
                    setSelectedSeat(null);
                  }}
                >
                  {time}
                </Button>
              ))}
            </Space>
          )}

          {/* Seat Grid */}
          {showtimeKey && (
            <>
              <Divider>Screen This Side</Divider>
              <div style={{ textAlign: 'center' }}>
                {rows.map((row) => (
                  <div key={row} style={{ marginBottom: 8 }}>
                    {Array.from({ length: seatsPerRow }).map((_, i) => {
                      const seatId = `${row}${i + 1}`;
                      return renderSeat(seatId);
                    })}
                  </div>
                ))}
              </div>

              <div style={{ textAlign: 'center', marginTop: 8 }}>
                <Space>
                  <Tag color="red">Booked</Tag>
                  <Tag color="green">Selected</Tag>
                  <Tag>Available</Tag>
                </Space>
              </div>

              {selectedSeat && (
                <div style={{ textAlign: 'center' }}>
                  <Tag color="green" style={{ fontSize: 16 }}>
                    Seat: {selectedSeat}
                  </Tag>
                </div>
              )}

              <Button type="primary" block disabled={!selectedSeat} loading={loading} onClick={handleBooking}>
                {selectedSeat ? `Book Seat ${selectedSeat}` : 'Select a seat'}
              </Button>
            </>
          )}
        </Space>
      </Card>
    </div>
  );
}

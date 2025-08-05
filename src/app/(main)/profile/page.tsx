'use client';

import { deleteBooking, getBookingList } from '@/lib/services/booking';
import { BookingResponse } from '@/types';
import { CalendarOutlined, DeleteOutlined, ExclamationCircleOutlined, UserOutlined } from '@ant-design/icons';
import { Button, Card, Divider, List, Modal, Space, Spin, Tabs, Tag, Typography, message } from 'antd';
import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';

const { Title, Text } = Typography;
const { confirm } = Modal;

export default function ProfilePage() {
  const { data } = useSession();
  const [bookings, setBookings] = useState<BookingResponse[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const res = await getBookingList();
      setBookings(res);
    } catch (err) {
      console.error('❌ Failed to load bookings:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleDelete = (bookingId: string) => {
    confirm({
      title: 'Delete this booking?',
      icon: <ExclamationCircleOutlined />,
      content: 'This action cannot be undone.',
      okType: 'danger',
      onOk: async () => {
        const key = 'deleteMsg';
        try {
          await deleteBooking(bookingId);
          setBookings((prev) => prev.filter((b) => b.bookingId !== bookingId));
          message.success({ content: 'Deleted successfully', key });
        } catch (err) {
          console.error('❌ Delete failed:', err);
          message.error({ content: 'Failed to delete', key });
        }
      },
      centered: true,
    });
  };

  return (
    <div style={{ padding: 32, maxWidth: 900, margin: '0 auto' }}>
      <Title level={2}>Profile</Title>

      <Card>
        <Tabs
          defaultActiveKey="info"
          items={[
            {
              key: 'info',
              label: (
                <span>
                  <UserOutlined /> Personal Info
                </span>
              ),
              children: (
                <Space direction="vertical" size="middle">
                  <Text>
                    <strong>Full Name:</strong> {data?.user?.name || 'N/A'}
                  </Text>
                  <Text>
                    <strong>Email:</strong> {data?.user?.email || 'N/A'}
                  </Text>
                </Space>
              ),
            },
            {
              key: 'booking',
              label: (
                <span>
                  <CalendarOutlined /> Booking History
                </span>
              ),
              children: loading ? (
                <Spin />
              ) : (
                <div>
                  <Title level={4}>Booking History</Title>
                  <Divider />
                  <List
                    dataSource={bookings}
                    itemLayout="vertical"
                    renderItem={(item) => (
                      <List.Item key={item.bookingId}>
                        <Card bodyStyle={{ padding: 16 }} style={{ borderRadius: 10 }}>
                          <Space direction="vertical" style={{ width: '100%' }} size="middle">
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                              <div>
                                <Text>
                                  <strong>Booking ID:</strong> {item.bookingId}
                                </Text>
                                <Tag color={item.status === 'success' ? 'green' : 'orange'} style={{ marginLeft: 8 }}>
                                  {item.status === 'success' ? 'Paid' : 'Pending'}
                                </Tag>
                              </div>
                              <Button
                                type="link"
                                danger
                                icon={<DeleteOutlined />}
                                onClick={() => handleDelete(item.bookingId)}
                              >
                                Delete
                              </Button>
                            </div>
                            <Text>
                              <strong>Showtime:</strong> {item.showtimeId}
                            </Text>
                            <Text>
                              <strong>Seats:</strong> {item.seatIds?.join(', ') || 'N/A'}
                            </Text>
                            <Text>
                              <strong>Price:</strong> {item.price?.toLocaleString() ?? '0'} ₫
                            </Text>
                          </Space>
                        </Card>
                      </List.Item>
                    )}
                  />
                </div>
              ),
            },
          ]}
        />
      </Card>
    </div>
  );
}

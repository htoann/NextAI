'use client';

import { bulkDeleteBookings, getBookingList } from '@/lib/services/booking';
import { BookingResponse } from '@/types';
import { CalendarOutlined, DeleteOutlined, ExclamationCircleOutlined, UserOutlined } from '@ant-design/icons';
import { Button, Card, Checkbox, Divider, List, Modal, Space, Spin, Tabs, Tag, Typography, message } from 'antd';
import { useSession } from 'next-auth/react';
import { useCallback, useEffect, useState } from 'react';
import PaymentModal from './components/payment';

const { Title, Text } = Typography;
const { confirm } = Modal;

export default function ProfilePage() {
  const { data } = useSession();
  const [bookings, setBookings] = useState<BookingResponse[]>([]);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [openPayment, setOpenPayment] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<BookingResponse | null>(null);

  const fetchBookings = useCallback(async () => {
    setLoading(true);
    try {
      setBookings(await getBookingList());
    } catch (err) {
      console.error('❌ Failed to load bookings:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  const toggleSelect = (id: string, checked: boolean) =>
    setSelectedIds((prev) => (checked ? [...prev, id] : prev.filter((i) => i !== id)));

  const toggleSelectAll = (checked: boolean) => setSelectedIds(checked ? bookings.map((b) => b.bookingId) : []);

  const confirmDelete = (ids: string[]) => {
    confirm({
      title: `Delete ${ids.length} booking(s)?`,
      icon: <ExclamationCircleOutlined />,
      content: 'This action cannot be undone.',
      okType: 'danger',
      centered: true,
      onOk: async () => {
        try {
          await bulkDeleteBookings(ids);
          setBookings((prev) => prev.filter((b) => !ids.includes(b.bookingId)));
          setSelectedIds((prev) => prev.filter((id) => !ids.includes(id)));
          message.success('Deleted successfully');
        } catch (err) {
          console.error('Delete failed:', err);
          message.error('Failed to delete');
        }
      },
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
                <>
                  <UserOutlined /> Personal Info
                </>
              ),
              children: (
                <Space direction="vertical">
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
                <>
                  <CalendarOutlined /> Booking History
                </>
              ),
              children: loading ? (
                <Spin />
              ) : (
                <div>
                  <Title level={4}>Booking History</Title>
                  <Divider />
                  {bookings.length > 0 && (
                    <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
                      <Checkbox
                        indeterminate={selectedIds.length > 0 && selectedIds.length < bookings.length}
                        checked={selectedIds.length === bookings.length}
                        onChange={(e) => toggleSelectAll(e.target.checked)}
                      >
                        Select All
                      </Checkbox>
                      {selectedIds.length > 0 && (
                        <Button type="primary" danger onClick={() => confirmDelete(selectedIds)}>
                          Delete Selected ({selectedIds.length})
                        </Button>
                      )}
                    </div>
                  )}
                  <List
                    dataSource={bookings}
                    itemLayout="vertical"
                    renderItem={(item) => (
                      <List.Item key={item.bookingId}>
                        <Card bodyStyle={{ padding: 16 }} style={{ borderRadius: 10 }}>
                          <Space direction="vertical" style={{ width: '100%' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                              <div>
                                <Text>
                                  <strong>Booking ID:</strong> {item.bookingId}
                                </Text>
                                <Tag color={item.status === 'success' ? 'green' : 'orange'} style={{ marginLeft: 8 }}>
                                  {item.status === 'success' ? 'Paid' : 'Pending'}
                                </Tag>
                              </div>
                              <Space>
                                {item.status === 'pending' && (
                                  <Button
                                    type="primary"
                                    onClick={() => {
                                      setSelectedBooking(item);
                                      setOpenPayment(true);
                                    }}
                                  >
                                    Pay Now
                                  </Button>
                                )}
                                <Button
                                  type="link"
                                  danger
                                  icon={<DeleteOutlined />}
                                  onClick={() => confirmDelete([item.bookingId])}
                                >
                                  Delete
                                </Button>
                                <Checkbox
                                  checked={selectedIds.includes(item.bookingId)}
                                  onChange={(e) => toggleSelect(item.bookingId, e.target.checked)}
                                />
                              </Space>
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
                  <PaymentModal
                    open={openPayment}
                    onClose={() => setOpenPayment(false)}
                    amountVnd={selectedBooking?.price ?? 0}
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

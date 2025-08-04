'use client';

import { CreditCardOutlined, UserOutlined } from '@ant-design/icons';
import { Card, List, Space, Tabs, Tag, Typography } from 'antd';
import { useSession } from 'next-auth/react';

const { Title, Text } = Typography;

const paymentHistory = [
  { id: 'TXN001', amount: 90000, status: 'success', date: '2025-08-01', seats: ['B5', 'B6'] },
  { id: 'TXN002', amount: 50000, status: 'pending', date: '2025-08-03', seats: ['C1'] },
];

export default function ProfilePage() {
  const { data } = useSession();

  return (
    <div style={{ padding: 32, maxWidth: 800, margin: '0 auto' }}>
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
              key: 'payment',
              label: (
                <span>
                  <CreditCardOutlined /> Payments
                </span>
              ),
              children: (
                <div>
                  <Title level={4}>Payment History</Title>
                  <List
                    itemLayout="vertical"
                    dataSource={paymentHistory}
                    renderItem={(item) => (
                      <List.Item key={item.id}>
                        <Card>
                          <Space direction="vertical" style={{ width: '100%' }}>
                            <Text>
                              <strong>Transaction ID:</strong> {item.id}
                            </Text>
                            <Text>
                              <strong>Date:</strong> {item.date}
                            </Text>
                            <Text>
                              <strong>Seats:</strong> {item.seats.join(', ')}
                            </Text>
                            <Text>
                              <strong>Amount:</strong> {item.amount.toLocaleString()} ₫
                            </Text>
                            <Tag color={item.status === 'success' ? 'green' : 'orange'}>
                              {item.status === 'success' ? 'Paid' : 'Pending'}
                            </Tag>
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

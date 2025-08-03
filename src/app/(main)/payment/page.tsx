'use client';

import { checkout } from '@/lib/services/booking';
import { CreditCardOutlined } from '@ant-design/icons';
import { loadStripe } from '@stripe/stripe-js';
import { Button, Card, Divider, message, Modal, Space, Typography } from 'antd';
import { useState } from 'react';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);
const { Title, Text } = Typography;

const fixedVndAmount = 50000;

export default function PaymentPage() {
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const handlePay = async () => {
    setLoading(true);
    try {
      const exchangeRate = 24000;
      const usdAmount = fixedVndAmount / exchangeRate;
      const stripeAmount = Math.round(usdAmount * 100);

      const { url } = await checkout({ amount: stripeAmount });

      const stripe = await stripePromise;
      if (stripe && url) {
        window.location.href = url;
      } else {
        message.error('Stripe redirect failed');
      }
    } catch (err) {
      console.error(err);
      message.error('Payment error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        height: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        background: '#f0f2f5',
      }}
    >
      <Card bordered={false} style={{ width: 400, textAlign: 'center' }}>
        <Title level={3}>Pay for Movie Ticket</Title>
        <Text type="secondary">Your ticket will be held for 5 minutes.</Text>
        <Divider />
        <Button type="primary" size="large" onClick={() => setOpen(true)}>
          Proceed to Payment
        </Button>
      </Card>

      <Modal open={open} onCancel={() => setOpen(false)} footer={null} centered width={400} destroyOnClose>
        <div style={{ padding: 24, textAlign: 'center' }}>
          <Space direction="vertical" size="middle" style={{ width: '100%' }}>
            <CreditCardOutlined style={{ fontSize: 36, color: '#1890ff' }} />
            <Title level={4}>Confirm Payment</Title>
            <Text type="secondary">You are about to pay:</Text>
            <Title level={3} style={{ color: '#52c41a' }}>
              {fixedVndAmount.toLocaleString()} ₫
            </Title>

            <Button type="primary" block size="large" loading={loading} onClick={handlePay}>
              Pay Now
            </Button>
            <Button type="text" block style={{ marginTop: 8 }} onClick={() => setOpen(false)}>
              Cancel
            </Button>
          </Space>
        </div>
      </Modal>
    </div>
  );
}

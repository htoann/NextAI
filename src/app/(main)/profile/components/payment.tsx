'use client';

import { checkout } from '@/lib/services/booking';
import { CreditCardOutlined } from '@ant-design/icons';
import { loadStripe } from '@stripe/stripe-js';
import { Button, Modal, Space, Typography, message } from 'antd';
import { useState } from 'react';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);
const { Title, Text } = Typography;

export default function PaymentModal({
  open,
  onClose,
  amountVnd,
  bookingId,
}: {
  open: boolean;
  onClose: () => void;
  amountVnd: number;
  bookingId: string;
}) {
  const [loading, setLoading] = useState(false);

  const handlePay = async () => {
    setLoading(true);
    try {
      const exchangeRate = 27230;
      const usdAmount = amountVnd / exchangeRate;
      const stripeAmount = Math.round(usdAmount * 100);

      const { url } = await checkout({ amount: stripeAmount, bookingId });

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
    <Modal open={open} onCancel={onClose} footer={null} centered width={400} destroyOnHidden>
      <div style={{ padding: 24, textAlign: 'center' }}>
        <Space direction="vertical" size="middle" style={{ width: '100%' }}>
          <CreditCardOutlined style={{ fontSize: 36, color: '#1890ff' }} />
          <Title level={4}>Confirm Payment</Title>
          <Text type="secondary">You are about to pay:</Text>
          <Title level={3} style={{ color: '#52c41a' }}>
            {amountVnd.toLocaleString()} ₫
          </Title>

          <Button type="primary" block size="large" loading={loading} onClick={handlePay}>
            Pay Now
          </Button>
          <Button type="text" block style={{ marginTop: 8 }} onClick={onClose}>
            Cancel
          </Button>
        </Space>
      </div>
    </Modal>
  );
}

'use client';

import Loading from '@/app/loading';
import { setField } from '@/lib/localStorage';
import { Button, Card, Col, Form, Input, notification, Row, Typography } from 'antd';
import { getSession, signIn, useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

const { Title, Text } = Typography;

export default function Login() {
  const router = useRouter();
  const { status, data: session } = useSession();

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (session) {
      router.push('/');
    }
  }, [session, router]);

  if (status === 'loading' || session) {
    return <Loading />;
  }

  const handleSubmit = async (values: { username: string; password: string }) => {
    setLoading(true);
    const { username, password } = values;

    const res = await signIn('credentials', {
      redirect: false,
      username,
      password,
    });

    setLoading(false);

    const session = await getSession();
    if (session?.user) {
      setField('user', JSON.stringify(session.user));
    }

    if (res?.error) {
      notification.error({
        message: 'Login',
        description: res?.error,
      });
    } else {
      router.push('/');
    }
  };

  return (
    <Row
      justify="center"
      align="middle"
      style={{
        height: '100vh',
        background: 'linear-gradient(135deg, #8231D3, #9D50BB)',
      }}
    >
      <Col xs={22} sm={18} md={12} lg={8}>
        <Card
          bordered={false}
          style={{
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.2)',
            borderRadius: '12px',
            padding: '24px',
          }}
        >
          <Title level={2} style={{ textAlign: 'center', color: '#8231D3' }}>
            Sign In
          </Title>
          <Text type="secondary" style={{ display: 'block', textAlign: 'center', marginBottom: '24px' }}>
            Please enter your credentials to log in.
          </Text>
          <Form
            layout="vertical"
            onFinish={handleSubmit}
            initialValues={{ username: '', password: '' }}
            style={{ marginTop: '16px' }}
          >
            <Form.Item
              label="Username"
              name="username"
              rules={[{ required: true, message: 'Please enter your username' }]}
            >
              <Input size="large" placeholder="Enter your username" />
            </Form.Item>
            <Form.Item
              label="Password"
              name="password"
              rules={[{ required: true, message: 'Please enter your password' }]}
            >
              <Input.Password size="large" placeholder="Enter your password" />
            </Form.Item>
            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                block
                style={{
                  backgroundColor: '#8231D3',
                  borderColor: '#8231D3',
                  height: '48px',
                  fontSize: '16px',
                }}
                loading={loading}
              >
                {loading ? 'Signing In...' : 'Sign In'}
              </Button>
            </Form.Item>
          </Form>
          <Text style={{ textAlign: 'center', display: 'block', marginTop: '16px' }}>
            Don’t have an account? <a style={{ color: '#8231D3' }}>Sign up</a>
          </Text>
        </Card>
      </Col>
    </Row>
  );
}

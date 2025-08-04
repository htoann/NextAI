'use client';

import { useAppContext } from '@/context/AppContext';
import { LogoutOutlined, UserOutlined } from '@ant-design/icons';
import { Avatar, Button, Dropdown, Layout, Menu, Space, Typography } from 'antd';
import { signOut, useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

const { Header } = Layout;
const { Title, Text } = Typography;

export const NavBar = () => {
  const { setLoading } = useAppContext();
  const { data: session } = useSession();
  const router = useRouter();

  const handleLogout = async () => {
    setLoading(true);
    await signOut();
    setLoading(false);
  };

  const menu = (
    <Menu
      items={[
        {
          key: 'profile',
          icon: <UserOutlined />,
          label: 'Profile',
          onClick: () => router.push('/profile'),
        },
        {
          key: 'logout',
          icon: <LogoutOutlined />,
          label: 'Logout',
          onClick: handleLogout,
        },
      ]}
    />
  );

  return (
    <Header
      style={{
        position: 'fixed',
        top: 0,
        width: '100%',
        zIndex: 1000,
        backgroundColor: '#8231D3',
        height: 56,
        padding: '0 20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}
    >
      {/* Left - Logo */}
      <Title
        level={3}
        style={{
          margin: 0,
          color: '#fff',
          cursor: 'pointer',
        }}
        onClick={() => router.push('/')}
      >
        NextAI
      </Title>

      {/* Center - Booking */}
      {session && (
        <div
          style={{
            position: 'absolute',
            left: '50%',
            transform: 'translateX(-50%)',
          }}
        >
          <Button
            type="default"
            onClick={() => router.push('/bookings')}
            style={{
              backgroundColor: '#fff',
              color: '#8231D3',
              fontWeight: 600,
              borderRadius: 20,
              padding: '0 24px',
              height: 36,
            }}
          >
            Booking
          </Button>
        </div>
      )}

      {/* Right - Avatar / Login */}
      <Space>
        {session ? (
          <Dropdown overlay={menu} trigger={['click']}>
            <Space style={{ cursor: 'pointer' }}>
              <Text style={{ color: '#fff', fontWeight: 500 }}>{session.user?.name}</Text>
              <Avatar icon={<UserOutlined />} style={{ backgroundColor: '#fff', color: '#8231D3' }} />
            </Space>
          </Dropdown>
        ) : (
          <Button
            type="primary"
            onClick={() => router.push('/auth/login')}
            style={{
              backgroundColor: '#fff',
              color: '#8231D3',
              borderColor: '#fff',
              fontWeight: 500,
            }}
          >
            Login
          </Button>
        )}
      </Space>
    </Header>
  );
};

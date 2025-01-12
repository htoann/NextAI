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
    setLoading(true);
  };

  const menuItems = [
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: 'Logout',
      onClick: handleLogout,
    },
  ];

  return (
    <Header
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#8231D3',
        padding: '0 20px',
        height: 56,
      }}
    >
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

      {session ? (
        <Dropdown menu={{ items: menuItems }} trigger={['click']}>
          <Space style={{ cursor: 'pointer' }}>
            {session?.user?.name && (
              <Text
                style={{
                  color: '#fff',
                }}
              >
                {session.user.name}
              </Text>
            )}
            <Avatar
              icon={<UserOutlined />}
              style={{
                backgroundColor: '#fff',
                color: '#8231D3',
              }}
            />
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
          }}
        >
          Login
        </Button>
      )}
    </Header>
  );
};

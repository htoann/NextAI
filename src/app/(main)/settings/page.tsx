'use client';

import { CodeOutlined, MailOutlined } from '@ant-design/icons';
import { Card, List, message, Space, Switch, Typography } from 'antd';
import { useState } from 'react';
import { chatboxSnippet } from './const';

const { Title, Paragraph, Text } = Typography;

export default function SettingsPage() {
  const [emailNotif, setEmailNotif] = useState(true);

  const settings = [
    {
      key: 'emailNotif',
      label: 'Email Notifications',
      description: 'Receive updates and booking reminders by email',
      icon: <MailOutlined style={{ fontSize: 20, color: '#1890ff' }} />,
      value: emailNotif,
      onChange: (checked: boolean) => {
        setEmailNotif(checked);
        message.success(`Email notifications ${checked ? 'enabled' : 'disabled'}`);
      },
    },
  ];

  return (
    <div style={{ padding: 32, maxWidth: 800, margin: '0 auto' }}>
      <Title level={2} style={{ marginBottom: 16 }}>
        Settings
      </Title>

      {/* Preferences Section */}
      <Card
        title={<Text strong>Preferences</Text>}
        style={{
          borderRadius: 16,
          marginBottom: 24,
          boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
        }}
      >
        <List
          itemLayout="horizontal"
          dataSource={settings}
          renderItem={(item, idx) => (
            <>
              <List.Item actions={[<Switch key={item.key} checked={item.value} onChange={item.onChange} />]}>
                <List.Item.Meta
                  avatar={<div style={{ fontSize: 20 }}>{item.icon}</div>}
                  title={<Text>{item.label}</Text>}
                  description={item.description}
                />
              </List.Item>
            </>
          )}
        />
      </Card>

      {/* Code snippet section */}
      <Card
        title={
          <Space>
            <CodeOutlined />
            <Text strong>Chatbox Widget</Text>
          </Space>
        }
        style={{
          borderRadius: 16,
          boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
        }}
      >
        <Paragraph copyable={{ text: chatboxSnippet }}>
          <Text type="secondary">Click the copy icon to copy snippet</Text>
        </Paragraph>
        <div
          style={{
            background: '#f5f5f5',
            padding: '12px 16px',
            borderRadius: 8,
            fontFamily: 'monospace',
            whiteSpace: 'pre',
            overflowX: 'auto',
            fontSize: 13,
          }}
        >
          {chatboxSnippet}
        </div>
      </Card>
    </div>
  );
}

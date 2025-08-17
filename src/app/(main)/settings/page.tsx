'use client';

import { CHATBOX_SNIPPET } from '@/lib/utils';
import { CodeOutlined, MailOutlined } from '@ant-design/icons';
import { Card, List, message, Space, Switch, Typography } from 'antd';
import { useState } from 'react';

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
          renderItem={(item) => (
            <List.Item actions={[<Switch key={item.key} checked={item.value} onChange={item.onChange} />]}>
              <List.Item.Meta
                avatar={<div style={{ fontSize: 20 }}>{item.icon}</div>}
                title={<Text>{item.label}</Text>}
                description={item.description}
              />
            </List.Item>
          )}
        />
      </Card>

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
        <Paragraph>
          You can add the <Text code>chatbox-widget</Text> to your React/Next.js project using the following steps:
        </Paragraph>

        <Paragraph>
          <Text strong>Step 1:</Text> Add this code to your <Text code>RootLayout</Text> (or main layout) to load the
          widget:
        </Paragraph>

        <Paragraph copyable={{ text: CHATBOX_SNIPPET }}>
          <Text type="secondary">Copy CDN URL</Text>
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
            marginBottom: 16,
          }}
        >
          {`<Script src="${CHATBOX_SNIPPET}" strategy="afterInteractive" />`}
        </div>

        <Paragraph>
          <Text strong>Step 2:</Text> Make sure to import <Text code>Script</Text> from <Text code>next/script</Text>:
        </Paragraph>
        <Paragraph>
          <Text code>import Script from 'next/script';</Text>
        </Paragraph>

        <Paragraph>
          <Text strong>Step 3:</Text> The chatbox will automatically appear as a floating widget after your page loads.
        </Paragraph>
      </Card>
    </div>
  );
}

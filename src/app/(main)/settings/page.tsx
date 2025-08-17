'use client';

import { CodeOutlined, MailOutlined } from '@ant-design/icons';
import { Card, Divider, List, Switch, Typography, message } from 'antd';
import { useState } from 'react';
import { chatboxSnippet } from './const';

const { Title, Paragraph } = Typography;

export default function SettingsPage() {
  const [emailNotif, setEmailNotif] = useState(true);

  const settings = [
    {
      key: 'emailNotif',
      label: 'Email Notifications',
      description: 'Receive updates and booking reminders by email',
      icon: <MailOutlined style={{ color: '#1890ff' }} />,
      value: emailNotif,
      onChange: (checked: boolean) => {
        setEmailNotif(checked);
        message.success(`Email notifications ${checked ? 'enabled' : 'disabled'}`);
      },
    },
  ];

  return (
    <div style={{ padding: 32, maxWidth: 800, margin: '0 auto' }}>
      <Title level={2} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        Settings
      </Title>

      <Card
        style={{
          borderRadius: 16,
          marginTop: 20,
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
                  avatar={item.icon}
                  title={<strong>{item.label}</strong>}
                  description={item.description}
                />
              </List.Item>
              {idx < settings.length - 1 && <Divider style={{ margin: 0 }} />}
            </>
          )}
        />
      </Card>

      {/* Code snippet section */}
      <Card
        title={
          <span>
            <CodeOutlined /> Example Snippet
          </span>
        }
        style={{
          borderRadius: 16,
          marginTop: 24,
          boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
        }}
      >
        <Paragraph
          copyable={{ text: chatboxSnippet }}
          style={{
            background: '#f5f5f5',
            padding: '12px 16px',
            borderRadius: 8,
            fontFamily: 'monospace',
            whiteSpace: 'pre-wrap',
          }}
        >
          {chatboxSnippet}
        </Paragraph>
      </Card>
    </div>
  );
}

'use client';

import { useAppContext } from '@/context/AppContext';
import { EChatMode } from '@/lib/type';
import { ArrowLeftOutlined, ZoomInOutlined, ZoomOutOutlined } from '@ant-design/icons';
import { Button, Card, Space, Typography } from 'antd';
import './UI.scss';

export const UI = () => {
  const { cameraZoomed, setCameraZoomed, toggleChatMode } = useAppContext();

  return (
    <div className="ui-container">
      <Card className="ui-header">
        <Typography.Title level={4} className="ui-title">
          Virtual GF
        </Typography.Title>
      </Card>

      <Space direction="vertical" size="large" className="ui-actions">
        <Button type="primary" icon={<ArrowLeftOutlined />} onClick={() => toggleChatMode(EChatMode.VR)}>
          Back
        </Button>
        <Button
          type="primary"
          icon={cameraZoomed ? <ZoomOutOutlined /> : <ZoomInOutlined />}
          onClick={() => setCameraZoomed(!cameraZoomed)}
        >
          {cameraZoomed ? 'Zoom out' : 'Zoom in'}
        </Button>
      </Space>
    </div>
  );
};

'use client';

import { useAppContext } from '@/context/AppContext';
import { ZoomInOutlined, ZoomOutOutlined } from '@ant-design/icons';
import { Button, Card, Space, Typography } from 'antd';
import './UI.scss';

export const UI = () => {
  const { cameraZoomed, setCameraZoomed } = useAppContext();

  return (
    <div className="ui-container">
      <Card className="ui-header">
        <Typography.Title level={4} className="ui-title">
          My Virtual GF
        </Typography.Title>
      </Card>

      <Space direction="vertical" size="large" className="ui-actions">
        <Button
          type="primary"
          icon={cameraZoomed ? <ZoomOutOutlined /> : <ZoomInOutlined />}
          onClick={() => setCameraZoomed(!cameraZoomed)}
        >
          {cameraZoomed ? 'Zoom Out' : 'Zoom In'}
        </Button>
      </Space>
    </div>
  );
};

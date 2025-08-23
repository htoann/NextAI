'use client';

import { Button, Result } from 'antd';
import { useEffect } from 'react';

interface GlobalErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function GlobalError({ error, reset }: GlobalErrorProps) {
  useEffect(() => {
    console.error('Global error:', error);
  }, [error]);

  return (
    <html>
      <body>
        <div
          style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '24px',
          }}
        >
          <Result
            status="500"
            title="Application Error"
            subTitle="A critical error occurred. Please try refreshing the page."
            extra={[
              <Button type="primary" onClick={reset} key="retry">
                Try again
              </Button>,
              <Button key="home" onClick={() => (window.location.href = '/')}>
                Go Home
              </Button>,
            ]}
          />
        </div>
      </body>
    </html>
  );
}

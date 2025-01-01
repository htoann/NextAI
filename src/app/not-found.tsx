'use client';

import { Button, Flex, Result } from 'antd';
import Link from 'next/link';

export default function NotFound() {
  return (
    <Flex
      style={{
        minHeight: '100vh',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f5f5f5',
      }}
    >
      <Result
        status="404"
        title="404"
        subTitle="Sorry, the page you visited does not exist."
        extra={
          <Link href="/">
            <Button type="primary">Back Home</Button>
          </Link>
        }
      />
    </Flex>
  );
}

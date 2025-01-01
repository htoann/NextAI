import { ChatLayout } from '@/components/layout/chat-layout';
import { Greeting } from '@/components/layout/greeting';

export default function Home() {
  return (
    <ChatLayout>
      <Greeting />
    </ChatLayout>
  );
}

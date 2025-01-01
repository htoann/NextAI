import { Greeting } from '@/components/greeting';
import { ChatLayout } from '@/components/layout/chat-layout';

export default function Home() {
  return (
    <ChatLayout>
      <Greeting />
    </ChatLayout>
  );
}

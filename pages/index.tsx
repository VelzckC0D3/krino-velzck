import { SimpleGrid } from '@mantine/core';
import useAssistant from '@/hooks/useAssistant';
import Chat from '@/components/Chat';
import Cars from '@/components/Cars';
import { cssMainSize } from '@/theme';

export default function HomePage() {
  const { messages, sendMessageAndRun, isRunning, resetThread } = useAssistant();

  return (
    <SimpleGrid m="xl" cols={{ base: 1, sm: 2 }} h={cssMainSize}>
      <Chat
        messages={messages}
        sendMessageAndRun={sendMessageAndRun}
        isRunning={isRunning}
        resetThread={resetThread}
      />
      <Cars />
    </SimpleGrid>
  );
}

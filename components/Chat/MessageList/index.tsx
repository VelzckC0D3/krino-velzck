import { useEffect, useRef } from 'react';
import { Stack } from '@mantine/core';
import classes from './MessageList.module.css';
import { Message as MessageType } from '@/types/openai';
import Message from './Message';

type Props = {
  messages: MessageType[] | undefined;

};
export default function MessageList({ messages }: Props) {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Scroll to the new message when messages change
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  // Check if messages is an array
  if (!Array.isArray(messages)) {
    console.error('Expected messages to be an array, got:', messages);
    return null; // Return null or an alternative UI as a fallback
  }

  return (
    <Stack className={classes.scrollable} h="100%" gap="64px" style={{ overflow: 'auto' }}>
      {messages.map((message, index) => (
        <Message key={index} message={message} isLast={index === messages.length - 1} />
      ))}
      <div ref={scrollRef} />
    </Stack>
  );
}

import { Text, Group, Box } from '@mantine/core';
import { IconCarSuv, IconUser } from '@tabler/icons-react';
import { Message } from '@/types/openai';
import classes from './MessageList.module.css';

type Props = {
  message: Message;
  isLast: boolean;
};

export default function Message({ message, isLast }: Props) {
  return (
    <Group className={classes.messageBox} wrap="nowrap" align="flex-start" grow>
      {/* {message.role === 'assistant' ? 'asistente' : 'tu'} */}
      {message.role === 'assistant' ? (
        <Box className={classes.roleBoxUser} c={!isLast ? 'dimmed' : ''}>
          <IconCarSuv width={40} height={36} stroke={1.3} />
        </Box>
      ) : (
        <Box className={classes.roleBoxAssistant} c={!isLast ? 'dimmed' : ''}>
          <IconUser />
        </Box>
      )}

      {message.content.map((item, idx) => (
        <Text key={idx} size="xl" maw="100%" c={!isLast ? 'dimmed' : ''}>
          {item.text?.value ?? ''}
        </Text>
      ))}
    </Group>
  );
}

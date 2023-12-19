export type Message = {
  id: string;
  role: 'user' | 'assistant';
  content: (MessageContentImageFile | MessageContentText)[];
};

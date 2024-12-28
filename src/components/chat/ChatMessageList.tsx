interface ChatMessageListProps {
  messages: Array<{ role: 'user' | 'assistant'; content: string }>;
}

const ChatMessageList = ({ messages }: ChatMessageListProps) => (
  <div className="flex-1 overflow-y-auto space-y-4 p-4">
    {messages.map((msg, index) => (
      <ChatMessage key={index} {...msg} />
    ))}
  </div>
);

export default ChatMessageList;
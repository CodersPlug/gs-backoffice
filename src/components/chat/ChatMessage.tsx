interface ChatMessageProps {
  role: 'user' | 'assistant';
  content: string;
}

const ChatMessage = ({ role, content }: ChatMessageProps) => (
  <div
    className={`p-3 rounded-lg ${
      role === 'user'
        ? 'bg-primary text-primary-foreground ml-8'
        : 'bg-muted mr-8'
    }`}
  >
    {content}
  </div>
);

export default ChatMessage;
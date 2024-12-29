import { Button } from "@/components/ui/button";
import { Loader2, Send } from "lucide-react";
import { forwardRef, useEffect } from "react";

interface ChatInputProps {
  message: string;
  isLoading: boolean;
  onChange: (value: string) => void;
  onSend: () => void;
}

const ChatInput = forwardRef<HTMLInputElement, ChatInputProps>(
  ({ message, isLoading, onChange, onSend }, ref) => {
    useEffect(() => {
      // Focus the input when the component mounts
      if (ref && typeof ref !== 'function') {
        ref.current?.focus();
      }
    }, [ref]);

    return (
      <div className="border-t p-4">
        <div className="flex gap-2">
          <input
            ref={ref}
            type="text"
            value={message}
            onChange={(e) => onChange(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && onSend()}
            placeholder="Escribe tu mensaje..."
            className="flex-1 px-4 py-2 rounded-md border bg-white dark:bg-dark-background text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50"
            autoFocus
          />
          <Button onClick={onSend} disabled={isLoading || !message.trim()}>
            {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
          </Button>
        </div>
      </div>
    )
  }
);

ChatInput.displayName = 'ChatInput';

export default ChatInput;
import { Button } from "@/components/ui/button";
import { Loader2, Paperclip } from "lucide-react";
import { forwardRef, useEffect } from "react";

interface ChatInputProps {
  message: string;
  isLoading: boolean;
  onChange: (value: string) => void;
  onSend: () => void;
  onFileClick: () => void;
}

const ChatInput = forwardRef<HTMLInputElement, ChatInputProps>(
  ({ message, isLoading, onChange, onSend, onFileClick }, ref) => {
    useEffect(() => {
      if (ref && typeof ref !== 'function') {
        ref.current?.focus();
      }
    }, [ref]);

    return (
      <div className="border-t p-4 bg-[#343541]">
        <div className="max-w-4xl mx-auto relative">
          <div className="relative flex items-center">
            <div className="absolute left-4 flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 hover:bg-gray-600/50"
                onClick={onFileClick}
              >
                <Paperclip className="h-5 w-5 text-gray-400" />
              </Button>
            </div>
            <input
              ref={ref}
              type="text"
              value={message}
              onChange={(e) => onChange(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && !isLoading && message.trim() && onSend()}
              placeholder="Envía un mensaje a ChatGPT..."
              className="w-full rounded-xl border border-gray-600/50 bg-[#40414F] py-3 pl-14 pr-14 text-white placeholder:text-gray-400 focus:border-gray-500 focus:outline-none focus:ring-0"
              disabled={isLoading}
            />
            <div className="absolute right-4">
              {isLoading ? (
                <Loader2 className="h-5 w-5 animate-spin text-gray-400" />
              ) : message.trim() && (
                <Button
                  size="icon"
                  className="h-8 w-8 bg-transparent hover:bg-gray-600/50"
                  onClick={onSend}
                >
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    className="text-white"
                  >
                    <path
                      d="M7 11L12 6L17 11M12 18V7"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      transform="rotate(90 12 12)"
                    />
                  </svg>
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }
);

ChatInput.displayName = 'ChatInput';

export default ChatInput;
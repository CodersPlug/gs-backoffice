import { useEffect, useRef, useState } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import ChatMessageList from "./chat/ChatMessageList";
import ChatInput from "./chat/ChatInput";
import { useChat } from "@/hooks/useChat";
import { useFileUpload } from "@/hooks/useFileUpload";

interface AICopilotProps {
  isOpen: boolean;
  onClose: () => void;
}

const AICopilot = ({ isOpen, onClose }: AICopilotProps) => {
  const [message, setMessage] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const { conversation, isLoading: isChatLoading, sendMessage, addSystemMessage } = useChat();
  const { isLoading: isFileLoading, handleFileUpload } = useFileUpload((fileName) => {
    addSystemMessage(`Archivo "${fileName}" subido exitosamente. Se creó una nueva tarjeta en la columna "Para Hacer".`);
  });

  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        inputRef.current?.focus();
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  const handleSendMessage = async () => {
    if (!message.trim()) return;
    const currentMessage = message;
    setMessage("");
    await sendMessage(currentMessage);
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      await handleFileUpload(file);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent side="right" className="w-full sm:w-[400px] p-0 bg-[#343541]">
        <SheetHeader className="relative p-4 border-b border-gray-600/50">
          <SheetTitle className="text-white">Asistente AI</SheetTitle>
        </SheetHeader>
        <div className="flex flex-col h-[calc(100vh-4rem)]">
          <ChatMessageList messages={conversation} />
          <ChatInput
            ref={inputRef}
            message={message}
            isLoading={isChatLoading || isFileLoading}
            onChange={setMessage}
            onSend={handleSendMessage}
            onFileClick={() => fileInputRef.current?.click()}
          />
          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            onChange={handleFileChange}
            accept="*/*"
          />
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default AICopilot;
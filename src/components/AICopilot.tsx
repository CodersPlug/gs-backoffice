import { useState, useEffect, useRef } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import ChatMessageList from "./chat/ChatMessageList";
import ChatInput from "./chat/ChatInput";

interface AICopilotProps {
  isOpen: boolean;
  onClose: () => void;
}

const AICopilot = ({ isOpen, onClose }: AICopilotProps) => {
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [conversation, setConversation] = useState<{ role: 'user' | 'assistant', content: string }[]>([]);
  const { toast } = useToast();
  const inputRef = useRef<HTMLInputElement>(null);

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

    setIsLoading(true);
    const userMessage = message;
    setMessage("");
    setConversation(prev => [...prev, { role: 'user', content: userMessage }]);

    try {
      const { data, error } = await supabase.functions.invoke('chat', {
        body: { message: userMessage },
      });

      if (error) throw error;

      setConversation(prev => [...prev, { role: 'assistant', content: data.response }]);
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Error",
        description: "No se pudo obtener la respuesta del AI. Por favor, intenta de nuevo.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent side="right" className="w-full sm:w-[400px] p-0">
        <SheetHeader className="relative p-4 border-b">
          <SheetTitle>Asistente AI</SheetTitle>
        </SheetHeader>
        <div className="flex flex-col h-[calc(100vh-4rem)]">
          <ChatMessageList messages={conversation} />
          <ChatInput
            ref={inputRef}
            message={message}
            isLoading={isLoading}
            onChange={setMessage}
            onSend={handleSendMessage}
          />
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default AICopilot;
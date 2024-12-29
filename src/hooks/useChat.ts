import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

export type Message = {
  role: 'user' | 'assistant';
  content: string;
};

export const useChat = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [conversation, setConversation] = useState<Message[]>([]);
  const { toast } = useToast();

  const sendMessage = async (message: string) => {
    if (!message.trim()) return;

    setIsLoading(true);
    setConversation(prev => [...prev, { role: 'user', content: message }]);

    try {
      const { data, error } = await supabase.functions.invoke('chat', {
        body: { message },
      });

      if (error) throw error;

      setConversation(prev => [...prev, { role: 'assistant', content: data.response }]);
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Error",
        description: "No se pudo obtener la respuesta del AI. Por favor, intentá de nuevo.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const addSystemMessage = (content: string) => {
    setConversation(prev => [...prev, { role: 'assistant', content }]);
  };

  return {
    isLoading,
    conversation,
    sendMessage,
    addSystemMessage,
  };
};
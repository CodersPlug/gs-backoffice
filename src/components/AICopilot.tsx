import { useState } from "react";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { Loader2, Send } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface AICopilotProps {
  isOpen: boolean;
  onClose: () => void;
}

const AICopilot = ({ isOpen, onClose }: AICopilotProps) => {
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [conversation, setConversation] = useState<{ role: 'user' | 'assistant', content: string }[]>([]);
  const { toast } = useToast();

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
        description: "Failed to get AI response. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Drawer open={isOpen} onOpenChange={onClose}>
      <DrawerContent className="h-[80vh]">
        <DrawerHeader>
          <DrawerTitle>AI Copilot</DrawerTitle>
        </DrawerHeader>
        <div className="p-4 flex flex-col h-full">
          <div className="flex-1 overflow-y-auto space-y-4 mb-4">
            {conversation.map((msg, index) => (
              <div
                key={index}
                className={`p-3 rounded-lg ${
                  msg.role === 'user'
                    ? 'bg-primary text-primary-foreground ml-8'
                    : 'bg-muted mr-8'
                }`}
              >
                {msg.content}
              </div>
            ))}
          </div>
          <div className="flex gap-2">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder="Type your message..."
              className="flex-1 px-4 py-2 rounded-md border focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
            <Button onClick={handleSendMessage} disabled={isLoading || !message.trim()}>
              {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
            </Button>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
};

export default AICopilot;
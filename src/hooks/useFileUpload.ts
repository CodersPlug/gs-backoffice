import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

export const useFileUpload = (onSuccess?: (fileName: string) => void) => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleFileUpload = async (file: File) => {
    if (!file) return;

    setIsLoading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const { data, error } = await supabase.functions.invoke('upload-and-create-card', {
        body: formData,
      });

      if (error) throw error;

      toast({
        title: "Éxito",
        description: "Archivo subido y tarjeta creada exitosamente.",
      });

      onSuccess?.(file.name);
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Error",
        description: "No se pudo subir el archivo. Por favor, intentá de nuevo.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    handleFileUpload,
  };
};
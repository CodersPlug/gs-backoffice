import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export const useFileUpload = (onSuccess?: (fileName: string) => void) => {
  const [isLoading, setIsLoading] = useState(false);

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
      onSuccess?.(file.name);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    handleFileUpload,
  };
};
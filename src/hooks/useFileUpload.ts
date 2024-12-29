import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";

export const useFileUpload = (onSuccess?: (fileName: string) => void) => {
  const [isLoading, setIsLoading] = useState(false);
  const queryClient = useQueryClient();

  const handleFileUpload = async (file: File) => {
    if (!file) return;

    setIsLoading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      console.log("Uploading file...");
      const { data, error } = await supabase.functions.invoke('upload-and-create-card', {
        body: formData,
      });

      if (error) {
        console.error('Upload error:', error);
        throw error;
      }

      console.log("Upload successful:", data);
      
      // Invalidate the kanban query to trigger a refresh
      await queryClient.invalidateQueries({ queryKey: ['kanban'] });
      
      onSuccess?.(file.name);
    } catch (error) {
      console.error('Error:', error);
      throw error; // Re-throw to let the UI handle the error
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    handleFileUpload,
  };
};
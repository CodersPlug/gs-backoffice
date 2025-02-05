import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { useFileUpload } from "@/hooks/useFileUpload";
import { toast } from "@/hooks/use-toast";

export const PriceListUploader = () => {
  const [providerName, setProviderName] = useState("");
  const [effectiveDate, setEffectiveDate] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const queryClient = useQueryClient();

  const handleUpload = async (file: File) => {
    if (!providerName || !effectiveDate) {
      toast({
        title: "Error",
        description: "Por favor complete todos los campos requeridos",
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('providerName', providerName);
    formData.append('effectiveDate', effectiveDate);

    try {
      const { error } = await supabase.functions.invoke('upload-price-list', {
        body: formData,
      });

      if (error) throw error;

      toast({
        title: "Éxito",
        description: "Lista de precios subida exitosamente",
      });

      // Reset form
      setProviderName("");
      setEffectiveDate("");

      // Refresh kanban data
      await queryClient.invalidateQueries({ queryKey: ['kanban'] });
    } catch (error) {
      console.error('Upload error:', error);
      toast({
        title: "Error",
        description: "Error al subir la lista de precios",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-4 p-4 bg-dark-muted/50 rounded-lg">
      <h3 className="text-lg font-semibold text-dark-foreground">
        Subir Lista de Precios
      </h3>
      
      <div className="space-y-2">
        <Label htmlFor="providerName">Nombre del Proveedor</Label>
        <Input
          id="providerName"
          value={providerName}
          onChange={(e) => setProviderName(e.target.value)}
          placeholder="Ingrese el nombre del proveedor"
          className="bg-dark-background"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="effectiveDate">Fecha de Vigencia</Label>
        <Input
          id="effectiveDate"
          type="date"
          value={effectiveDate}
          onChange={(e) => setEffectiveDate(e.target.value)}
          className="bg-dark-background"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="file">Archivo PDF</Label>
        <Input
          id="file"
          type="file"
          accept=".pdf"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) handleUpload(file);
          }}
          disabled={isUploading}
          className="bg-dark-background"
        />
      </div>

      {isUploading && (
        <p className="text-sm text-dark-foreground/80">
          Subiendo archivo...
        </p>
      )}
    </div>
  );
};
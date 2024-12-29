import { useState } from "react"
import { useQueryClient } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { toast } from "@/hooks/use-toast"
import { FooterActions } from "./footer/FooterActions"

interface Attachment {
  url: string;
  name: string;
}

interface PinCardFooterProps {
  id: string
  onMaximize?: () => void
  sourceInfo?: string
  attachments?: Attachment[]
}

export function PinCardFooter({ id, onMaximize, sourceInfo, attachments = [] }: PinCardFooterProps) {
  const queryClient = useQueryClient()
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = async () => {
    setIsDeleting(true)
    try {
      const { error } = await supabase
        .from('kanban_items')
        .update({ deleted: true })
        .eq('id', id)

      if (error) throw error

      await queryClient.invalidateQueries({ queryKey: ['kanban'] })
      toast({
        title: "Éxito",
        description: "La tarjeta ha sido eliminada exitosamente",
        duration: 3000,
      })
    } catch (error) {
      console.error('Error deleting card:', error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "Hubo un problema al eliminar la tarjeta",
        duration: 3000,
      })
    } finally {
      setIsDeleting(false)
    }
  }

  const handleViewAttachment = () => {
    if (sourceInfo) {
      window.open(sourceInfo, '_blank')
    }
  }

  const handleViewFirstAttachment = () => {
    if (attachments && attachments.length > 0) {
      window.open(attachments[0].url, '_blank')
    }
  }

  return (
    <FooterActions 
      isDeleting={isDeleting}
      onDelete={handleDelete}
      onMaximize={onMaximize}
      onViewAttachment={handleViewAttachment}
      onViewFirstAttachment={handleViewFirstAttachment}
      hasAttachments={attachments.length > 0}
      hasSourceInfo={!!sourceInfo}
    />
  );
}
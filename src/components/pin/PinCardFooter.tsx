import { Eye, Loader2, Maximize2, Trash2, Paperclip } from "lucide-react"
import { useQueryClient } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { toast } from "@/hooks/use-toast"
import { useState } from "react"

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
    <div className="mt-4 pt-2 border-t border-gray-100 dark:border-dark-border">
      <div className="flex items-center justify-between">
        <button 
          className="p-1.5 rounded-full hover:bg-gray-50 dark:hover:bg-dark-muted transition-colors cursor-pointer disabled:cursor-not-allowed disabled:opacity-50"
          onClick={handleDelete}
          disabled={isDeleting}
        >
          {isDeleting ? (
            <Loader2 className="h-4 w-4 text-gray-400 dark:text-dark-foreground/60 animate-spin" />
          ) : (
            <Trash2 className="h-4 w-4 text-gray-400 dark:text-dark-foreground/60" />
          )}
        </button>
        <div className="flex items-center gap-2">
          {attachments && attachments.length > 0 && (
            <button 
              className="p-1.5 rounded-full hover:bg-gray-50 dark:hover:bg-dark-muted transition-colors cursor-pointer"
              onClick={handleViewFirstAttachment}
            >
              <Paperclip className="h-4 w-4 text-gray-400 dark:text-dark-foreground/60" />
            </button>
          )}
          {sourceInfo && (
            <button 
              className="p-1.5 rounded-full hover:bg-gray-50 dark:hover:bg-dark-muted transition-colors cursor-pointer"
              onClick={handleViewAttachment}
            >
              <Eye className="h-4 w-4 text-gray-400 dark:text-dark-foreground/60" />
            </button>
          )}
          <button 
            className="p-1.5 rounded-full hover:bg-gray-50 dark:hover:bg-dark-muted transition-colors cursor-pointer"
            onClick={onMaximize}
          >
            <Maximize2 className="h-4 w-4 text-gray-400 dark:text-dark-foreground/60" />
          </button>
        </div>
      </div>
    </div>
  )
}
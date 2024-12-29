import { Maximize2, Trash2 } from "lucide-react"
import { useQueryClient } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { toast } from "@/hooks/use-toast"

interface PinCardFooterProps {
  id: string
  onMaximize?: () => void
}

export function PinCardFooter({ id, onMaximize }: PinCardFooterProps) {
  const queryClient = useQueryClient()

  const handleDelete = async () => {
    try {
      const { error } = await supabase
        .from('kanban_items')
        .update({ deleted: true })
        .eq('id', id)

      if (error) throw error

      await queryClient.invalidateQueries({ queryKey: ['kanban'] })
      toast({
        title: "Success",
        description: "The card has been deleted successfully",
        duration: 3000, // Will disappear after 3 seconds
      })
    } catch (error) {
      console.error('Error deleting card:', error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "There was a problem deleting the card",
        duration: 3000,
      })
    }
  }

  return (
    <div className="mt-4 pt-2 border-t border-gray-100 dark:border-dark-border">
      <div className="flex items-center justify-between">
        <button 
          className="p-1.5 rounded-full hover:bg-gray-50 dark:hover:bg-dark-muted transition-colors cursor-pointer"
          onClick={handleDelete}
        >
          <Trash2 className="h-4 w-4 text-gray-400 dark:text-dark-foreground/60" />
        </button>
        <button 
          className="p-1.5 rounded-full hover:bg-gray-50 dark:hover:bg-dark-muted transition-colors cursor-pointer"
          onClick={onMaximize}
        >
          <Maximize2 className="h-4 w-4 text-gray-400 dark:text-dark-foreground/60" />
        </button>
      </div>
    </div>
  )
}
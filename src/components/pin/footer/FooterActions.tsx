import { Eye, Loader2, Maximize2, Trash2, Paperclip } from "lucide-react"

interface FooterActionsProps {
  isDeleting: boolean;
  onDelete: () => void;
  onMaximize: () => void;
  onViewAttachment?: () => void;
  onViewFirstAttachment?: () => void;
  hasAttachments: boolean;
  hasSourceInfo: boolean;
}

export function FooterActions({ 
  isDeleting,
  onDelete,
  onMaximize,
  onViewAttachment,
  onViewFirstAttachment,
  hasAttachments,
  hasSourceInfo
}: FooterActionsProps) {
  return (
    <div className="mt-4 pt-2 border-t border-gray-100 dark:border-dark-border">
      <div className="flex items-center justify-between">
        <button 
          className="p-1.5 rounded-full hover:bg-gray-50 dark:hover:bg-dark-muted transition-colors cursor-pointer disabled:cursor-not-allowed disabled:opacity-50"
          onClick={onDelete}
          disabled={isDeleting}
        >
          {isDeleting ? (
            <Loader2 className="h-4 w-4 text-gray-400 dark:text-dark-foreground/60 animate-spin" />
          ) : (
            <Trash2 className="h-4 w-4 text-gray-400 dark:text-dark-foreground/60" />
          )}
        </button>
        <div className="flex items-center gap-2">
          {hasAttachments && (
            <button 
              className="p-1.5 rounded-full hover:bg-gray-50 dark:hover:bg-dark-muted transition-colors cursor-pointer"
              onClick={onViewFirstAttachment}
            >
              <Paperclip className="h-4 w-4 text-gray-400 dark:text-dark-foreground/60" />
            </button>
          )}
          {hasSourceInfo && (
            <button 
              className="p-1.5 rounded-full hover:bg-gray-50 dark:hover:bg-dark-muted transition-colors cursor-pointer"
              onClick={onViewAttachment}
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
  );
}
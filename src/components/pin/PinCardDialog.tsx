import React from 'react';
import { MessageCircle, Calendar, User, Tag, Link2, Paperclip } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { formatDistanceToNow } from 'date-fns';

interface Comment {
  id: string;
  text: string;
  author: string;
  createdAt: string;
}

interface Attachment {
  url: string;
  name: string;
}

interface PinCardDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  icon?: string;
  content?: string;
  tags?: string[];
  dueDate?: string;
  assignedTo?: string;
  progress?: number;
  sourceInfo?: string;
  comments?: Comment[];
  attachments?: Attachment[];
}

const PinCardDialog = ({ 
  isOpen, 
  onOpenChange, 
  title,
  description,
  icon,
  content,
  tags = [],
  dueDate,
  assignedTo,
  progress = 0,
  sourceInfo,
  comments = [],
  attachments = []
}: PinCardDialogProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] animate-in zoom-in-90 duration-700 ease-in-out dark:bg-dark-background">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl font-semibold dark:text-dark-foreground">
            {icon && <span className="text-gray-500">{icon}</span>}
            {title}
          </DialogTitle>
        </DialogHeader>

        <div className="mt-4 space-y-6">
          <div className="space-y-4">
            <p className="text-gray-600 dark:text-dark-foreground/80">
              {description}
            </p>

            {content && (
              <div className="text-gray-600 dark:text-dark-foreground/80 prose dark:prose-invert">
                {content}
              </div>
            )}

            {attachments.length > 0 && (
              <div className="space-y-2">
                <h4 className="font-medium text-gray-900 dark:text-dark-foreground flex items-center gap-2">
                  <Paperclip className="w-4 h-4" />
                  Attachments
                </h4>
                <div className="space-y-2">
                  {attachments.map((attachment, index) => (
                    <a
                      key={index}
                      href={attachment.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block p-2 rounded-lg bg-gray-50 dark:bg-dark-muted/50 hover:bg-gray-100 dark:hover:bg-dark-muted transition-colors"
                    >
                      <div className="flex items-center gap-2">
                        <Paperclip className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-600 dark:text-dark-foreground/80">
                          {attachment.name}
                        </span>
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            )}

            {tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {tags.map((tag, index) => (
                  <span 
                    key={index}
                    className="inline-flex items-center px-2 py-1 rounded bg-dark-accent/20 text-dark-accent"
                  >
                    <Tag className="w-4 h-4 mr-1" />
                    {tag}
                  </span>
                ))}
              </div>
            )}

            <div className="flex flex-wrap gap-4 text-sm text-gray-500 dark:text-dark-foreground/60">
              {dueDate && (
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  <span>{formatDistanceToNow(new Date(dueDate), { addSuffix: true })}</span>
                </div>
              )}

              {assignedTo && (
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4" />
                  <span>{assignedTo}</span>
                </div>
              )}

              {sourceInfo && (
                <div className="flex items-center gap-2">
                  <Link2 className="w-4 h-4" />
                  <span>{sourceInfo}</span>
                </div>
              )}
            </div>

            {progress > 0 && (
              <div className="w-full bg-gray-200 dark:bg-dark-muted rounded-full h-2">
                <div 
                  className="bg-dark-accent h-2 rounded-full" 
                  style={{ width: `${progress}%` }}
                />
              </div>
            )}
          </div>

          {comments.length > 0 && (
            <div className="space-y-4">
              <h4 className="font-medium text-gray-900 dark:text-dark-foreground flex items-center gap-2">
                <MessageCircle className="w-4 h-4" />
                Comments
              </h4>
              <div className="space-y-3">
                {comments.map((comment) => (
                  <div key={comment.id} className="p-3 rounded-lg bg-gray-50 dark:bg-dark-muted/50">
                    <div className="flex justify-between items-start mb-1">
                      <span className="font-medium text-sm text-gray-900 dark:text-dark-foreground">
                        {comment.author}
                      </span>
                      <span className="text-xs text-gray-500 dark:text-dark-foreground/60">
                        {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-dark-foreground/80">
                      {comment.text}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PinCardDialog;
import { Calendar, User, Link2 } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import DialogTags from './DialogTags';
import DialogAttachments from './DialogAttachments';
import DialogComments from './DialogComments';

interface DialogContentProps {
  description: string;
  content?: string;
  tags?: string[];
  dueDate?: string;
  assignedTo?: string;
  progress?: number;
  sourceInfo?: string;
  attachments?: { url: string; name: string; }[];
  comments?: { id: string; text: string; author: string; createdAt: string; }[];
}

const DialogContent = ({
  description,
  content,
  tags = [],
  dueDate,
  assignedTo,
  progress = 0,
  sourceInfo,
  attachments = [],
  comments = []
}: DialogContentProps) => {
  const shouldShowContent = content && 
    !content.includes('[Ver archivo]') && 
    !content.includes('bamdlnybhcqkiihpwdlz.supabase.co');

  return (
    <div className="mt-4 space-y-6">
      <div className="space-y-4">
        <p className="text-gray-600 dark:text-dark-foreground/80">
          {description}
        </p>

        {shouldShowContent && (
          <div className="text-gray-600 dark:text-dark-foreground/80 prose dark:prose-invert">
            {content}
          </div>
        )}

        <DialogAttachments attachments={attachments} />
        <DialogTags tags={tags} />

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

      <DialogComments comments={comments} />
    </div>
  );
};

export default DialogContent;
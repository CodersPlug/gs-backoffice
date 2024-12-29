import { MessageCircle } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface DialogCommentsProps {
  comments: {
    id: string;
    text: string;
    author: string;
    createdAt: string;
  }[];
}

const DialogComments = ({ comments }: DialogCommentsProps) => {
  if (comments.length === 0) return null;

  return (
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
  );
};

export default DialogComments;
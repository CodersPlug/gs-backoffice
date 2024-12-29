import { Paperclip } from 'lucide-react';

interface DialogAttachmentsProps {
  attachments: { url: string; name: string; }[];
}

const DialogAttachments = ({ attachments }: DialogAttachmentsProps) => {
  if (attachments.length === 0) return null;

  return (
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
  );
};

export default DialogAttachments;
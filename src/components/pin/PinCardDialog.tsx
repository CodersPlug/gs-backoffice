import {
  Dialog,
  DialogContent as UIDialogContent,
} from "@/components/ui/dialog";
import DialogHeader from './dialog/DialogHeader';
import DialogContent from './dialog/DialogContent';

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
      <UIDialogContent className="sm:max-w-[600px] animate-in zoom-in-90 duration-700 ease-in-out dark:bg-dark-background">
        <DialogHeader title={title} icon={icon} />
        <DialogContent 
          description={description}
          content={content}
          tags={tags}
          dueDate={dueDate}
          assignedTo={assignedTo}
          progress={progress}
          sourceInfo={sourceInfo}
          comments={comments}
          attachments={attachments}
        />
      </UIDialogContent>
    </Dialog>
  );
};

export default PinCardDialog;
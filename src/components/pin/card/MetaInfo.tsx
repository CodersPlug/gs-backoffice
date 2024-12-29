import { Calendar, User } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { isImageUrl } from '@/utils/urlUtils';
import PinCardSourceLink from '../PinCardSourceLink';

interface MetaInfoProps {
  dueDate?: string;
  assignedTo?: string;
  sourceInfo?: string;
}

const MetaInfo = ({ dueDate, assignedTo, sourceInfo }: MetaInfoProps) => {
  return (
    <div className="flex flex-wrap gap-3 text-xs text-gray-500 dark:text-dark-foreground/60">
      {dueDate && (
        <div className="flex items-center gap-1">
          <Calendar className="w-3 h-3" />
          <span>{formatDistanceToNow(new Date(dueDate), { addSuffix: true })}</span>
        </div>
      )}

      {assignedTo && (
        <div className="flex items-center gap-1">
          <User className="w-3 h-3" />
          <span>{assignedTo}</span>
        </div>
      )}

      {sourceInfo && !isImageUrl(sourceInfo) && (
        <PinCardSourceLink sourceInfo={sourceInfo} />
      )}
    </div>
  );
};

export default MetaInfo;
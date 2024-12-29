import React from 'react';
import { Calendar, Tag, User } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { isImageUrl } from '@/utils/urlUtils';
import PinCardSourceLink from './PinCardSourceLink';

interface PinCardContentProps {
  title: string;
  description: string;
  icon?: string;
  content?: string;
  tags?: string[];
  dueDate?: string;
  assignedTo?: string;
  progress?: number;
  sourceInfo?: string;
  image?: string;
}

const PinCardContent = ({ 
  title, 
  description,
  icon,
  content,
  tags = [],
  dueDate,
  assignedTo,
  progress = 0,
  sourceInfo,
  image
}: PinCardContentProps) => {
  // Only show image preview if there's an actual attachment (image or PDF snapshot)
  const hasAttachment = Boolean(image || (sourceInfo && isImageUrl(sourceInfo)));

  return (
    <div className="flex-1 space-y-3">
      {hasAttachment && (
        <div className="relative w-full h-32 mb-3 rounded-lg overflow-hidden">
          <img
            src={image || sourceInfo}
            alt="Attachment preview"
            className="w-full h-full object-cover"
          />
        </div>
      )}

      <div className="flex items-center gap-2">
        {icon && <span className="text-gray-500">{icon}</span>}
        <h3 className="font-medium text-gray-900 dark:text-dark-foreground line-clamp-1">
          {title}
        </h3>
      </div>

      <p className="text-sm text-gray-600 dark:text-dark-foreground/80 line-clamp-2">
        {description}
      </p>

      {content && (
        <div className="text-sm text-gray-600 dark:text-dark-foreground/80 line-clamp-3">
          {content}
        </div>
      )}

      {tags.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {tags.map((tag, index) => (
            <span 
              key={index}
              className="inline-flex items-center px-2 py-0.5 rounded text-xs bg-dark-accent/20 text-dark-accent"
            >
              <Tag className="w-3 h-3 mr-1" />
              {tag}
            </span>
          ))}
        </div>
      )}

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

      {progress > 0 && (
        <div className="w-full bg-gray-200 dark:bg-dark-muted rounded-full h-1.5">
          <div 
            className="bg-dark-accent h-1.5 rounded-full" 
            style={{ width: `${progress}%` }}
          />
        </div>
      )}
    </div>
  );
};

export default PinCardContent;
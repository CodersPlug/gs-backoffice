import TitleSection from './card/TitleSection';
import TagsList from './card/TagsList';
import MetaInfo from './card/MetaInfo';
import ProgressBar from './card/ProgressBar';

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
  return (
    <div className="flex-1 space-y-3">
      <TitleSection icon={icon} title={title} />

      <p className="text-sm text-gray-600 dark:text-dark-foreground/80 line-clamp-2">
        {description}
      </p>

      {content && !content.includes('[Ver archivo]') && (
        <div className="text-sm text-gray-600 dark:text-dark-foreground/80 line-clamp-3">
          {content}
        </div>
      )}

      <TagsList tags={tags} />
      
      <MetaInfo 
        dueDate={dueDate}
        assignedTo={assignedTo}
        sourceInfo={sourceInfo}
      />

      <ProgressBar progress={progress} />
    </div>
  );
};

export default PinCardContent;
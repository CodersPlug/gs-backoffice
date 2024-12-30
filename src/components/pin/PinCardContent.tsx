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
  // Parse content if it's a JSON string
  let parsedContent;
  try {
    if (content) {
      parsedContent = JSON.parse(content);
    }
  } catch (e) {
    parsedContent = null;
  }

  // Clean up description for PDFs
  const cleanDescription = description
    .replace(/PDF document: .*\.pdf/, 'PDF document')
    .replace(/{"filename":".*"}/, '')
    .replace(/\s+/g, ' ')
    .trim();

  // Show content based on type, excluding PDF technical details
  const shouldShowContent = content && 
    !content.includes('[Ver archivo]') && 
    !content.includes('bamdlnybhcqkiihpwdlz.supabase.co') &&
    !content.includes('https://') &&
    !content.includes('http://') &&
    !content.includes(sourceInfo || '') &&
    (!parsedContent?.fileType || parsedContent.fileType !== 'PDF');

  return (
    <div className="flex-1 space-y-3">
      <TitleSection icon={icon} title={title} />

      <p className="text-sm text-gray-600 dark:text-dark-foreground/80 line-clamp-2">
        {cleanDescription}
      </p>

      {shouldShowContent && parsedContent?.fullText && (
        <div className="text-sm text-gray-600 dark:text-dark-foreground/80 line-clamp-3">
          {parsedContent.fullText}
        </div>
      )}

      {shouldShowContent && !parsedContent?.fullText && (
        <div className="text-sm text-gray-600 dark:text-dark-foreground/80 line-clamp-3">
          {content}
        </div>
      )}

      <TagsList tags={tags} />
      
      <MetaInfo 
        dueDate={dueDate}
        assignedTo={assignedTo}
      />

      <ProgressBar progress={progress} />
    </div>
  );
};

export default PinCardContent;
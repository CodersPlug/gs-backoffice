import { Tag } from 'lucide-react';

interface DialogTagsProps {
  tags: string[];
}

const DialogTags = ({ tags }: DialogTagsProps) => {
  if (tags.length === 0) return null;

  return (
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
  );
};

export default DialogTags;
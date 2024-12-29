import { Tag } from 'lucide-react';

interface TagsListProps {
  tags: string[];
}

const TagsList = ({ tags }: TagsListProps) => {
  if (!tags.length) return null;

  return (
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
  );
};

export default TagsList;
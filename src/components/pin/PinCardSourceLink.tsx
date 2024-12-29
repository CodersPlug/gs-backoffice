import { Link2 } from 'lucide-react';
import { shortenUrl } from '@/utils/urlUtils';

interface PinCardSourceLinkProps {
  sourceInfo: string;
}

const PinCardSourceLink = ({ sourceInfo }: PinCardSourceLinkProps) => {
  const handleLinkClick = (url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <button
      onClick={() => handleLinkClick(sourceInfo)}
      className="flex items-center gap-1 hover:text-dark-accent transition-colors cursor-pointer"
    >
      <Link2 className="w-3 h-3" />
      <span className="line-clamp-1 underline">{shortenUrl(sourceInfo)}</span>
    </button>
  );
};

export default PinCardSourceLink;
import { FileText, Eye } from "lucide-react";

interface PinCardContentProps {
  title: string;
  description: string;
}

const PinCardContent = ({ title, description }: PinCardContentProps) => {
  return (
    <div className="relative p-4">
      <div className="flex items-start space-x-3 mb-3">
        <div className="p-2 bg-gray-50 dark:bg-dark-muted rounded-lg">
          <FileText className="h-5 w-5 text-gray-600 dark:text-dark-foreground" />
        </div>
        <div className="flex-1">
          <h3 className="font-medium text-gray-900 dark:text-dark-foreground mb-1 line-clamp-1">{title}</h3>
          <p className="text-sm text-gray-600 dark:text-dark-foreground/80 line-clamp-2">{description}</p>
        </div>
      </div>
      <div className="mt-3 pt-3 border-t border-gray-100 dark:border-dark-border">
        <div className="flex items-center justify-end">
          <Eye className="h-4 w-4 text-gray-400 dark:text-dark-foreground/60" />
        </div>
      </div>
    </div>
  );
};

export default PinCardContent;
import React from 'react';

interface PinCardContentProps {
  title: string;
  description: string;
}

const PinCardContent = ({ title, description }: PinCardContentProps) => {
  return (
    <div className="flex-1 space-y-3">
      <h3 className="font-medium text-gray-900 dark:text-dark-foreground line-clamp-1">
        {title}
      </h3>
      <p className="text-sm text-gray-600 dark:text-dark-foreground/80 line-clamp-2">
        {description}
      </p>
    </div>
  );
};

export default PinCardContent;
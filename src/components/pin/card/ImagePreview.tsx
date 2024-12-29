import { isImageUrl } from '@/utils/urlUtils';

interface ImagePreviewProps {
  image?: string;
  sourceInfo?: string;
}

const ImagePreview = ({ image, sourceInfo }: ImagePreviewProps) => {
  // Check if we have a valid image (either direct image or PDF snapshot)
  const hasValidImage = Boolean(image) || (sourceInfo && isImageUrl(sourceInfo));
  const hasSourceInfo = Boolean(sourceInfo);
  
  // If there's no image or source info at all, don't render anything
  if (!hasValidImage && !hasSourceInfo) {
    return null;
  }

  // If there's a source that's not an image (like a PDF), show document preview
  if (hasSourceInfo) {
    const fileName = sourceInfo?.split('/').pop() || 'Document';
    return (
      <div className="relative w-full mb-3 p-4 rounded-lg bg-gray-100 dark:bg-dark-muted/50 space-y-2">
        <div className="flex items-center gap-2">
          <span className="text-gray-500 dark:text-dark-foreground/60">📄</span>
          <span className="text-sm font-medium text-gray-700 dark:text-dark-foreground/80 truncate">
            {fileName}
          </span>
        </div>
        <div className="text-xs text-gray-500 dark:text-dark-foreground/60">
          Archivo subido a través del Asistente AI
        </div>
        {image && (
          <div className="relative w-full h-32 mt-2 rounded-lg overflow-hidden">
            <img
              src={image}
              alt="PDF preview"
              className="w-full h-full object-cover"
            />
          </div>
        )}
      </div>
    );
  }

  // If we have a direct image (not a PDF), show it
  const imageToShow = image || sourceInfo;
  return (
    <div className="relative w-full h-32 mb-3 rounded-lg overflow-hidden">
      <img
        src={imageToShow}
        alt="Attachment preview"
        className="w-full h-full object-cover"
      />
    </div>
  );
};

export default ImagePreview;
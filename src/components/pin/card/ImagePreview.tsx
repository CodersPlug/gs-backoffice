import { isImageUrl } from '@/utils/urlUtils';

interface ImagePreviewProps {
  image?: string;
  sourceInfo?: string;
}

const ImagePreview = ({ image, sourceInfo }: ImagePreviewProps) => {
  // Only show preview if there's an actual image or sourceInfo that is an image URL
  const hasValidImage = Boolean(image) || (sourceInfo && isImageUrl(sourceInfo));
  const hasSourceInfo = Boolean(sourceInfo);
  
  // If there's no image or source info at all, don't render anything
  if (!hasValidImage && !hasSourceInfo) {
    return null;
  }

  // If there's a source that's not an image (like a PDF), show document preview
  if (!hasValidImage && hasSourceInfo) {
    return (
      <div className="relative w-full h-32 mb-3 rounded-lg overflow-hidden bg-gray-100 dark:bg-dark-muted flex items-center justify-center">
        <div className="text-center p-4">
          <div className="text-gray-500 dark:text-dark-foreground/60 text-sm">
            📄 Document Preview
          </div>
        </div>
      </div>
    );
  }

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
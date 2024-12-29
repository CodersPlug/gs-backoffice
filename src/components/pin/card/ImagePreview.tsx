import { isImageUrl } from '@/utils/urlUtils';

interface ImagePreviewProps {
  image?: string;
  sourceInfo?: string;
}

const ImagePreview = ({ image, sourceInfo }: ImagePreviewProps) => {
  // Only show direct images
  const imageToShow = image || (sourceInfo && isImageUrl(sourceInfo) ? sourceInfo : null);
  
  if (!imageToShow) {
    return null;
  }

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
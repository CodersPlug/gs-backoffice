import { isImageUrl } from '@/utils/urlUtils';

interface ImagePreviewProps {
  image?: string;
  sourceInfo?: string;
}

const ImagePreview = ({ image, sourceInfo }: ImagePreviewProps) => {
  // Only show preview if there's an actual image or sourceInfo that is an image URL
  const hasValidImage = Boolean(image) || (sourceInfo && isImageUrl(sourceInfo));
  
  if (!hasValidImage) return null;

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
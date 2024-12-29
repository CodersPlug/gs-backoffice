export const shortenUrl = (url: string): string => {
  try {
    const urlObj = new URL(url);
    return urlObj.hostname + (urlObj.pathname.length > 1 ? '...' : '');
  } catch {
    return url;
  }
};

export const isImageUrl = (url: string): boolean => {
  // Check if the URL ends with common image extensions
  const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg'];
  const lowercaseUrl = url.toLowerCase();
  return imageExtensions.some(ext => lowercaseUrl.endsWith(ext));
};
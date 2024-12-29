export const shortenUrl = (url: string) => {
  try {
    const urlObj = new URL(url);
    return `${urlObj.hostname}${urlObj.pathname.slice(0, 15)}${urlObj.pathname.length > 15 ? '...' : ''}`;
  } catch {
    return url.slice(0, 30) + (url.length > 30 ? '...' : '');
  }
};

export const isImageUrl = (url?: string) => {
  if (!url) return false;
  return url.match(/\.(jpeg|jpg|gif|png)$/) !== null;
};
import { useEffect, useState } from 'react';
import Image from 'next/image';

const LOCAL_UPLOADS_BASE_URL = process.env.NEXT_PUBLIC_TOOLS_UPLOADS_URL || 'http://localhost:8001/uploads';

const FALLBACK_EMOJIS = { drill: '🔨', saw: '🪚', ladder: '🪜', washer: '🌀', wrench: '🔧', grinder: '🔩' };

const getEmoji = (title = '') => {
  const toolTitle = title.toLowerCase();
  return Object.entries(FALLBACK_EMOJIS).find(([key]) => toolTitle.includes(key))?.[1] || '🛠️';
};

const toLocalToolImageUrl = (imageUrl = '') => {
  if (!imageUrl) return '';
  if (imageUrl.startsWith(LOCAL_UPLOADS_BASE_URL)) return imageUrl;

  const extractPath = (value) => {
    try {
      const parsed = new URL(value);
      return parsed.pathname.replace(/^\/+/, '');
    } catch {
      return value.replace(/^\/+/, '');
    }
  };

  let path = extractPath(imageUrl);
  if (path.startsWith('uploads/')) {
    path = path.slice('uploads/'.length);
  }

  return path ? `${LOCAL_UPLOADS_BASE_URL}/${path}` : '';
};

export default function ToolImage({ imageUrl, title, className, sizes, alt, fill, style }) {
  const [resolvedSrc, setResolvedSrc] = useState(imageUrl || '');
  const [imageFailed, setImageFailed] = useState(false);

  useEffect(() => {
    setResolvedSrc(imageUrl || '');
    setImageFailed(false);
  }, [imageUrl]);

  const hasImage = resolvedSrc && !resolvedSrc.includes('dummy-cloud-storage');

  if (!hasImage || imageFailed) {
    return <span className={className}>{getEmoji(title)}</span>;
  }

  return (
    <Image
      src={resolvedSrc}
      alt={alt || title}
      fill={fill}
      style={style}
      sizes={sizes}
      onError={() => {
        const fallbackSrc = toLocalToolImageUrl(imageUrl || resolvedSrc);
        if (fallbackSrc && fallbackSrc !== resolvedSrc) {
          setResolvedSrc(fallbackSrc);
          return;
        }
        setImageFailed(true);
      }}
    />
  );
}
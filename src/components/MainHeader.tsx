import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useBlogConfig } from '../react/config.tsx';

let hasWebPSupport: boolean;
const supportsWebP = () => {
  if (typeof document === 'undefined') {
    return true;
  }

  if (hasWebPSupport != null) {
    return hasWebPSupport;
  }
  const element = document.createElement('canvas');
  return (hasWebPSupport =
    element.getContext && element.getContext('2d')
      ? element.toDataURL('image/webp').indexOf('data:image/webp') == 0
      : false);
};

export default function MainHeader() {
  const config = useBlogConfig();
  const configuredImages = useMemo(
    () =>
      config.site.headerImages ?? [
        '/assets/0.jpg',
        '/assets/1.jpg',
        '/assets/2.jpg',
      ],
    [config.site.headerImages],
  );
  const initialImage = configuredImages[0] ?? null;
  const [loadedImages, setLoadedImages] = useState<Set<string>>(
    new Set(initialImage ? [initialImage] : []),
  );

  const [currentImage, setCurrentImage] = useState<string | null>(initialImage);

  const imagesRef = useRef<Set<string>>(new Set());
  const loadImage = useCallback(() => {
    const remainingImages = configuredImages
      .map((source) =>
        supportsWebP()
          ? source.replace(/\.(?:jpg|jpeg|png)$/i, '.webp')
          : source,
      )
      .filter((source) => !loadedImages.has(source));
    const source = remainingImages[0];

    if (source) {
      const img = document.createElement('img');
      img.src = source;
      img.onload = () => {
        setLoadedImages(new Set([...Array.from(loadedImages), source]));
        imagesRef.current.add(source);
        img.onload = null;
      };
    }
  }, [configuredImages, loadedImages]);

  useEffect(() => {
    // Only load one image every few seconds instead of
    // eagerly loading every image to save bandwidth.
    const timer = setTimeout(loadImage, 1000);
    return () => clearTimeout(timer);
  }, [loadImage, loadedImages]);

  useEffect(() => {
    const interval = setInterval(() => {
      const images = Array.from(imagesRef.current);
      const nextImage = images.pop();
      if (nextImage) {
        setCurrentImage(nextImage);
        imagesRef.current = new Set([nextImage, ...images]);
      }
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="main-header relative bg-cover bg-no-repeat">
      {Array.from(loadedImages)
        .sort()
        .map((source) => (
          <div
            className="cover-image absolute inset-0 bg-cover bg-no-repeat transition-opacity duration-1000"
            key={source}
            style={
              {
                backgroundImage: `url('${source}')`,
                opacity:
                  loadedImages.size === 1 || currentImage === source ? 1 : 0,
              } as React.CSSProperties
            }
          />
        ))}
    </header>
  );
}

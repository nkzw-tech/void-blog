import { useCallback, useRef, useState } from 'react';

const defaultObserverOptions = { rootMargin: '0px 0px -80% 0px' };

export default function useActiveHeader<T extends HTMLElement>(
  {
    headingSelector,
    observerOptions,
  }: { headingSelector: string; observerOptions: IntersectionObserverInit } = {
    headingSelector: 'h2, h3, h4, h5, h6',
    observerOptions: defaultObserverOptions,
  },
): [string | null, (element: T) => void] {
  const containerRef = useRef<{
    element: T;
    observer: IntersectionObserver;
  } | null>(null);
  const [activeHeading, setActiveHeading] = useState<string | null>(null);

  const setRef = useCallback(
    (element: T) => {
      if (containerRef.current) {
        containerRef.current.observer.disconnect();
        containerRef.current = null;
      }

      if (!element || !('IntersectionObserver' in window)) {
        return;
      }

      const callback = (headings: Array<IntersectionObserverEntry>) => {
        const visibleHeading = headings
          .filter(({ isIntersecting }) => isIntersecting)
          .sort(
            (a, b) => a.boundingClientRect.top - b.boundingClientRect.top,
          )[0];

        if (visibleHeading) {
          setActiveHeading(visibleHeading.target.id);
        }
      };
      const observer = new IntersectionObserver(callback, observerOptions);
      Array.from(element.querySelectorAll(headingSelector)).forEach((element) =>
        observer.observe(element),
      );

      containerRef.current = { element, observer };
    },
    [headingSelector, observerOptions],
  );

  return [activeHeading, setRef];
}

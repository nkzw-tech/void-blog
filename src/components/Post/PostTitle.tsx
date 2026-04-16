import { ReactNode, useCallback, useRef } from 'react';
import cx from '../../lib/cx.tsx';
import getPostTypeColor from '../../lib/getPostTypeColor.ts';
import StickyEvents from '../../lib/StickyEvents.js';
import { PostType } from '../../lib/Types.ts';
import { useBlogConfig } from '../../react/config.tsx';
import H1 from '../H1.tsx';

const event = (event: CustomEvent<{ isSticky: boolean }>) => {
  (event.target as HTMLElement)?.classList.toggle(
    'is-sticky',
    event.detail.isSticky,
  );
};

export default function PostTitle({
  children,
  type,
}: {
  children?: ReactNode;
  type: PostType | null;
}) {
  const config = useBlogConfig();
  const ref = useRef<{
    element: HTMLElement;
    stickyEvents: StickyEvents;
  } | null>(null);

  const setRef = useCallback((element: HTMLDivElement) => {
    if (ref.current) {
      const { element, stickyEvents } = ref.current;
      element.removeEventListener(
        StickyEvents.CHANGE,
        event as EventListener,
        false,
      );
      stickyEvents?.disableEvents();
      ref.current = null;
    }

    if (element) {
      element.addEventListener(
        StickyEvents.CHANGE,
        event as EventListener,
        false,
      );
      ref.current = {
        element,
        stickyEvents: new StickyEvents(),
      };
    }
  }, []);
  return (
    <div
      className="sticky-events sticky top-0 z-20 backdrop-blur-xl"
      ref={setRef}
    >
      <div className="mx-auto max-w-(--breakpoint-md) px-4 py-2">
        <H1
          className={cx(
            'post-title relative z-20 px-6 text-center md:text-3xl',
            getPostTypeColor(type, config) || 'text-cblue',
          )}
        >
          {children}
        </H1>
      </div>
    </div>
  );
}

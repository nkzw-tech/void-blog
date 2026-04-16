import { ReactNode, useCallback, useRef } from 'react';
import { Instance } from 'tippy.js';
import createTippyInstance from '../lib/createTippyInstance.tsx';

export default function InlineNote({
  children,
  id,
}: {
  children: ReactNode;
  id: string;
}) {
  const tippyRef = useRef<Instance | null>(null);

  const setRef = useCallback((element: HTMLElement | null) => {
    tippyRef.current?.destroy();
    tippyRef.current = null;

    if (!element) {
      return;
    }

    const anchor = element.querySelector('.void-blog-inline-note');
    const content = element.querySelector('.void-blog-inline-note-content');

    if (
      !anchor ||
      !content ||
      // oxlint-disable-next-line @nkzw/no-instanceof
      !(anchor instanceof HTMLElement) ||
      // oxlint-disable-next-line @nkzw/no-instanceof
      !(content instanceof HTMLElement)
    ) {
      return;
    }

    const copy = content.cloneNode(true) as HTMLElement;
    copy.classList.remove('hidden');
    tippyRef.current = createTippyInstance(anchor, copy);
  }, []);

  return (
    <sup ref={setRef}>
      <a className="void-blog-inline-note cursor-pointer">{id}</a>
      <span className="void-blog-inline-note-content hidden">{children}</span>
    </sup>
  );
}

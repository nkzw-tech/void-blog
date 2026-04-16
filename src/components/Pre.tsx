import { ComponentProps, useEffect, useRef, useState } from 'react';
import { Instance } from 'tippy.js';
import createTippyInstance from '../lib/createTippyInstance.tsx';

export default function Pre({ children, ...props }: ComponentProps<'pre'>) {
  const tippyRef = useRef<Instance | null>(null);

  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (copied) {
      const timeout = setTimeout(() => setCopied(false), 2000);
      return () => clearTimeout(timeout);
    }
  }, [copied]);

  const setRef = (element: HTMLElement | null) => {
    tippyRef.current?.destroy();
    tippyRef.current = null;

    if (!element) {
      return;
    }

    tippyRef.current = createTippyInstance(element, 'Copy to Clipboard');
  };

  return (
    <pre {...props}>
      {children}
      <div
        className="void-blog-pressable absolute top-1 right-1 cursor-pointer select-none"
        onClick={async (event) => {
          setCopied(false);

          let hasClipboardPermissions = null;
          try {
            hasClipboardPermissions = await navigator.permissions?.query({
              // @ts-expect-error
              name: 'clipboard-write',
            });
          } catch {
            /* empty */
          }

          if (
            hasClipboardPermissions?.state === 'granted' ||
            hasClipboardPermissions?.state === 'prompt'
          ) {
            const element = event.target as HTMLElement;
            const code = Array.from(
              element.parentNode?.parentNode?.querySelectorAll<HTMLDivElement>(
                'code > span.line',
              ) || [],
            )
              .map((element) => element?.textContent || element?.innerText)
              .join('\n')
              .replaceAll(/\n\s\n/g, '\n\n');

            if (code) {
              navigator?.clipboard.writeText(code);
              setCopied(true);
            }
          }
        }}
        ref={setRef}
      >
        <svg
          fill="none"
          height="24"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          viewBox="0 0 24 24"
          width="24"
          xmlns="http://www.w3.org/2000/svg"
        >
          {copied ? (
            <>
              <path d="m12 15 2 2 4-4" />
              <rect height="14" rx="2" ry="2" width="14" x="8" y="8" />
              <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
            </>
          ) : (
            <>
              <rect height="14" rx="2" ry="2" width="14" x="8" y="8" />
              <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
            </>
          )}
        </svg>
      </div>
    </pre>
  );
}

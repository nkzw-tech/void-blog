import type { ReactNode } from 'react';

export default function Callout({ children }: { children: ReactNode }) {
  return <aside className="docs-callout">{children}</aside>;
}

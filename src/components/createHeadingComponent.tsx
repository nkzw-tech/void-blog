import { ReactNode } from 'react';

export default function createHeadingComponent(
  Component: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6',
) {
  return ({ children, id }: { children: ReactNode; id: string }) => (
    <Component id={id}>
      <a href={`#${id}`}>{children}</a>
    </Component>
  );
}

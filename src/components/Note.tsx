import { ReactNode } from 'react';

export default function Note({ children }: { children: ReactNode }) {
  return (
    <div
      className="void-blog-note rounded-[16px] rounded-l-none border-l-4 border-solid py-1 pr-5 pl-4 italic [corner-shape:squircle]"
      style={{
        backgroundColor: 'var(--background-color-light)',
        borderColor: 'var(--link-color)',
      }}
    >
      <span className="font-bold">Note: </span>
      {children}
    </div>
  );
}

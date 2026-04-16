import type { ReactNode } from 'react';
import { useBlogConfig } from '../react/config.tsx';

export default function Footer({ children }: { children?: ReactNode }) {
  const config = useBlogConfig();
  const links = [
    ...(config.site.email
      ? [{ href: `mailto:${config.site.email}`, label: 'e-mail' }]
      : []),
    ...(config.site.footerLinks ?? []),
  ];

  return (
    <div className="footer z-20 my-4 py-4 text-center whitespace-nowrap">
      {children ? <>{children}&middot;</> : null}
      {links.map(({ href, label }, index) => (
        <span key={`${href}:${label}`}>
          {index > 0 ? '·' : null}
          <a
            className="void-blog-pressable inline-block p-2 hover:underline md:p-3"
            href={href}
          >
            {label}
          </a>
        </span>
      ))}
    </div>
  );
}

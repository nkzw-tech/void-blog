import { Link } from '@void/react';
import type { AnchorHTMLAttributes, ComponentProps } from 'react';
import { useBlogConfig } from '../react/config.tsx';

const hasFileExtension = (href: string) =>
  /\/[^/?#]+\.[^/]+(?:$|[?#])/.test(href);

const toLocalHref = (href: string, siteUrl: string) => {
  for (const prefix of [siteUrl, siteUrl.replace('https://', 'http://')]) {
    if (href.startsWith(prefix)) {
      return href.slice(prefix.length) || '/';
    }
  }

  return href;
};

export default function MarkdownLink({
  href,
  rel,
  target,
  ...props
}: AnchorHTMLAttributes<HTMLAnchorElement>) {
  const config = useBlogConfig();

  if (!href) {
    return <a {...props} />;
  }

  const localHref = toLocalHref(href, config.site.url);

  if (localHref.startsWith('#')) {
    return <a href={localHref} rel={rel} target={target} {...props} />;
  }

  if (
    localHref.startsWith('/') &&
    !localHref.startsWith('//') &&
    !hasFileExtension(localHref)
  ) {
    const linkProps = props as Omit<ComponentProps<typeof Link>, 'href'>;

    return <Link {...linkProps} href={localHref} prefetch />;
  }

  const isExternal = /^(?:[a-z]+:)?\/\//i.test(href);

  return (
    <a
      href={href}
      rel={rel ?? (isExternal ? 'noreferrer' : undefined)}
      target={target ?? (isExternal ? '_blank' : undefined)}
      {...props}
    />
  );
}

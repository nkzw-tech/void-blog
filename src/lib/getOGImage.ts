import type { BlogGeneratedConfig, BlogOGImageTheme } from './Types.ts';

export type OGImageTheme = BlogOGImageTheme;

export default function getOGImage(
  slug: string,
  config: Pick<BlogGeneratedConfig, 'site'>,
): string {
  return `${config.site.url}/og/${slug}.png`;
}

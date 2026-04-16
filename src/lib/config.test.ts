import { describe, expect, test } from 'vite-plus/test';
import { defineBlog, toGeneratedConfig } from './config.ts';

describe('defineBlog', () => {
  test('normalizes paths and fills defaults', () => {
    const config = defineBlog({
      contentDir: './content/posts/',
      routeBase: 'writing/',
      site: {
        description: 'Posts about software.',
        name: 'Example',
        url: 'https://example.com/',
      },
    });

    expect(config.contentDir).toBe('content/posts');
    expect(config.routeBase).toBe('/writing');
    expect(config.site.url).toBe('https://example.com');
    expect(config.site.title).toBe('Example');
    expect(config.text.latestArticle).toBe('Latest Article');
    expect(config.postTypeColors.guide).toBe('purple');
  });

  test('returns a serializable generated config', () => {
    const config = defineBlog({
      intro: 'not serialized',
      site: {
        description: 'Posts about software.',
        name: 'Example',
        url: 'https://example.com',
      },
    });

    expect(toGeneratedConfig(config)).not.toHaveProperty('intro');
  });
});

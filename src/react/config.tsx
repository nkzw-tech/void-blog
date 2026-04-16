import { createContext, ReactNode, useContext } from 'react';
import { defineBlog } from '../lib/config.ts';
import type { BlogConfig } from '../lib/Types.ts';

const defaultConfig = defineBlog({
  site: {
    description: 'A Void blog.',
    name: 'Void Blog',
    url: 'https://example.com',
  },
});

const BlogConfigContext = createContext<BlogConfig>(defaultConfig);

export function BlogConfigProvider({
  children,
  config,
}: {
  children: ReactNode;
  config: BlogConfig;
}) {
  return (
    <BlogConfigContext.Provider value={config}>
      {children}
    </BlogConfigContext.Provider>
  );
}

export function useBlogConfig(): BlogConfig {
  return useContext(BlogConfigContext);
}

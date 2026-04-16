import { existsSync } from 'node:fs';
import { isAbsolute, join, relative, resolve } from 'node:path';
import type { Plugin, ViteDevServer } from 'vite';
import { defineBlog, toGeneratedConfig } from './lib/config.ts';
import type {
  BlogConfigInput,
  BlogRouteComponentImports,
} from './lib/Types.ts';
import { generateContent, generateOgImages } from './node/content.ts';

const buildSentinel = 'VOID_BLOG_CONTENT_GENERATED';
const escapeRegExp = (value: string) =>
  value.replaceAll(/[.*+?^${}()|[\]\\]/g, String.raw`\$&`);

const defaultConfigFiles = [
  'blog.config.ts',
  'blog.config.tsx',
  'blog.config.js',
  'blog.config.mjs',
];

export type VoidBlogPluginOptions = Readonly<{
  configImport?: string | false;
  routes?: BlogRouteComponentImports;
}>;

const normalizePath = (path: string) => path.replaceAll('\\', '/');

const resolveConfigImport = (
  root: string,
  configImport: VoidBlogPluginOptions['configImport'],
) => {
  if (configImport === false) {
    return undefined;
  }

  if (configImport) {
    return normalizePath(configImport);
  }

  return defaultConfigFiles.find((file) => existsSync(join(root, file)));
};

export function voidBlog(
  input: BlogConfigInput,
  options: VoidBlogPluginOptions = {},
): Plugin {
  const blogConfig = defineBlog(input);
  const config = toGeneratedConfig(blogConfig);
  let command: 'serve' | 'build' = 'serve';
  let queue = Promise.resolve();
  let root = process.cwd();

  const postFilePattern = new RegExp(
    `/${escapeRegExp(config.contentDir)}/.+\\.mdx$`,
  );

  const runSync = (server?: ViteDevServer) => {
    queue = queue.then(async () => {
      if (command === 'build' && process.env[buildSentinel] === '1') {
        return;
      }

      const { publishedPosts } = generateContent({
        config: blogConfig,
        configImport: resolveConfigImport(root, options.configImport),
        root,
        routeComponentImports: options.routes,
      });

      if (command === 'build') {
        await generateOgImages({ config, posts: publishedPosts, root });
        process.env[buildSentinel] = '1';
      }

      if (server) {
        server.ws.send({ type: 'full-reload' });
      }
    });

    return queue;
  };

  return {
    async buildStart() {
      if (command === 'serve') {
        return;
      }

      await runSync();
    },
    config(userConfig, env) {
      command = env.command;
      root = userConfig.root
        ? isAbsolute(userConfig.root)
          ? userConfig.root
          : resolve(process.cwd(), userConfig.root)
        : process.cwd();

      generateContent({
        config: blogConfig,
        configImport: resolveConfigImport(root, options.configImport),
        log: false,
        root,
        routeComponentImports: options.routes,
      });
    },
    configResolved(resolvedConfig) {
      command = resolvedConfig.command;
      root = resolvedConfig.root;
    },
    configureServer(server) {
      const onChange = async (file: string) => {
        const configImport = resolveConfigImport(root, options.configImport);
        const configFile = configImport
          ? normalizePath(`/${relative(root, join(root, configImport))}`)
          : null;
        const changedFile = normalizePath(`/${relative(root, file)}`);

        if (!postFilePattern.test(changedFile) && changedFile !== configFile) {
          return;
        }

        await runSync(server);
      };

      server.watcher.on('add', onChange);
      server.watcher.on('change', onChange);
      server.watcher.on('unlink', onChange);
    },
    enforce: 'pre',
    name: 'void-blog',
  };
}

export default voidBlog;

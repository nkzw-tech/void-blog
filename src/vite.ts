import { createHash } from 'node:crypto';
import { existsSync } from 'node:fs';
import { isAbsolute, join, relative, resolve } from 'node:path';
import { styleText } from 'node:util';
import type { Plugin, ViteDevServer } from 'vite';
import { defineBlog, toGeneratedConfig } from './lib/config.ts';
import type {
  BlogConfigInput,
  BlogRouteComponentImports,
} from './lib/Types.ts';
import {
  generateBlogConfigModule,
  generateContent,
  generateOgImages,
  generatePinnedPostModule,
  generatePostsModule,
} from './node/content.ts';

const escapeRegExp = (value: string) =>
  value.replaceAll(/[.*+?^${}()|[\]\\]/g, String.raw`\$&`);
const virtualBlogConfigId = 'void-blog/blog-config';
const virtualPinnedPostId = 'void-blog/pinned-post';
const virtualPostsId = 'void-blog/posts';
const virtualModuleIds = new Set([
  virtualBlogConfigId,
  virtualPinnedPostId,
  virtualPostsId,
]);
const resolvedVirtualPrefix = '\0';
const logGeneratedContent = () => {
  console.log(styleText('green', '✔ Generated void-blog content.'));
};

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
  let content: ReturnType<typeof generateContent> | null = null;
  let contentRoot: string | null = null;
  let queue = Promise.resolve();
  let root = process.cwd();

  const postFilePattern = new RegExp(
    `/${escapeRegExp(config.contentDir)}/.+\\.mdx$`,
  );
  const getBuildKey = () =>
    `${root}\0${config.contentDir}\0${config.routeBase}`;
  const getBuildSentinel = () =>
    `VOID_BLOG_CONTENT_GENERATED_${createHash('sha1').update(getBuildKey()).digest('hex')}`;

  const syncContent = (log?: boolean) => {
    content = generateContent({
      config: blogConfig,
      configImport: resolveConfigImport(root, options.configImport),
      log,
      root,
      routeComponentImports: options.routes,
    });
    contentRoot = root;

    return content;
  };

  const getContent = () =>
    content && contentRoot === root ? content : syncContent(false);

  const invalidateVirtualModules = (server: ViteDevServer) => {
    for (const virtualModuleId of virtualModuleIds) {
      const mod = server.moduleGraph.getModuleById(
        `${resolvedVirtualPrefix}${virtualModuleId}`,
      );

      if (mod) {
        server.moduleGraph.invalidateModule(mod);
      }
    }
  };

  const runSync = (server?: ViteDevServer) => {
    queue = queue.then(async () => {
      const buildSentinel = getBuildSentinel();

      if (command === 'build' && process.env[buildSentinel] === '1') {
        return;
      }

      let shouldReuseContent = false;
      let generatedContent: ReturnType<typeof generateContent>;

      if (command === 'build' && content && contentRoot === root) {
        generatedContent = content;
        shouldReuseContent = true;
      } else {
        generatedContent = syncContent();
      }

      if (command === 'build') {
        if (shouldReuseContent) {
          logGeneratedContent();
        }

        await generateOgImages({
          config,
          posts: generatedContent.publishedPosts,
          root,
        });
        process.env[buildSentinel] = '1';
      }

      if (server) {
        invalidateVirtualModules(server);
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

      syncContent(false);
    },
    configResolved(resolvedConfig) {
      command = resolvedConfig.command;
      if (root !== resolvedConfig.root) {
        content = null;
        contentRoot = null;
      }
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
    load(id) {
      if (!id.startsWith(resolvedVirtualPrefix)) {
        return;
      }

      const virtualId = id.slice(resolvedVirtualPrefix.length);

      if (!virtualModuleIds.has(virtualId)) {
        return;
      }

      const generatedContent = getContent();

      if (virtualId === virtualBlogConfigId) {
        return generateBlogConfigModule(generatedContent.config);
      }

      if (virtualId === virtualPinnedPostId) {
        return generatePinnedPostModule({
          config: generatedContent.config,
          pinnedPost: generatedContent.publishedPosts.find(
            (post) => post.pinned,
          ),
          root,
        });
      }

      if (virtualId === virtualPostsId) {
        return generatePostsModule(generatedContent.posts);
      }
    },
    name: 'void-blog',
    resolveId(id) {
      if (virtualModuleIds.has(id)) {
        return `${resolvedVirtualPrefix}${id}`;
      }
    },
  };
}

export default voidBlog;

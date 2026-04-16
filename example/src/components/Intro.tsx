export default function Intro() {
  return (
    <>
      <p>
        Void Blog turns a folder of MDX files into a Void-native blog with
        generated routes, loaders, metadata, RSS, sitemap, Markdown mirrors, and
        a small default React theme.
      </p>
      <p>
        These docs are the example app. Edit <code>example/posts/*.mdx</code> or{' '}
        <code>example/blog.config.ts</code> while{' '}
        <code>vp run void-blog-example#dev</code> runs to see the platform
        regenerate content automatically.
      </p>
    </>
  );
}

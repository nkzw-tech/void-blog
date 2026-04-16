import type { ShikiTransformer } from 'shiki';

const parseTitle = (raw: string | undefined) => {
  if (!raw) {
    return null;
  }

  const match = raw.match(
    /(?:^|\s)title=(?:"([^"]+)"|'([^']+)'|(\S+))(?:\s|$)/,
  );
  return match?.[1] ?? match?.[2] ?? match?.[3] ?? null;
};

export default function shikiTransformerCodeTitle(): ShikiTransformer {
  return {
    name: 'code-title',
    pre(node) {
      const raw = this.options.meta?.__raw;
      const title = parseTitle(raw);
      if (!title) {
        return;
      }

      node.properties ??= {};
      node.properties['data-title'] = title;
    },
  };
}

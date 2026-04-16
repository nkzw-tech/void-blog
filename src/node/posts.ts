import { spawnSync } from 'node:child_process';
import { readdirSync, readFileSync } from 'node:fs';
import { basename, join } from 'node:path';
import parseInteger from '@nkzw/core/parseInteger.js';
import { compareDesc, parseISO } from 'date-fns';
import matter from 'gray-matter';
import _readingTime from 'reading-time';
import type { BlogGeneratedConfig, BlogPost } from '../lib/Types.ts';

const readingTime = _readingTime as unknown as (text: string) => {
  minutes: number;
  time: number;
  words: { total: number };
};

const getLastUpdateDate = (root: string, fileName: string) => {
  const timestamp = parseInteger(
    spawnSync('git', ['log', '-1', '--pretty=%ct', fileName], {
      cwd: root,
      encoding: 'utf8',
    })?.stdout?.trim(),
  );

  return timestamp ? new Date(timestamp * 1000).toISOString() : null;
};

const isDate = (value: unknown): value is Date =>
  Object.prototype.toString.call(value) === '[object Date]';

export function assertSlug(slug: string) {
  if (!/^[a-z0-9-]+$/.test(slug)) {
    throw new Error(`Invalid post slug: ${slug}.`);
  }
}

export function readPosts({
  config,
  root,
}: {
  config: BlogGeneratedConfig;
  root: string;
}): ReadonlyArray<BlogPost> {
  const contentDir = join(root, config.contentDir);

  return readdirSync(contentDir)
    .filter((file) => file.endsWith('.mdx'))
    .map((file) => {
      const slug = basename(file, '.mdx');
      assertSlug(slug);

      const relativePath = `${config.contentDir}/${file}`;
      const { content, data } = matter(
        readFileSync(join(root, relativePath), 'utf8'),
      );
      const {
        minutes,
        words: { total: words },
      } = readingTime(content);

      if (typeof data.title !== 'string' || !data.title) {
        throw new Error(`Post '${slug}' must define a title.`);
      }

      if (!isDate(data.date) && (typeof data.date !== 'string' || !data.date)) {
        throw new Error(`Post '${slug}' must define a date.`);
      }

      if (typeof data.description !== 'string' || !data.description) {
        throw new Error(`Post '${slug}' must define a description.`);
      }

      return {
        ...data,
        date: isDate(data.date) ? data.date.toISOString() : String(data.date),
        lastUpdateDate: getLastUpdateDate(root, relativePath),
        minutes,
        slug,
        words,
      } as BlogPost;
    })
    .sort(({ date: dateA }, { date: dateB }) =>
      compareDesc(parseISO(dateA), parseISO(dateB)),
    );
}

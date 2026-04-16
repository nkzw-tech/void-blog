import getPostTypeColorName from './getPostTypeColorName.ts';
import type {
  BlogGeneratedConfig,
  BlogOGImageTheme,
  PostType,
} from './Types.ts';

const colorClassNames = {
  blue: 'text-cblue hover:text-cblue stroke-cblue',
  dark: 'text-neutral-700 hover:text-neutral-700 dark:text-neutral-200 dark:hover:text-neutral-200 stroke-neutral-700 dark:stroke-neutral-200',
  emerald:
    'text-emerald-500 hover:text-emerald-500 dark:text-emerald-400 dark:hover:text-emerald-400 stroke-emerald-500 dark:stroke-emerald-400',
  fuchsia:
    'text-fuchsia-500 hover:text-fuchsia-500 dark:text-fuchsia-400 dark:hover:text-fuchsia-400 stroke-fuchsia-500 dark:stroke-fuchsia-400',
  light: 'text-cblue hover:text-cblue stroke-cblue',
  pink: 'text-pink-500 hover:text-pink-500 dark:text-pink-400 dark:hover:text-pink-400 stroke-pink-500 dark:stroke-pink-400',
  purple:
    'text-purple-500 hover:text-purple-500 dark:text-purple-400 dark:hover:text-purple-400 stroke-purple-500 dark:stroke-purple-400',
} satisfies Record<BlogOGImageTheme, string>;

export default function getPostTypeColor(
  postType: PostType | null,
  config?: Pick<BlogGeneratedConfig, 'postTypeColors'>,
): string | null {
  if (!postType) {
    return null;
  }

  return colorClassNames[getPostTypeColorName(postType, config)] ?? null;
}

import type {
  BlogGeneratedConfig,
  BlogOGImageTheme,
  PostType,
} from './Types.ts';

export default function getPostTypeColorName(
  postType: PostType | null,
  config?: Pick<BlogGeneratedConfig, 'postTypeColors'>,
): BlogOGImageTheme {
  if (!postType) {
    return 'blue';
  }

  return config?.postTypeColors[postType] ?? 'blue';
}

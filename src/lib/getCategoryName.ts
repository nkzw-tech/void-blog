import type { BlogGeneratedConfig, Category } from './Types.ts';

export default function getCategoryName(
  category: Category,
  config: BlogGeneratedConfig,
): string {
  return config.categoryLabels[category] ?? category;
}

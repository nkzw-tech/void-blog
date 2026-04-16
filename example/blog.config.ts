import { defineBlog } from 'void-blog';
import Callout from './src/components/Callout.tsx';

export default defineBlog({
  categoryLabels: {
    authoring: 'Authoring',
    customization: 'Customization',
    setup: 'Setup',
  },
  contentDir: 'posts',
  mdxComponents: {
    Callout,
  },
  ogImage: false,
  postTypeColors: {
    guide: 'emerald',
    reference: 'light',
  },
  site: {
    description: 'Concise docs for building MDX blogs on Void.',
    footerLinks: [
      {
        href: 'https://void.cloud',
        label: 'void',
      },
    ],
    headerImages: ['/images/header.svg'],
    language: 'en-US',
    name: 'Void Blog Example',
    socialImage: 'http://localhost:4010/images/header.svg',
    url: 'http://localhost:4010',
  },
  text: {
    latestArticle: 'Start Here',
    postFooter: 'Built with void-blog.',
    relatedPosts: 'More docs',
  },
});

import { PostContent, PostWithContent } from '../../lib/Types.ts';
import { useBlogConfig } from '../../react/config.tsx';
import createHeadingComponent from '../createHeadingComponent.tsx';
import Image from '../Image.tsx';
import InlineNote from '../InlineNote.tsx';
import InlineTableOfContents from '../InlineTableOfContents.tsx';
import MarkdownLink from '../MarkdownLink.tsx';
import Media from '../Media.tsx';
import Note from '../Note.tsx';
import Pre from '../Pre.tsx';
import Video from '../Video.tsx';

const mdxComponents = {
  a: MarkdownLink,
  h1: createHeadingComponent('h1'),
  h2: createHeadingComponent('h2'),
  h3: createHeadingComponent('h3'),
  h4: createHeadingComponent('h4'),
  h5: createHeadingComponent('h5'),
  h6: createHeadingComponent('h6'),
  Image,
  InlineNote,
  Note,
  pre: Pre,
  Video,
};

export default function PostBody({
  content: Content,
  tableOfContents,
  youtube,
}: Partial<PostWithContent> & {
  content: PostContent;
}) {
  const config = useBlogConfig();

  return (
    <div className="markdown">
      <Content
        components={{
          ...mdxComponents,
          ...(config.mdxComponents ?? {}),
          Media: () => <Media youtube={youtube} />,
          TableOfContents: (props) => (
            <InlineTableOfContents
              {...props}
              tableOfContents={tableOfContents}
            />
          ),
        }}
      />
    </div>
  );
}

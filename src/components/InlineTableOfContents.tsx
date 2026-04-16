import { TableOfContents } from '../lib/Types.ts';

export default function InlineTableOfContents({
  skip = 0,
  tableOfContents,
}: {
  skip?: number | [number, number];
  tableOfContents: TableOfContents;
}) {
  return tableOfContents ? (
    <ol>
      {(Array.isArray(skip)
        ? tableOfContents.slice(skip[0], skip[1])
        : tableOfContents.slice(skip)
      ).map(({ children, id, value }) => (
        <li key={id}>
          <a href={`#${id}`}>{value}</a>
          {children?.length ? (
            <InlineTableOfContents tableOfContents={children} />
          ) : null}
        </li>
      ))}
    </ol>
  ) : null;
}
